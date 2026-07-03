import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawEbr1MradS1Vortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 6,
    crosshairMrad: 4,
    majorHashes: [1, 2, 3, 4],
    minorHashes: [0.5, 1.5, 2.5, 3.5],
    verticalHashes: [5],
    postStartMrad: 4.5,
    postHalfWidthMrad: 0.14,
  });
}
