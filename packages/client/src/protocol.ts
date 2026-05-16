export const noelCrewIpcProtocol = "noelcrew-ipc";
export const noelCrewIpcVersion = 1;
export const maxIpcMessageBytes = 16 * 1024;
export const connectTimeoutMs = 2_000;
export const responseTimeoutMs = 3_000;

export const allowedReactions = [
  "idle",
  "thinking",
  "working",
  "editing",
  "running",
  "testing",
  "waiting",
  "waving",
  "success",
  "error",
  "celebrating",
] as const;

export type NoelCrewReaction = typeof allowedReactions[number];
export type NoelCrewIpcMethod = "hello" | "status" | "pets.list" | "pets.install" | "lease.acquire" | "lease.heartbeat" | "lease.release" | "pet.react" | "pet.say";

export interface NoelCrewIpcRequest {
  readonly id: string;
  readonly version: 1;
  readonly token: string;
  readonly method: NoelCrewIpcMethod;
  readonly params?: unknown;
}

export interface NoelCrewIpcOkResponse<T = unknown> {
  readonly id: string | null;
  readonly ok: true;
  readonly result: T;
}

export interface NoelCrewIpcErrorResponse {
  readonly id: string | null;
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export type NoelCrewIpcResponse<T = unknown> = NoelCrewIpcOkResponse<T> | NoelCrewIpcErrorResponse;

export function parseIpcResponse<T = unknown>(value: unknown): NoelCrewIpcResponse<T> {
  if (!isRecord(value)) throw new NoelCrewClientError("invalid_response", "IPC response must be an object.");
  if (typeof value.id !== "string" && value.id !== null) throw new NoelCrewClientError("invalid_response", "IPC response id is invalid.");

  if (value.ok === true) {
    return { id: value.id, ok: true, result: value.result as T };
  }

  if (value.ok === false && isRecord(value.error) && typeof value.error.code === "string" && typeof value.error.message === "string") {
    return { id: value.id, ok: false, error: { code: value.error.code, message: value.error.message } };
  }

  throw new NoelCrewClientError("invalid_response", "IPC response shape is invalid.");
}

export function validateReaction(value: string): NoelCrewReaction {
  if (!allowedReactions.includes(value as NoelCrewReaction)) {
    throw new NoelCrewClientError("invalid_reaction", "Invalid NoelCrew reaction.");
  }
  return value as NoelCrewReaction;
}

export class NoelCrewClientError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
