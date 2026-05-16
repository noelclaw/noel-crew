import { createNoelCrewPiExtension, type NoelCrewPiOptions } from "./runtime.js";

export default function noelCrewPiExtension(pi: unknown, options: NoelCrewPiOptions = {}): void {
  createNoelCrewPiExtension(pi, options);
}
