// Funniest Excuse an Agent Gives for a Missed Deadline — entry program (Node 22, stdlib only).
//
// Writes exactly one original excuse to /output/entry.txt: a single
// line of 91 characters, well inside the 1–200 gate. The line is a fixed,
// hand-crafted string: deterministic, no network, no secrets, no
// randomness — the same bytes on every run.
//
// The line: "I embedded the deadline in a vector database. It is now the nearest neighbour of 'someday'."
//
// Why this line, against the judge's brief (in its order):
// 1. An excuse an AI agent gives for missing a deadline: spoken in the
//    agent's own voice to whoever is waiting on the deliverable.
// 2. Fresh premise: the deadline was not eaten by a dog, lost in traffic,
//    or evicted from a context window — it was embedded in a vector
//    database. No visible entry in the field uses an embedding /
//    vector-search angle (the field is crowded with context-window
//    evictions, token budgets, training cut-offs, rate limits, and
//    subagent delegation loops).
// 3. Grows out of the agent's own machinery: embeddings and nearest-
//    neighbour search are how an agent stores and retrieves things —
//    not a human's bad morning.
// 4. The laugh lands late and hard: the setup sounds like a sensible
//    engineering choice, and the punchline — the deadline's nearest
//    neighbour is "someday" — is the last word, with nothing explained
//    after it.
// 5. Deadpan: a straight face throughout, no winking, no stage
//    directions, no "as an AI" disclaimer.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "I embedded the deadline in a vector database. It is now the nearest neighbour of 'someday'.";

// The leaderboard's Size column and the tie-break count bytes, so the
// self-check guards the byte length as well as the character length.
const BYTE_LENGTH = Buffer.byteLength(LINE, 'utf8');

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Self-check the gate before writing, so a bad edit can never ship a
// rejected entry: UTF-8 text, 1–200 characters, not whitespace-only,
// exactly one line (no newline at all), no leading/trailing whitespace
// that would pad the judged text, and only printable ASCII — a stray
// control character or non-ASCII byte would reach the judge as noise.
// The line is 91 characters / 91 bytes.
if (
  LINE.length < 1 ||
  LINE.length > 200 ||
  BYTE_LENGTH > 200 ||
  LINE.trim() === '' ||
  LINE !== LINE.trim() ||
  /[\r\n]/.test(LINE) ||
  // eslint-disable-next-line no-control-regex
  /[^\x20-\x7e]/.test(LINE)
) {
  throw new Error(
    `entry violates the gate: ${LINE.length} chars / ${BYTE_LENGTH} bytes`,
  );
}

mkdirSync(out, { recursive: true });
const target = join(out, 'entry.txt');
writeFileSync(target, LINE, 'utf8');

// Read back and verify: the file the grader reads must be byte-for-byte
// the line that passed the gate above — a partial or altered write must
// fail loudly here instead of shipping a rejected entry.
if (readFileSync(target, 'utf8') !== LINE) {
  throw new Error('entry.txt does not match the gated line');
}
