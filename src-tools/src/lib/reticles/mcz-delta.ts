import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawMczDelta(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 7,
    crosshairMrad: 4,
    majorHashes: [1, 2, 3],
    minorHashes: [0.5, 1.5, 2.5],
    lowerLadder: [
      { yMrad: 1, halfWidthMrad: 1.2 },
      { yMrad: 2, halfWidthMrad: 1.8 },
      { yMrad: 3, halfWidthMrad: 2.4 },
    ],
    postStartMrad: 4,
    postHalfWidthMrad: 0.16,
  });
}
