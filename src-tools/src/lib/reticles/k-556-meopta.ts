import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawK556Meopta(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 16,
    crosshairMrad: 5,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.8 },
      { yMrad: 4, halfWidthMrad: 2.6 },
      { yMrad: 6, halfWidthMrad: 3.4 },
      { yMrad: 8, halfWidthMrad: 4.2 },
    ],
    dots: [
      { xMrad: 0, yMrad: 2, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.1 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.28,
  });
}
