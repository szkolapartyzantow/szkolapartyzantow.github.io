import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawEmdrWeaver(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 10,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4, 5],
    minorHashes: [0.5, 1.5, 2.5, 3.5, 4.5],
    verticalHashes: [6, 7],
    postStartMrad: 6,
    postHalfWidthMrad: 0.18,
  });
}
