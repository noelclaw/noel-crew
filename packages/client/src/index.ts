import net from "node:net";
import { randomUUID } from "node:crypto";

import { parseIpcEndpoint, readDiscoveryFile, type NoelCrewDiscoveryFile } from "./discovery.js";
import { connectTimeoutMs, maxIpcMessageBytes, noelCrewIpcVersion, parseIpcResponse, responseTimeoutMs, validateReaction, NoelCrewClientError, type NoelCrewIpcMethod, type NoelCrewIpcRequest, type NoelCrewReaction } from "./protocol.js";

export { getDiscoveryFilePath, parseIpcEndpoint, readDiscoveryFile, validateDiscovery, validateEndpoint, type NoelCrewDiscoveryFile, type ParsedIpcEndpoint } from "./discovery.js";
export { allowedReactions, NoelCrewClientError, type NoelCrewReaction } from "./protocol.js";

export interface NoelCrewClientOptions {
  readonly discoveryPath?: string;
  readonly connectTimeoutMs?: number;
  readonly responseTimeoutMs?: number;
}

export interface NoelCrewStatusResult {
  readonly ok: boolean;
  readonly appRunning: boolean;
  readonly unavailableReason?: string;
  readonly [key: string]: unknown;
}

export interface NoelCrewLeaseResult {
  readonly leaseId: string;
  readonly requestedPetId?: string;
  readonly targetKind: "default" | "explicit";
  readonly actualTargetPetId: string;
  readonly actualTargetPetName: string;
  readonly usingDefaultPet: boolean;
  readonly fallbackReason?: string;
  readonly expiresAt: number;
  readonly leaseActive: boolean;
}

export interface NoelCrewPetListResult {
  readonly ok: true;
  readonly pets: readonly NoelCrewPetListItem[];
  readonly defaultPetId: string;
}

export interface NoelCrewPetInstallResult {
  readonly ok: true;
  readonly petId: string;
  readonly displayName: string;
  readonly installed: true;
}

export interface NoelCrewPetListItem {
  readonly id: string;
  readonly displayName: string;
  readonly builtIn: boolean;
  readonly broken: boolean;
}

export interface NoelCrewClient {
  hello(): Promise<unknown>;
  status(options?: { readonly leaseId?: string }): Promise<NoelCrewStatusResult>;
  listPets(): Promise<NoelCrewPetListResult>;
  installPet(petId: string): Promise<NoelCrewPetInstallResult>;
  acquireLease(options?: { readonly requestedPetId?: string }): Promise<NoelCrewLeaseResult>;
  heartbeatLease(leaseId: string): Promise<{ readonly leaseId: string; readonly expiresAt: number }>;
  releaseLease(leaseId: string): Promise<{ readonly released: boolean }>;
  react(reaction: NoelCrewReaction, options?: { readonly leaseId?: string }): Promise<unknown>;
  say(message: string, options?: { readonly reaction?: NoelCrewReaction; readonly leaseId?: string }): Promise<unknown>;
}

export function createNoelCrewClient(options: NoelCrewClientOptions = {}): NoelCrewClient {
  return {
    hello: () => sendDiscoveredRequest("hello", {}, options),
    status: async (statusOptions) => {
      try {
        return await sendDiscoveredRequest<NoelCrewStatusResult>("status", { leaseId: statusOptions?.leaseId }, options);
      } catch (error) {
        return {
          ok: false,
          appRunning: false,
          unavailableReason: error instanceof Error ? error.message : "NoelCrew is unavailable.",
        };
      }
    },
    listPets: async () => parsePetListResult(await sendDiscoveredRequest("pets.list", {}, options)),
    installPet: async (petId) => parsePetInstallResult(await sendDiscoveredRequest("pets.install", { petId: validatePetId(petId) }, { ...options, responseTimeoutMs: options.responseTimeoutMs ?? 60_000 })),
    acquireLease: (leaseOptions) => sendDiscoveredRequest("lease.acquire", { requestedPetId: leaseOptions?.requestedPetId }, options),
    heartbeatLease: (leaseId) => sendDiscoveredRequest("lease.heartbeat", { leaseId }, options),
    releaseLease: (leaseId) => sendDiscoveredRequest("lease.release", { leaseId }, options),
    react: (reaction, reactOptions) => sendDiscoveredRequest("pet.react", { reaction: validateReaction(reaction), leaseId: reactOptions?.leaseId }, options),
    say: (message, sayOptions) => sendDiscoveredRequest("pet.say", { message, reaction: sayOptions?.reaction, leaseId: sayOptions?.leaseId }, options),
  };
}

