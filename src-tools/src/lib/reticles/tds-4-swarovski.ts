import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawTds4Swarovski(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 10,
    crosshairMrad: 4,
    lowerLadder: [
      { yMrad: 1.2, halfWidthMrad: 1.4 },
      { yMrad: 2.4, halfWidthMrad: 1.8 },
      { yMrad: 3.6, halfWidthMrad: 2.2 },
      { yMrad: 4.8, halfWidthMrad: 2.6 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.24,
  });
}
