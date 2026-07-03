import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRapidZ5Zeiss(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 4,
    crosshairMrad: 2.5,
    majorHashes: [0.8, 1.6, 2.4],
    lowerLadder: [
      { yMrad: 0.8, halfWidthMrad: 1.1 },
      { yMrad: 1.4, halfWidthMrad: 1.4 },
      { yMrad: 2.0, halfWidthMrad: 1.7 },
      { yMrad: 2.6, halfWidthMrad: 2.0 },
    ],
    postStartMrad: 2.7,
    postHalfWidthMrad: 0.12,
  });
}