export function parsePetInstallResult(value: unknown): NoelCrewPetInstallResult {
  if (!isRecord(value) || value.ok !== true || typeof value.petId !== "string" || typeof value.displayName !== "string" || value.installed !== true) {
    throw new NoelCrewClientError("invalid_response", "NoelCrew pet install response is invalid.");
  }
  return { ok: true, petId: value.petId, displayName: value.displayName, installed: true };
}

function validatePetId(value: string): string {
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(value) || value === "builtin") {
    throw new NoelCrewClientError("invalid_pet_id", "Invalid NoelCrew pet id.");
  }
  return value;
}

export function parsePetListResult(value: unknown): NoelCrewPetListResult {
  if (!isRecord(value) || value.ok !== true || !Array.isArray(value.pets) || typeof value.defaultPetId !== "string") {
    throw new NoelCrewClientError("invalid_response", "NoelCrew pet list response is invalid.");
  }
  return {
    ok: true,
    defaultPetId: value.defaultPetId,
    pets: value.pets.map(parsePetListItem),
  };
}

function parsePetListItem(value: unknown): NoelCrewPetListItem {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.displayName !== "string" || typeof value.builtIn !== "boolean" || typeof value.broken !== "boolean") {
    throw new NoelCrewClientError("invalid_response", "NoelCrew pet list item is invalid.");
  }
  return { id: value.id, displayName: value.displayName, builtIn: value.builtIn, broken: value.broken };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function sendDiscoveredRequest<T>(method: NoelCrewIpcMethod, params: unknown, options: NoelCrewClientOptions): Promise<T> {
  const discovery = readDiscoveryFile(options.discoveryPath);
  return sendRequest<T>(discovery, method, params, options);
}

export function sendRequest<T>(discovery: NoelCrewDiscoveryFile, method: NoelCrewIpcMethod, params: unknown, options: NoelCrewClientOptions = {}): Promise<T> {
  const request: NoelCrewIpcRequest = {
    id: randomUUID(),
    version: noelCrewIpcVersion,
    token: discovery.token,
    method,
    params,
  };

  const requestLine = `${JSON.stringify(request)}\n`;
  if (Buffer.byteLength(requestLine, "utf8") > maxIpcMessageBytes) {
    return Promise.reject(new NoelCrewClientError("request_too_large", "NoelCrew IPC request is too large."));
  }

  return new Promise<T>((resolve, reject) => {
    const endpoint = parseIpcEndpoint(discovery.endpoint);
    const socket = endpoint.kind === "tcp" ? net.createConnection({ host: endpoint.host, port: endpoint.port }) : net.createConnection(endpoint.path);
    let buffer = "";
    let settled = false;

    const connectTimer = setTimeout(() => finish(new NoelCrewClientError("connect_timeout", "Timed out connecting to NoelCrew.")), options.connectTimeoutMs ?? connectTimeoutMs);
    const responseTimer = setTimeout(() => finish(new NoelCrewClientError("response_timeout", "Timed out waiting for NoelCrew response.")), options.responseTimeoutMs ?? responseTimeoutMs);

    const finish = (error?: unknown, result?: T): void => {
      if (settled) return;
      settled = true;
      clearTimeout(connectTimer);
      clearTimeout(responseTimer);
      socket.destroy();
      if (error) reject(error);
      else resolve(result as T);
    };

    socket.setEncoding("utf8");
    socket.once("connect", () => {
      clearTimeout(connectTimer);
      socket.write(requestLine);
    });
    socket.on("data", (chunk) => {
      buffer += chunk;
      if (Buffer.byteLength(buffer, "utf8") > maxIpcMessageBytes) {
        finish(new NoelCrewClientError("response_too_large", "NoelCrew IPC response is too large."));
        return;
      }

      const newline = buffer.indexOf("\n");
      if (newline === -1) return;

      try {
        const parsed = parseIpcResponse<T>(JSON.parse(buffer.slice(0, newline)) as unknown);
        if (parsed.ok) finish(undefined, parsed.result);
        else finish(new NoelCrewClientError(parsed.error.code, parsed.error.message));
      } catch (error) {
        finish(error);
      }
    });
    socket.once("error", (error) => finish(new NoelCrewClientError("unavailable", error.message)));
    socket.once("end", () => {
      if (!settled) finish(new NoelCrewClientError("connection_closed", "NoelCrew closed the IPC connection before responding."));
    });
  });
}
