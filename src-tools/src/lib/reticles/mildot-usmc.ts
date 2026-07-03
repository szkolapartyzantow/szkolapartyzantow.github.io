import type { ReticleCanvas, ReticleRenderInput } from "./types";
import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";

const RETICLE_RADIUS_MRAD = 7;
const DOT_DIAMETER_MRAD = 0.4;
const POST_START_MRAD = 5;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawMilDotUsmc(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMrad = size / (RETICLE_RADIUS_MRAD * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * RETICLE_RADIUS_MRAD;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(centerX, centerY - radius, centerX, centerY + radius, linePaint);
  canvas.line(centerX - radius, centerY, centerX + radius, centerY, linePaint);

  const dotRadius = (pxPerMrad * DOT_DIAMETER_MRAD) / 2;
  for (const offset of [-4, -3, -2, -1, 1, 2, 3, 4]) {
    canvas.circle(centerX, centerY + offset * pxPerMrad, dotRadius, fillPaint);
    canvas.circle(centerX + offset * pxPerMrad, centerY, dotRadius, fillPaint);
  }

  const postHalfWidth = pxPerMrad * 0.2;
  canvas.rect(
    centerX + POST_START_MRAD * pxPerMrad,
    centerY - postHalfWidth,
    centerX + radius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - radius,
    centerY - postHalfWidth,
    centerX - POST_START_MRAD * pxPerMrad,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + POST_START_MRAD * pxPerMrad,
    centerX + postHalfWidth,
    centerY + radius,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - radius,
    centerX + postHalfWidth,
    centerY - POST_START_MRAD * pxPerMrad,
    fillPaint
  );
}
