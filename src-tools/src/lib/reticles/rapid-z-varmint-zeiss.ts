import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRapidZVarmintZeiss(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 12,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4],
    lowerLadder: [
      { yMrad: 1.2, halfWidthMrad: 2.0 },
      { yMrad: 2.4, halfWidthMrad: 2.8 },
      { yMrad: 3.6, halfWidthMrad: 3.6 },
      { yMrad: 4.8, halfWidthMrad: 4.4 },
    ],
    postStartMrad: 7,
    postHalfWidthMrad: 0.24,
  });
}
