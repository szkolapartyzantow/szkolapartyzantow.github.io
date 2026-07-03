import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBooneCrockettLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 12,
    crosshairMrad: 5,
    majorHashes: [2, 4],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.8 },
      { yMrad: 3.2, halfWidthMrad: 2.4 },
      { yMrad: 4.6, halfWidthMrad: 3.0 },
      { yMrad: 6.2, halfWidthMrad: 3.7 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.28,
  });
}
