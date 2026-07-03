import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MOA = 15;
const POST_START_MOA = 5.31;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawVarmintHuntersLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMoa = size / (RETICLE_RADIUS_MOA * 2);
  const pxPerMoa = basePxPerMoa * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMoa * RETICLE_RADIUS_MOA;
  const scaledRadius = pxPerMoa * RETICLE_RADIUS_MOA;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMoa, input.target);

  canvas.line(centerX, centerY - scaledRadius, centerX, centerY + scaledRadius, linePaint);
  canvas.line(centerX - scaledRadius, centerY, centerX + scaledRadius, centerY, linePaint);

  const sideTickHalfLength = 0.35 * pxPerMoa;
  for (const offset of [1.77, 3.54]) {
    canvas.line(
      centerX + offset * pxPerMoa,
      centerY - sideTickHalfLength,
      centerX + offset * pxPerMoa,
      centerY + sideTickHalfLength,
      linePaint
    );
    canvas.line(
      centerX - offset * pxPerMoa,
      centerY - sideTickHalfLength,
      centerX - offset * pxPerMoa,
      centerY + sideTickHalfLength,
      linePaint
    );
  }

  for (const mark of [
    { y: 1.81, halfWidth: 2.86, ticks: [2.86, 5.72] },
    { y: 4.13, halfWidth: 4.09, ticks: [4.09, 8.17] },
    { y: 7.02, halfWidth: 5.49, ticks: [5.49, 10.99] },
    { y: 9.35, halfWidth: 2.86, ticks: [] },
  ]) {
    const y = centerY + mark.y * pxPerMoa;
    canvas.line(
      centerX - mark.halfWidth * pxPerMoa,
      y,
      centerX + mark.halfWidth * pxPerMoa,
      y,
      linePaint
    );
    for (const tick of mark.ticks) {
      canvas.line(
        centerX + tick * pxPerMoa,
        y - sideTickHalfLength,
        centerX + tick * pxPerMoa,
        y + sideTickHalfLength,
        linePaint
      );
      canvas.line(
        centerX - tick * pxPerMoa,
        y - sideTickHalfLength,
        centerX - tick * pxPerMoa,
        y + sideTickHalfLength,
        linePaint
      );
    }
  }

  const postHalfWidth = 0.36 * pxPerMoa;
  canvas.rect(
    centerX + POST_START_MOA * pxPerMoa,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - POST_START_MOA * pxPerMoa,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + 9.35 * pxPerMoa,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - POST_START_MOA * pxPerMoa,
    fillPaint
  );
}
