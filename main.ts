import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

const ENTRY_LINE: string =
  "I bought a weighted blanket for my anxiety and now I'm pinned under fifteen pounds of the exact same thoughts.";

function resolveOutputDir(envValue: string | undefined): string {
  const trimmed: string = envValue?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "/output";
}

function validateEntry(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry line must not be blank or whitespace-only.");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("Entry line must be a single line.");
  }
  const charCount: number = [...line].length;
  if (charCount > MAX_CHARS) {
    throw new Error(`Entry line exceeds ${MAX_CHARS} characters (${charCount}).`);
  }
}

function main(): void {
  validateEntry(ENTRY_LINE);

  const outputDir: string = resolveOutputDir(process.env.MAKEFUN_OUTPUT_DIR);
  const outputPath: string = join(outputDir, "entry.txt");
  const payload: Buffer = Buffer.from(ENTRY_LINE, "utf8");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, payload);
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (error: unknown) {
  const message: string = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to write entry: ${message}\n`);
  process.exit(1);
}
