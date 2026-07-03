import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawA8VarmintSchmidtBender(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 17,
    crosshairMrad: 7,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.5 },
      { yMrad: 4, halfWidthMrad: 2.2 },
      { yMrad: 6, halfWidthMrad: 2.9 },
    ],
    postStartMrad: 8,
    postHalfWidthMrad: 0.28,
  });
}
