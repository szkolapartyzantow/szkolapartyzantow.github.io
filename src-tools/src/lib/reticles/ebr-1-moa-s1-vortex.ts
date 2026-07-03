import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const MOA_PER_MRAD = 3.4377;

export function drawEbr1MoaS1Vortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 25 / MOA_PER_MRAD,
    crosshairMrad: 15 / MOA_PER_MRAD,
    majorHashes: [5 / MOA_PER_MRAD, 10 / MOA_PER_MRAD, 15 / MOA_PER_MRAD],
    minorHashes: [2.5 / MOA_PER_MRAD, 7.5 / MOA_PER_MRAD, 12.5 / MOA_PER_MRAD],
    verticalHashes: [20 / MOA_PER_MRAD],
    postStartMrad: 16 / MOA_PER_MRAD,
    postHalfWidthMrad: 0.45 / MOA_PER_MRAD,
  });
}
