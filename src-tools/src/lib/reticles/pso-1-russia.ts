import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 22;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };

export function drawPso1Russia(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  canvas.line(centerX - scaledRadius, centerY, centerX - 12 * pxPerMrad, centerY, linePaint);
  canvas.line(centerX + 12 * pxPerMrad, centerY, centerX + scaledRadius, centerY, linePaint);
  canvas.line(centerX, centerY + 12.65 * pxPerMrad, centerX, centerY + scaledRadius, linePaint);

  for (let i = 1; i <= 10; i += 1) {
    const tickLength = (i % 5 === 0 ? 2.25 : 1.25) * pxPerMrad;
    const leftX = centerX - i * pxPerMrad;
    const rightX = centerX + i * pxPerMrad;
    canvas.line(leftX, centerY, leftX, centerY + tickLength, linePaint);
    canvas.line(rightX, centerY, rightX, centerY + tickLength, linePaint);
  }

  canvas.line(centerX, centerY, centerX - 0.5 * pxPerMrad, centerY + 1.25 * pxPerMrad, linePaint);
  canvas.line(centerX, centerY, centerX + 0.5 * pxPerMrad, centerY + 1.25 * pxPerMrad, linePaint);

  for (const start of [3.4, 7.2, 11.4]) {
    canvas.line(
      centerX,
      centerY + start * pxPerMrad,
      centerX - 0.3 * pxPerMrad,
      centerY + (start + 1.25) * pxPerMrad,
      linePaint
    );
    canvas.line(
      centerX,
      centerY + start * pxPerMrad,
      centerX + 0.3 * pxPerMrad,
      centerY + (start + 1.25) * pxPerMrad,
      linePaint
    );
  }
}
