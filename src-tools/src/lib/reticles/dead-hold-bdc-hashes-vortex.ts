import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawDeadHoldBdcHashesVortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 13,
    crosshairMrad: 5,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.2 },
      { yMrad: 4, halfWidthMrad: 2.0 },
      { yMrad: 6, halfWidthMrad: 2.8 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.25,
  });
}
