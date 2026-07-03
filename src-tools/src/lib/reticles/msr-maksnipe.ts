import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawMsrMaksnipe(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 18,
    crosshairMrad: 8,
    majorHashes: [1, 2, 3, 4, 5, 6],
    minorHashes: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 6, halfWidthMrad: 4 },
      { yMrad: 8, halfWidthMrad: 5 },
    ],
    postStartMrad: 8,
    postHalfWidthMrad: 0.18,
  });
}
