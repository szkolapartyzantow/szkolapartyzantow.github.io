import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawMl16Falcon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 10,
    crosshairMrad: 5,
    majorHashes: [1, 2, 3, 4],
    minorHashes: [0.5, 1.5, 2.5, 3.5],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.5 },
      { yMrad: 4, halfWidthMrad: 2.5 },
      { yMrad: 6, halfWidthMrad: 3.5 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.18,
  });
}
