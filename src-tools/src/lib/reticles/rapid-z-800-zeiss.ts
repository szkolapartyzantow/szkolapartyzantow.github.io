import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRapidZ800Zeiss(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 17,
    crosshairMrad: 7,
    majorHashes: [1, 2, 3, 4, 5],
    lowerLadder: [
      { yMrad: 1.5, halfWidthMrad: 2.5 },
      { yMrad: 3, halfWidthMrad: 3.5 },
      { yMrad: 4.5, halfWidthMrad: 4.5 },
      { yMrad: 6, halfWidthMrad: 5.5 },
      { yMrad: 7.5, halfWidthMrad: 6.5 },
    ],
    postStartMrad: 8,
    postHalfWidthMrad: 0.25,
  });
}
