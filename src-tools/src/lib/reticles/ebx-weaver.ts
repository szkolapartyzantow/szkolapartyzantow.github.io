import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawEbxWeaver(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 17,
    crosshairMrad: 6,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 6, halfWidthMrad: 4 },
    ],
    postStartMrad: 7,
    postHalfWidthMrad: 0.28,
  });
}
