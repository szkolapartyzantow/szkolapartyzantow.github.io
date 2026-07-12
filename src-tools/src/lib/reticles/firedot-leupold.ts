import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 15;
const CENTER_DOT_RADIUS_MRAD = 0.5;
const RING_RADIUS_MRAD = 2.19;
const LOWER_POST_START_MRAD = 11.82;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };
const firedotPaint = { color: "#dc2626", fill: true };

export function drawFiredotLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  canvas.circle(centerX, centerY, pxPerMrad * CENTER_DOT_RADIUS_MRAD, firedotPaint);
  canvas.circle(centerX, centerY, pxPerMrad * RING_RADIUS_MRAD, linePaint);

  for (const offset of [4.8, 7.82]) {
    const y = centerY + offset * pxPerMrad;
    const halfWidth = pxPerMrad;
    canvas.line(centerX - halfWidth, y, centerX + halfWidth, y, linePaint);
  }

  const postHalfWidth = pxPerMrad * 0.7;
  canvas.rect(
    centerX - postHalfWidth,
    centerY + LOWER_POST_START_MRAD * pxPerMrad,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
}
