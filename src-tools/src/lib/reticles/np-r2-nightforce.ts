import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 22;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };

export function drawNpR2Nightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  canvas.line(centerX, centerY - 10 * pxPerMrad, centerX, centerY + 20 * pxPerMrad, linePaint);
  canvas.line(centerX - 20 * pxPerMrad, centerY, centerX + 20 * pxPerMrad, centerY, linePaint);

  for (const offset of [-20, -15, -10, -5, 5, 10, 15, 20]) {
    drawVerticalHash(canvas, centerX + offset * pxPerMrad, centerY, 0.7 * pxPerMrad);
  }

  for (const offset of [-8, -6, -4, -2, 2, 4, 6, 8, 12, 14, 16, 18]) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 0.5 * pxPerMrad);
  }

  for (const offset of [-10, 10, 20]) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 1.25 * pxPerMrad);
  }
}

function drawVerticalHash(
  canvas: ReticleCanvas,
  x: number,
  centerY: number,
  halfHeight: number
): void {
  canvas.line(x, centerY - halfHeight, x, centerY + halfHeight, linePaint);
}

function drawHorizontalHash(
  canvas: ReticleCanvas,
  centerX: number,
  y: number,
  halfWidth: number
): void {
  canvas.line(centerX - halfWidth, y, centerX + halfWidth, y, linePaint);
}
