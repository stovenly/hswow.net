/** Whitespace, for chunks that are written in one file and spliced into another. */

/** Strips the indentation a chunk was written at, so it can be given another. */
export function dedent(glsl: string): string {
  const lines = glsl.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const common = lines
    .filter((line) => line.trim() !== '')
    .reduce((least, line) => Math.min(least, line.length - line.trimStart().length), Infinity);
  const strip = Number.isFinite(common) ? common : 0;
  return lines.map((line) => line.slice(strip)).join('\n');
}

/** Pushes every line after the first in by `spaces`, so it sits inside a block. */
export function indent(glsl: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return glsl.replace(/\n(?=.)/g, `\n${pad}`);
}

/** Both: written at whatever indent reads well, spliced at the one needed. */
export function reindent(glsl: string, spaces: number): string {
  return indent(dedent(glsl), spaces);
}
