import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 20;
const RING_RADIUS_MRAD = 0.9549 * 0.5;
const HASH_OFFSETS_MRAD = [2.38725, 4.7745, 8.116651, 11.936251];
const RING_CENTERS_MRAD = [1.43235, 3.5808752, 6.20685, 9.787725, 14.084775];

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawBdc600Nikon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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
  const ringRadius = RING_RADIUS_MRAD * pxPerMrad;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(centerX - scaledRadius, centerY, centerX + scaledRadius, centerY, linePaint);

  for (const offset of HASH_OFFSETS_MRAD) {
    const y = centerY + offset * pxPerMrad;
    canvas.line(centerX - ringRadius, y, centerX + ringRadius, y, linePaint);
  }

  let verticalStart = centerY - scaledRadius;
  for (const ringCenterMrad of RING_CENTERS_MRAD) {
    const ringCenterY = centerY + ringCenterMrad * pxPerMrad;
    canvas.line(centerX, verticalStart, centerX, ringCenterY - ringRadius, linePaint);
    canvas.circle(centerX, ringCenterY, ringRadius, linePaint);
    verticalStart = ringCenterY + ringRadius;
  }
  canvas.line(centerX, verticalStart, centerX, centerY + 16.233301 * pxPerMrad, linePaint);

  const postHalfWidth = 0.5 * pxPerMrad;
  canvas.rect(
    centerX + 4.77 * pxPerMrad,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - 4.77 * pxPerMrad,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + 16.233301 * pxPerMrad,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
}
