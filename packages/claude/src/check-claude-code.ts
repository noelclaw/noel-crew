import assert from "node:assert/strict";

import { buildClaudeMcpGetCommand, buildClaudeMcpPreview, classifyClaudeMcpStatus, formatCommandForDisplay, getBundledMcpEntryPath, getLocalMcpEntryPath, mapAsarPathToUnpacked, parseClaudeMcpGetOutput, parseClaudeMcpListOutput, validateNoelCrewPetArg } from "./claude-code.js";

const defaultPreview = buildClaudeMcpPreview();
assert.deepEqual(defaultPreview.add.args, ["mcp", "add", "--scope", "user", "noelcrew", "--", "npx", "-y", "@noelclaw/crew"]);
assert.deepEqual(defaultPreview.remove.args, ["mcp", "remove", "--scope", "user", "noelcrew"]);
assert.deepEqual(defaultPreview.mcpJson.mcpServers.noelcrew.args, ["-y", "@noelclaw/crew"]);
assert.equal(formatCommandForDisplay(defaultPreview.add), "claude mcp add --scope user noelcrew -- npx -y @noelclaw/crew");

const petPreview = buildClaudeMcpPreview("snoopy");
assert.deepEqual(petPreview.add.args, ["mcp", "add", "--scope", "user", "noelcrew", "--", "npx", "-y", "@noelclaw/crew", "--pet", "snoopy"]);
assert.deepEqual(petPreview.mcpJson.mcpServers.noelcrew.args, ["-y", "@noelclaw/crew", "--pet", "snoopy"]);
assert.deepEqual(buildClaudeMcpGetCommand().args, ["mcp", "get", "noelcrew"]);

const localPreview = buildClaudeMcpPreview("snoopy", "local");
assert.deepEqual(localPreview.add.args, ["mcp", "add", "--scope", "user", "noelcrew", "--", "node", getLocalMcpEntryPath(), "--pet", "snoopy"]);
assert.equal(localPreview.mcpJson.mcpServers.noelcrew.command, "node");
assert.deepEqual(localPreview.mcpJson.mcpServers.noelcrew.args, [getLocalMcpEntryPath(), "--pet", "snoopy"]);

assert.throws(() => validateNoelCrewPetArg("Bad Pet"));
assert.throws(() => validateNoelCrewPetArg("bad/pet"));
assert.equal(validateNoelCrewPetArg("snoopy"), "snoopy");

assert.equal(parseClaudeMcpListOutput("noelcrew: npx -y @noelclaw/crew").present, true);
assert.equal(parseClaudeMcpListOutput("No MCP servers configured").present, false);

const jsonGet = parseClaudeMcpGetOutput(JSON.stringify({ command: "npx", args: ["-y", "@noelclaw/crew", "--pet", "snoopy"] }), "snoopy");
assert.equal(jsonGet.present, true);
assert.equal(jsonGet.verified, true);
assert.equal(jsonGet.matchesExpected, true);

const localGet = parseClaudeMcpGetOutput(JSON.stringify({ command: "node", args: [getLocalMcpEntryPath(), "--pet", "snoopy"] }), "snoopy", "local");
assert.equal(localGet.matchesExpected, true);

const bundledPreview = buildClaudeMcpPreview("snoopy", "bundled");
assert.deepEqual(bundledPreview.add.args, ["mcp", "add", "--scope", "user", "noelcrew", "--", "node", getBundledMcpEntryPath(), "--pet", "snoopy"]);
assert.equal(bundledPreview.mcpJson.mcpServers.noelcrew.command, "node");
assert.deepEqual(bundledPreview.mcpJson.mcpServers.noelcrew.args, [getBundledMcpEntryPath(), "--pet", "snoopy"]);
const bundledGet = parseClaudeMcpGetOutput(JSON.stringify({ command: "node", args: [getBundledMcpEntryPath(), "--pet", "snoopy"] }), "snoopy", "bundled");
assert.equal(bundledGet.matchesExpected, true);
const customNode = "/Users/test/Library/Application Support/Herd/config/nvm/versions/node/v22.22.2/bin/node";
const customNodePreview = buildClaudeMcpPreview("snoopy", "bundled", customNode);
assert.equal(customNodePreview.mcpJson.mcpServers.noelcrew.command, customNode);
assert.equal(parseClaudeMcpGetOutput(JSON.stringify({ command: customNode, args: [getBundledMcpEntryPath(), "--pet", "snoopy"] }), "snoopy", "bundled", customNode).matchesExpected, true);

const spacedPath = "/Applications/NoelCrew Test.app/Contents/Resources/app/node_modules/@noelclaw/crew/dist/index.js";
assert.equal(formatCommandForDisplay({ command: "node", args: [spacedPath, "--pet", "snoopy"] }), 'node "/Applications/NoelCrew Test.app/Contents/Resources/app/node_modules/@noelclaw/crew/dist/index.js" --pet snoopy');
const spacedTextGet = parseClaudeMcpGetOutput(`noelcrew\nCommand: node\nArgs: "${getBundledMcpEntryPath()}" --pet snoopy`, "snoopy", "bundled");
assert.equal(spacedTextGet.matchesExpected, true);
assert.equal(formatCommandForDisplay({ command: "node", args: ["C:\\Program Files\\NoelCrew\\resources\\app\\node_modules\\@noelclaw\\crew\\dist\\index.js"] }), 'node "C:\\\\Program Files\\\\NoelCrew\\\\resources\\\\app\\\\node_modules\\\\@noelclaw\\\\crew\\\\dist\\\\index.js"');
assert.equal(mapAsarPathToUnpacked("/Applications/NoelCrew.app/Contents/Resources/app.asar/node_modules/@noelclaw/crew/dist/index.js"), "/Applications/NoelCrew.app/Contents/Resources/app.asar.unpacked/node_modules/@noelclaw/crew/dist/index.js");
assert.equal(mapAsarPathToUnpacked("C:\\Program Files\\NoelCrew\\resources\\app.asar\\node_modules\\@noelclaw\\crew\\dist\\index.js"), "C:\\Program Files\\NoelCrew\\resources\\app.asar.unpacked\\node_modules\\@noelclaw\\crew\\dist\\index.js");
assert.equal(mapAsarPathToUnpacked("/Applications/app.asarish/NoelCrew.app/Contents/Resources/app.asar/node_modules/@noelclaw/crew/dist/index.js"), "/Applications/app.asarish/NoelCrew.app/Contents/Resources/app.asar.unpacked/node_modules/@noelclaw/crew/dist/index.js");
assert.equal(mapAsarPathToUnpacked("/tmp/app.asar.unpacked/node_modules/@noelclaw/crew/dist/index.js"), "/tmp/app.asar.unpacked/node_modules/@noelclaw/crew/dist/index.js");

const textGet = parseClaudeMcpGetOutput("noelcrew\nCommand: npx\nArgs: -y @noelclaw/crew --pet snoopy", "snoopy");
assert.equal(textGet.present, true);
assert.equal(textGet.verified, true);
assert.equal(textGet.matchesExpected, true);

const different = parseClaudeMcpGetOutput(JSON.stringify({ command: "node", args: ["server.js"] }), "snoopy");
assert.equal(different.present, true);
assert.equal(different.verified, true);
assert.equal(different.matchesExpected, false);

const unverifiable = classifyClaudeMcpStatus("noelcrew", "Name: noelcrew\nTransport: stdio", "snoopy");
assert.equal(unverifiable.present, true);
assert.equal(unverifiable.verified, false);
assert.equal(unverifiable.matchesExpected, false);

console.error("Claude Code setup validation passed.");
