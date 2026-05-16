import { pickHookSpeech, validateHookSpeech } from "@noelclawai/agent-events";
import { allowedReactions, createNoelCrewClient, type NoelCrewClient, type NoelCrewReaction } from "@noelclawai/client";

export interface NoelCrewPiOptions {
  readonly clientFactory?: () => NoelCrewClient;
  readonly schedule?: (work: () => Promise<void>) => void;
  readonly debug?: boolean;
  readonly debugLog?: (message: string) => void;
  readonly random?: () => number;
  readonly now?: () => number;
}

export interface NoelCrewPiRuntime {
  readonly handleEvent: (event: unknown) => void;
  readonly handleCommand: (args: string, ctx?: NoelCrewPiCommandContext) => Promise<void>;
}

export interface NoelCrewPiExtensionApi {
  readonly on?: (eventName: string, handler: (event: unknown, ctx?: unknown) => unknown) => unknown;
  readonly registerCommand?: (name: string, command: { readonly description?: string; readonly handler: (args: string, ctx?: unknown) => unknown }) => unknown;
}

export interface NoelCrewPiCommandContext {
  readonly ui?: {
    readonly notify?: (message: string, type?: "info" | "warning" | "error") => void;
  };
}

export interface PiEventDecision {
  readonly reaction?: NoelCrewReaction;
  readonly speech?: "error";
  readonly markError?: boolean;
  readonly clearError?: boolean;
}

export interface PiEventEnvelope {
  readonly type: string;
  readonly payload?: unknown;
}

export type NoelCrewPiCommand =
  | { readonly kind: "help" }
  | { readonly kind: "status" }
  | { readonly kind: "test" }
  | { readonly kind: "react"; readonly reaction: NoelCrewReaction }
  | { readonly kind: "say"; readonly message: string };

const automaticTimeoutMs = 500;
const errorSuccessSuppressionMs = 5_000;
const boundedCommandSliceLength = 300;

export const allowedPiNoelCrewCommands = ["help", "status", "test", "react", "say"] as const;

export function createNoelCrewPiExtension(pi: unknown, options: NoelCrewPiOptions = {}): NoelCrewPiRuntime {
  const runtime = createNoelCrewPiRuntime(options);
  const api = isPiApi(pi) ? pi : undefined;
  if (!api) return runtime;

  const subscribe = (eventName: string): void => {
    api.on?.(eventName, (event) => runtime.handleEvent({ type: eventName, payload: event }));
  };

  for (const eventName of ["session_start", "session_shutdown", "agent_start", "agent_end", "turn_start", "tool_execution_start", "tool_execution_end"]) {
    subscribe(eventName);
  }

  api.registerCommand?.("noelcrew", {
    description: "Control NoelCrew desktop pet reactions and check local connection status.",
    handler: async (args, ctx) => runtime.handleCommand(args, isCommandContext(ctx) ? ctx : undefined),
  });

  return runtime;
}

