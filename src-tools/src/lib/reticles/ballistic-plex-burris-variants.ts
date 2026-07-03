import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBallisticPlex27Burris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallisticPlexVariant(canvas, input, 17, 6);
}

export function drawBallisticPlex312Burris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallisticPlexVariant(canvas, input, 13, 5);
}

function drawBallisticPlexVariant(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  radiusMrad: number,
  postStartMrad: number
): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.5 },
      { yMrad: 4, halfWidthMrad: 2.2 },
      { yMrad: 6, halfWidthMrad: 3.0 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.25,
  });
}
