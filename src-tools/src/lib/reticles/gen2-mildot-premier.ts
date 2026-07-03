import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 7;
const DOT_RADIUS_MRAD = 0.1;
const HASH_HALF_LENGTH_MRAD = 0.1;
const POST_START_MRAD = 5;
const POST_HALF_WIDTH_MRAD = 0.2;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawGen2MildotPremier(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  const dotRadius = DOT_RADIUS_MRAD * pxPerMrad;
  for (const offset of [-4, -3, -2, -1, 1, 2, 3, 4]) {
    canvas.circle(centerX, centerY + offset * pxPerMrad, dotRadius, fillPaint);
    canvas.circle(centerX + offset * pxPerMrad, centerY, dotRadius, fillPaint);
    canvas.circle(centerX - offset * pxPerMrad, centerY, dotRadius, fillPaint);
  }

  const hashHalfLength = HASH_HALF_LENGTH_MRAD * pxPerMrad;
  for (const offset of [-4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5]) {
    canvas.line(
      centerX - hashHalfLength,
      centerY + offset * pxPerMrad,
      centerX + hashHalfLength,
      centerY + offset * pxPerMrad,
      linePaint
    );
    canvas.line(
      centerX + offset * pxPerMrad,
      centerY - hashHalfLength,
      centerX + offset * pxPerMrad,
      centerY + hashHalfLength,
      linePaint
    );
    canvas.line(
      centerX - offset * pxPerMrad,
      centerY - hashHalfLength,
      centerX - offset * pxPerMrad,
      centerY + hashHalfLength,
      linePaint
    );
  }

  const postHalfWidth = POST_HALF_WIDTH_MRAD * pxPerMrad;
  canvas.rect(
    centerX + POST_START_MRAD * pxPerMrad,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - POST_START_MRAD * pxPerMrad,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + POST_START_MRAD * pxPerMrad,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - POST_START_MRAD * pxPerMrad,
    fillPaint
  );
}
