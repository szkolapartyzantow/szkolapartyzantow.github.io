import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawLp20Falcon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 23,
    crosshairMrad: 8,
    majorHashes: [2, 4, 6, 8],
    minorHashes: [1, 3, 5, 7],
    lowerLadder: [
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 8, halfWidthMrad: 5 },
      { yMrad: 12, halfWidthMrad: 7 },
    ],
    postStartMrad: 9,
    postHalfWidthMrad: 0.25,
  });
}
