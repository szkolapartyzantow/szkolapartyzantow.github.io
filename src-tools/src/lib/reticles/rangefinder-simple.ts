import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRangeFinderNcStar(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawRangeFinder(canvas, input, 30, 10);
}

export function drawRangeFinderBarska(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawRangeFinder(canvas, input, 10, 4);
}

export function drawRfLynx(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawRangeFinder(canvas, input, 13, 5);
}

function drawRangeFinder(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [1, 2, 3, 4],
    lowerLadder: [
      { yMrad: 1, halfWidthMrad: 1 },
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 3, halfWidthMrad: 3 },
      { yMrad: 4, halfWidthMrad: 4 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.2,
  });
}
