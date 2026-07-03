import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 10;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

interface Kahles4dConfig {
  postStartMrad: number;
  lowerHashStepMrad: number;
}

export function drawKahles4dC25(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawKahles4d(canvas, input, {
    postStartMrad: 7,
    lowerHashStepMrad: 1,
  });
}

export function drawKahles4dC3(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawKahles4d(canvas, input, {
    postStartMrad: 6,
    lowerHashStepMrad: 0.84,
  });
}

function drawKahles4d(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  config: Kahles4dConfig
): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMrad = size / (RETICLE_RADIUS_MRAD * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * RETICLE_RADIUS_MRAD;
  const scaledRadius = pxPerMrad * RETICLE_RADIUS_MRAD;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(centerX, centerY - scaledRadius, centerX, centerY + scaledRadius, linePaint);
  canvas.line(centerX - scaledRadius, centerY, centerX + scaledRadius, centerY, linePaint);

  for (let index = 1; index <= 4; index += 1) {
    const y = centerY + index * config.lowerHashStepMrad * pxPerMrad;
    canvas.line(centerX - 2 * pxPerMrad, y, centerX + 2 * pxPerMrad, y, linePaint);
  }

  const postHalfWidth = 0.2 * pxPerMrad;
  const postStart = config.postStartMrad * pxPerMrad;
  canvas.rect(
    centerX + postStart,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - postStart,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + postStart,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
}
