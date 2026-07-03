import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBallisticCq556Burris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 16,
    crosshairMrad: 5,
    majorHashes: [2, 4, 6],
    dots: [
      { xMrad: 0, yMrad: 2, radiusMrad: 0.11 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.11 },
      { xMrad: 0, yMrad: 6, radiusMrad: 0.11 },
      { xMrad: -1.5, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: 1.5, yMrad: 4, radiusMrad: 0.08 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.3,
  });
}
