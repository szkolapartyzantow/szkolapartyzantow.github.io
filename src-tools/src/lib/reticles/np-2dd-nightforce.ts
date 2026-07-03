import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawNp2ddNightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 10,
    crosshairMrad: 5,
    majorHashes: [2, 4],
    dots: [
      { xMrad: -3, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 3, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 3, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: -3, radiusMrad: 0.1 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.22,
  });
}
