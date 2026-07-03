import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawEbr1MradF1Vortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 10,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4, 5, 6],
    minorHashes: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5],
    verticalHashes: [7, 8, 9],
    postStartMrad: 6,
    postHalfWidthMrad: 0.15,
  });
}
