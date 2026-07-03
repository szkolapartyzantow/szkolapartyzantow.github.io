import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBrtSwarovski(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 8,
    crosshairMrad: 4,
    lowerLadder: [
      { yMrad: 0.8, halfWidthMrad: 1.2 },
      { yMrad: 1.6, halfWidthMrad: 1.6 },
      { yMrad: 2.4, halfWidthMrad: 2.0 },
      { yMrad: 3.2, halfWidthMrad: 2.4 },
    ],
    postStartMrad: 4.5,
    postHalfWidthMrad: 0.2,
  });
}
