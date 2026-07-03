import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawGen2XrPremier(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 13,
    crosshairMrad: 7,
    majorHashes: [1, 2, 3, 4, 5],
    minorHashes: [0.5, 1.5, 2.5, 3.5, 4.5],
    lowerLadder: [
      { yMrad: 1, halfWidthMrad: 1.5 },
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 3, halfWidthMrad: 2.5 },
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 5, halfWidthMrad: 3.5 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.18,
  });
}
