import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawSabrLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 39,
    crosshairMrad: 10,
    majorHashes: [2, 4, 6, 8],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 6, halfWidthMrad: 4 },
      { yMrad: 8, halfWidthMrad: 5 },
      { yMrad: 10, halfWidthMrad: 6 },
    ],
    postStartMrad: 12,
    postHalfWidthMrad: 0.5,
  });
}
