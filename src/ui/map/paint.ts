import { woodland, type Continent } from './continent';

/** The colours of the sheet. Every value is the repo owner's to move. */
export const PALETTE = {
  parchment: '#e9dfc0',
  parchmentDeep: '#dccf9f',
  deep: '#3f6382',
  shallows: '#7d9fb6',
  plains: '#d3c893',
  meadow: '#a8b96f',
  forest: '#5f7f43',
  crown: '#6d8a4c',
  moor: '#b8a26a',
  mountain: '#a68d6b',
  mountainLight: '#d9cdb1',
  peak: '#e4dccb',
  sand: '#e6d5a3',
  blight: '#8d8880',
  river: '#4f7fa3',
  road: '#b5452f',
  ink: '#3b2f22',
};

type Rgb = [number, number, number];

function rgb(hex: string): Rgb {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

const DEEP = rgb(PALETTE.deep);
const SHALLOWS = rgb(PALETTE.shallows);
const PLAINS = rgb(PALETTE.plains);
const MEADOW = rgb(PALETTE.meadow);
const FOREST = rgb(PALETTE.forest);
const MOOR = rgb(PALETTE.moor);
const MOUNTAIN = rgb(PALETTE.mountain);
const PEAK = rgb(PALETTE.peak);
const SAND = rgb(PALETTE.sand);
const BLIGHT = rgb(PALETTE.blight);
const RIVER = rgb(PALETTE.river);

/** Cells of sea over which the shallows give way to the deep. */
const SHELF = 18;
/** Cells of land that are beach. */
const STRAND = 3;

function step(a: number, b: number, t: number): number {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function mix(out: Rgb, to: Rgb, t: number): void {
  out[0] += (to[0] - out[0]) * t;
  out[1] += (to[1] - out[1]) * t;
  out[2] += (to[2] - out[2]) * t;
}

/**
 * The continent, coloured: sea, biome and hillshade, one cell per pixel, into
 * a canvas the chart draws under everything else. Biomes are blended and not
 * looked up, so their edges are soft by construction.
 */
export function paintPixels(c: Continent): Uint8ClampedArray<ArrayBuffer> {
  const data = new Uint8ClampedArray(c.cols * c.rows * 4);
  const out: Rgb = [0, 0, 0];
  for (let i = 0; i < c.cols * c.rows; i++) {
    const grain = 1 + (hash(i) - 0.5) * 0.07;
    if (!c.land[i]) {
      out[0] = SHALLOWS[0];
      out[1] = SHALLOWS[1];
      out[2] = SHALLOWS[2];
      mix(out, DEEP, step(0, SHELF, -c.shore[i]));
    } else if (c.lake[i]) {
      out[0] = SHALLOWS[0];
      out[1] = SHALLOWS[1];
      out[2] = SHALLOWS[2];
      mix(out, RIVER, 0.35);
    } else {
      const h = c.height[i];
      const wet = c.wet[i];
      out[0] = PLAINS[0];
      out[1] = PLAINS[1];
      out[2] = PLAINS[2];
      mix(out, MEADOW, wet);
      mix(out, FOREST, woodland(c, i) * 0.85);
      mix(out, MOOR, step(0.35, 0.6, h) * (1 - wet * 0.7));
      mix(out, MOUNTAIN, step(0.58, 0.8, h));
      mix(out, PEAK, step(0.86, 1, h));
      mix(out, SAND, (1 - step(0, STRAND, c.shore[i])) * (1 - step(0.08, 0.2, h)));
      mix(out, BLIGHT, c.blight[i] * 0.85);
      const shade = c.shade[i];
      out[0] *= shade;
      out[1] *= shade;
      out[2] *= shade;
    }
    const at = i * 4;
    data[at] = Math.min(255, out[0] * grain);
    data[at + 1] = Math.min(255, out[1] * grain);
    data[at + 2] = Math.min(255, out[2] * grain);
    data[at + 3] = 255;
  }
  return data;
}

/** The painted sheet as a canvas the chart draws under everything else. */
export function paintCanvas(cols: number, rows: number, pixels: Uint8ClampedArray<ArrayBuffer>): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const context = canvas.getContext('2d');
  if (context) context.putImageData(new ImageData(pixels, cols, rows), 0, 0);
  return canvas;
}

function hash(i: number): number {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
