import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawLrvDuplexLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 30,
    crosshairMrad: 9,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.5 },
      { yMrad: 4, halfWidthMrad: 2.2 },
      { yMrad: 6, halfWidthMrad: 3.0 },
      { yMrad: 8, halfWidthMrad: 3.8 },
    ],
    postStartMrad: 10,
    postHalfWidthMrad: 0.45,
  });
}
