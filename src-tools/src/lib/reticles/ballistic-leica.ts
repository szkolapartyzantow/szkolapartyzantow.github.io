import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBallisticLeica25(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallisticLeica(canvas, input, 8, 4);
}

export function drawBallisticLeica35(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallisticLeica(canvas, input, 6, 3.5);
}

function drawBallisticLeica(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  radiusMrad: number,
  postStartMrad: number
): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [1.5, 3],
    lowerLadder: [
      { yMrad: 1.4, halfWidthMrad: 1.1 },
      { yMrad: 2.8, halfWidthMrad: 1.5 },
      { yMrad: 4.2, halfWidthMrad: 1.9 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.2,
  });
}