export function createNoelCrewPiRuntime(options: NoelCrewPiOptions = {}): NoelCrewPiRuntime {
  const clientFactory = options.clientFactory ?? (() => createNoelCrewClient({ connectTimeoutMs: automaticTimeoutMs, responseTimeoutMs: automaticTimeoutMs }));
  const schedule = options.schedule ?? defaultSchedule;
  const debug = options.debug === true || process.env.NOELCREW_PI_DEBUG === "1";
  const debugLog = options.debugLog ?? ((message) => {
    if (debug) process.stderr.write(`${message}\n`);
  });
  let client: NoelCrewClient | undefined;
  let recentErrorAt = Number.NEGATIVE_INFINITY;
  let lastErrorSpeechAt = Number.NEGATIVE_INFINITY;

  const getClient = (): NoelCrewClient => {
    client ??= clientFactory();
    return client;
  };

  const runAutomatic = (decision: PiEventDecision | undefined): void => {
    if (!decision?.reaction) return;
    const reaction = decision.reaction;
    if (decision.markError) recentErrorAt = options.now?.() ?? Date.now();
    if (decision.clearError && (options.now?.() ?? Date.now()) - recentErrorAt < errorSuccessSuppressionMs) return;

    try {
      schedule(async () => {
        try {
          if (decision.speech === "error" && shouldSendErrorSpeech()) {
            await getClient().say(validateHookSpeech(pickHookSpeech("error", options.random)), { reaction });
            return;
          }
          await getClient().react(reaction);
        } catch (error) {
          debugLog(`NoelCrew Pi extension ignored error: ${sanitizeDebugError(error)}`);
        }
      });
    } catch (error) {
      debugLog(`NoelCrew Pi extension scheduling ignored error: ${sanitizeDebugError(error)}`);
    }
  };

  const shouldSendErrorSpeech = (): boolean => {
    const now = options.now?.() ?? Date.now();
    if (now - lastErrorSpeechAt < 20_000) return false;
    lastErrorSpeechAt = now;
    return true;
  };

  return {
    handleEvent(event) {
      try {
        runAutomatic(classifyPiEvent(event));
      } catch (error) {
        debugLog(`NoelCrew Pi event ignored error: ${sanitizeDebugError(error)}`);
      }
    },
    async handleCommand(args, ctx) {
      try {
        const command = parseNoelCrewCommand(args);
        await executeCommand(command, getClient(), ctx);
      } catch (error) {
        notify(ctx, sanitizeUserError(error), "error");
      }
    },
  };
}

export function classifyPiEvent(event: unknown): PiEventDecision | undefined {
  const envelope = normalizePiEvent(event);
  const type = envelope.type;
  const record = isRecord(envelope.payload) ? envelope.payload : isRecord(event) ? event : {};
  switch (type) {
    case "session_start":
      return { reaction: "waving" };
    case "session_shutdown":
      return { reaction: "idle" };
    case "agent_start":
      return { reaction: "thinking" };
    case "turn_start":
      return { reaction: "working" };
    case "agent_end":
      return { reaction: "success", clearError: true };
    case "tool_execution_start": {
      const reaction = classifyPiToolExecutionStart(record.toolName, record.args);
      return reaction ? { reaction } : undefined;
    }
    case "tool_execution_end":
      return record.isError === true ? { reaction: "error", speech: "error", markError: true } : undefined;
    default:
      return undefined;
  }
}

export function normalizePiEvent(event: unknown): PiEventEnvelope {
  if (isRecord(event) && typeof event.type === "string") {
    return { type: event.type, payload: "payload" in event ? event.payload : event };
  }
  return { type: "", payload: event };
}

export function classifyPiToolExecutionStart(toolName: unknown, args?: unknown): NoelCrewReaction | undefined {
  const normalized = typeof toolName === "string" ? toolName.toLowerCase() : "";
  if (!normalized || shouldIgnoreNoelCrewTool(normalized)) return undefined;
  if (/edit|write|patch|apply/.test(normalized)) return "editing";
  if (/bash|shell|terminal|exec|command/.test(normalized)) return isTestLikeArgs(args) ? "testing" : "running";
  return "working";
}

export function shouldIgnoreNoelCrewTool(toolName: string): boolean {
  const normalized = toolName.toLowerCase().replace(/[^a-z0-9_:/.-]+/g, "_");
  return /(?:^|[_:/.-])noelcrew(?:[_:/.-]|$)/.test(normalized) || /^noelcrew_(?:status|say|react)$/.test(normalized);
}

export function parseNoelCrewCommand(args: string): NoelCrewPiCommand {
  const trimmed = args.trim();
  if (!trimmed || trimmed === "help" || trimmed === "--help" || trimmed === "-h") return { kind: "help" };
  const [head = "", ...rest] = trimmed.split(/\s+/);
  const tail = trimmed.slice(head.length).trim();
  switch (head.toLowerCase()) {
    case "status":
      if (rest.length > 0) throw new Error("Usage: /noelcrew status");
      return { kind: "status" };
    case "test":
      if (rest.length > 0) throw new Error("Usage: /noelcrew test");
      return { kind: "test" };
    case "react": {
      if (rest.length !== 1) throw new Error("Usage: /noelcrew react <reaction>");
      return { kind: "react", reaction: validateReaction(rest[0] ?? "") };
    }
    case "say":
      return { kind: "say", message: validateManualSpeech(tail) };
    default:
      throw new Error(`Unknown /noelcrew command: ${head}`);
  }
}

