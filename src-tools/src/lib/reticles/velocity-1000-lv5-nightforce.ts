import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawVelocity1000Lv5Nightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 45,
    crosshairMrad: 14,
    majorHashes: [4, 8, 12],
    lowerLadder: [
      { yMrad: 4, halfWidthMrad: 4 },
      { yMrad: 8, halfWidthMrad: 6 },
      { yMrad: 12, halfWidthMrad: 8 },
      { yMrad: 16, halfWidthMrad: 10 },
      { yMrad: 20, halfWidthMrad: 12 },
    ],
    postStartMrad: 18,
    postHalfWidthMrad: 0.55,
  });
}
