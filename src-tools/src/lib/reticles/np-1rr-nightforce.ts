import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawNp1rrNightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 24,
    crosshairMrad: 10,
    majorHashes: [2, 4, 6, 8],
    verticalHashes: [10, 12, 14],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1 },
      { yMrad: 4, halfWidthMrad: 1.5 },
      { yMrad: 6, halfWidthMrad: 2 },
      { yMrad: 8, halfWidthMrad: 2.5 },
    ],
    postStartMrad: 10,
    postHalfWidthMrad: 0.3,
  });
}
