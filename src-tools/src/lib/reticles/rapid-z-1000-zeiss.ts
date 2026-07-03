import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawRapidZ1000Zeiss(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 30,
    crosshairMrad: 8,
    majorHashes: [2, 4, 6, 8],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 5 },
      { yMrad: 4, halfWidthMrad: 7 },
      { yMrad: 6, halfWidthMrad: 9 },
      { yMrad: 8, halfWidthMrad: 11 },
      { yMrad: 10, halfWidthMrad: 13 },
      { yMrad: 12, halfWidthMrad: 15 },
    ],
    dots: [
      { xMrad: -3, yMrad: 2, radiusMrad: 0.09 },
      { xMrad: 3, yMrad: 2, radiusMrad: 0.09 },
      { xMrad: -5, yMrad: 4, radiusMrad: 0.09 },
      { xMrad: 5, yMrad: 4, radiusMrad: 0.09 },
      { xMrad: -7, yMrad: 6, radiusMrad: 0.09 },
      { xMrad: 7, yMrad: 6, radiusMrad: 0.09 },
    ],
    postStartMrad: 14,
    postHalfWidthMrad: 0.35,
  });
}
