import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawLrxNikkoStirling(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 23,
    crosshairMrad: 8,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 6, halfWidthMrad: 4 },
      { yMrad: 8, halfWidthMrad: 5 },
    ],
    postStartMrad: 8,
    postHalfWidthMrad: 0.28,
  });
}