export function validateManualSpeech(message: string): string {
  const trimmed = message.trim();
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/i.test(trimmed)) throw new Error("NoelCrew speech must not contain secrets.");
  return validateHookSpeech(trimmed);
}

export function getPiNoelCrewHelp(): string {
  return "NoelCrew commands: /noelcrew status, /noelcrew test, /noelcrew react <reaction>, /noelcrew say <message>.";
}

async function executeCommand(command: NoelCrewPiCommand, client: NoelCrewClient, ctx?: NoelCrewPiCommandContext): Promise<void> {
  switch (command.kind) {
    case "help":
      notify(ctx, getPiNoelCrewHelp(), "info");
      return;
    case "status": {
      const status = await client.status();
      notify(ctx, status.ok ? "NoelCrew is connected." : `NoelCrew unavailable: ${sanitizeStatusReason(status.unavailableReason)}`, status.ok ? "info" : "warning");
      return;
    }
    case "test":
      await client.say("Pi connected", { reaction: "waving" });
      notify(ctx, "NoelCrew test sent.", "info");
      return;
    case "react":
      await client.react(command.reaction);
      notify(ctx, `NoelCrew reaction set: ${command.reaction}`, "info");
      return;
    case "say":
      await client.say(command.message);
      notify(ctx, "NoelCrew message sent.", "info");
      return;
  }
}

function isTestLikeArgs(args: unknown): boolean {
  const command = isRecord(args) && typeof args.command === "string" ? args.command.slice(0, boundedCommandSliceLength) : "";
  return /\b(test|vitest|jest|pytest|npm\s+test|pnpm\s+test|yarn\s+test|cargo\s+test|go\s+test)\b/i.test(command);
}

function validateReaction(value: string): NoelCrewReaction {
  if (!allowedReactions.includes(value as NoelCrewReaction)) throw new Error("Invalid NoelCrew reaction.");
  return value as NoelCrewReaction;
}

function notify(ctx: NoelCrewPiCommandContext | undefined, message: string, type: "info" | "warning" | "error"): void {
  ctx?.ui?.notify?.(message, type);
}

function defaultSchedule(work: () => Promise<void>): void {
  void Promise.resolve().then(work).catch(() => undefined);
}

function sanitizeDebugError(error: unknown): string {
  if (!error) return "unknown";
  if (isRecord(error) && typeof error.code === "string") return sanitizeKnownErrorCode(error.code);
  if (error instanceof Error) return error.name.replace(/[^a-z0-9_-]/gi, "_").slice(0, 80) || "Error";
  return "unknown";
}

function sanitizeKnownErrorCode(code: string): string {
  const normalized = code.toLowerCase();
  if (normalized.includes("enoent")) return "ENOENT";
  if (normalized.includes("econnrefused")) return "ECONNREFUSED";
  if (normalized.includes("connect_timeout")) return "connect_timeout";
  if (normalized.includes("response_timeout")) return "response_timeout";
  if (normalized.includes("connection_closed")) return "connection_closed";
  if (normalized.includes("unavailable")) return "unavailable";
  return "NoelCrewClientError";
}

function sanitizeUserError(error: unknown): string {
  return error instanceof Error ? error.message.replace(/[\r\n]+/g, " ").slice(0, 140) : "NoelCrew command failed.";
}

function sanitizeStatusReason(reason: unknown): string {
  const text = typeof reason === "string" ? reason : "not running";
  if (/ENOENT|ECONNREFUSED|connect_timeout|response_timeout|unavailable/i.test(text)) return "not running";
  return "unavailable";
}

function isPiApi(value: unknown): value is NoelCrewPiExtensionApi {
  return isRecord(value) && (typeof value.on === "function" || typeof value.registerCommand === "function");
}

function isCommandContext(value: unknown): value is NoelCrewPiCommandContext {
  return isRecord(value) && (value.ui === undefined || isRecord(value.ui));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
