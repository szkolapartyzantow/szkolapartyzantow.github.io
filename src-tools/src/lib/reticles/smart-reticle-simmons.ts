import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawSmartReticleSimmons(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 15,
    crosshairMrad: 5,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.5 },
      { yMrad: 3, halfWidthMrad: 2.0 },
      { yMrad: 4, halfWidthMrad: 2.5 },
      { yMrad: 5, halfWidthMrad: 3.0 },
      { yMrad: 6, halfWidthMrad: 3.5 },
    ],
    dots: [
      { xMrad: 0, yMrad: 2, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 3, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.08 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.25,
  });
}
