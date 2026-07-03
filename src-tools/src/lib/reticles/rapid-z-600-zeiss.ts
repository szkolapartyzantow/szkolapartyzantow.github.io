import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRapidZ600Zeiss(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 15,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4],
    lowerLadder: [
      { yMrad: 1, halfWidthMrad: 2 },
      { yMrad: 2, halfWidthMrad: 2.6 },
      { yMrad: 3, halfWidthMrad: 3.2 },
      { yMrad: 4, halfWidthMrad: 3.8 },
      { yMrad: 5, halfWidthMrad: 4.4 },
    ],
    postStartMrad: 7,
    postHalfWidthMrad: 0.24,
  });
}
