import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBdc200Nikon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBdcNikonVariant(canvas, input, 10, 4, [1.2, 2.2, 3.4]);
}

export function drawBdc150Nikon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBdcNikonVariant(canvas, input, 10, 4, [1, 1.8, 2.8]);
}

function drawBdcNikonVariant(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  radiusMrad: number,
  postStartMrad: number,
  drops: readonly number[]
): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [2, 4],
    dots: drops.map((yMrad) => ({ xMrad: 0, yMrad, radiusMrad: 0.12 })),
    postStartMrad,
    postHalfWidthMrad: 0.25,
  });
}
