import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 22;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };

export function drawSprLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  canvas.line(centerX, centerY - 15 * pxPerMrad, centerX, centerY + 15 * pxPerMrad, linePaint);
  canvas.line(centerX - 15 * pxPerMrad, centerY, centerX + 15 * pxPerMrad, centerY, linePaint);
  canvas.circle(centerX, centerY, 5 * pxPerMrad, linePaint);

  for (const offset of [-12.5, -7.5, -2.5, 2.5, 7.5, 12.5]) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 0.3 * pxPerMrad);
    drawVerticalHash(canvas, centerX + offset * pxPerMrad, centerY, 0.3 * pxPerMrad);
  }

  for (const offset of [-15, -10, 10, 15]) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 0.5 * pxPerMrad);
    drawVerticalHash(canvas, centerX + offset * pxPerMrad, centerY, 0.5 * pxPerMrad);
  }
}

function drawHorizontalHash(
  canvas: ReticleCanvas,
  centerX: number,
  y: number,
  halfWidth: number
): void {
  canvas.line(centerX - halfWidth, y, centerX + halfWidth, y, linePaint);
}

function drawVerticalHash(
  canvas: ReticleCanvas,
  x: number,
  centerY: number,
  halfHeight: number
): void {
  canvas.line(x, centerY - halfHeight, x, centerY + halfHeight, linePaint);
}
