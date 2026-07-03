import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function draw618V2Shepherd(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 35,
    crosshairMrad: 12,
    majorHashes: [3, 6, 9],
    lowerLadder: [
      { yMrad: 3, halfWidthMrad: 3 },
      { yMrad: 6, halfWidthMrad: 5 },
      { yMrad: 9, halfWidthMrad: 7 },
      { yMrad: 12, halfWidthMrad: 9 },
    ],
    dots: [
      { xMrad: 0, yMrad: 3, radiusMrad: 0.16 },
      { xMrad: 0, yMrad: 6, radiusMrad: 0.22 },
    ],
    postStartMrad: 14,
    postHalfWidthMrad: 0.5,
  });
}
