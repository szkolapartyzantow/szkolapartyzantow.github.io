import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRapidZ7Zeiss(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 6,
    crosshairMrad: 3.5,
    majorHashes: [1, 2, 3],
    lowerLadder: [
      { yMrad: 1.0, halfWidthMrad: 1.5 },
      { yMrad: 1.8, halfWidthMrad: 1.9 },
      { yMrad: 2.7, halfWidthMrad: 2.3 },
      { yMrad: 3.7, halfWidthMrad: 2.8 },
    ],
    postStartMrad: 4,
    postHalfWidthMrad: 0.16,
  });
}
