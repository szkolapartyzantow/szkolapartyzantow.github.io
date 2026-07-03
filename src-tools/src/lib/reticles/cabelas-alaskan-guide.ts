import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MOA = 15;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };

export function drawCabelasAlaskanGuide(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  const ringRadius = 4.29705 * pxPerMoa;
  canvas.circle(centerX, centerY, ringRadius, linePaint);

  const firstY = centerY + 2.5464 * pxPerMoa;
  const firstLeft = centerX - 4.29705 * 2.5 * pxPerMoa;
  canvas.line(firstLeft, firstY, centerX + 4.29705 * pxPerMoa, firstY, linePaint);
  canvas.circle(centerX - 4.29705 * 1.6 * pxPerMoa, firstY, 2.8647 * pxPerMoa, linePaint);

  const secondY = centerY + 5.490675 * pxPerMoa;
  canvas.line(
    centerX - 2.8647 * pxPerMoa,
    secondY,
    centerX + 4.29705 * 2 * pxPerMoa,
    secondY,
    linePaint
  );
  canvas.circle(centerX + 2.148525 * 2 * pxPerMoa, secondY, 2.148525 * pxPerMoa, linePaint);

  const thirdY = centerY + 8.40312 * pxPerMoa;
  const thirdHalfLength = (4.29705 * 1.6 - 2.8647) * pxPerMoa;
  canvas.line(centerX - thirdHalfLength, thirdY, centerX + thirdHalfLength, thirdY, linePaint);
  canvas.circle(centerX, thirdY, 1.71882 * pxPerMoa, linePaint);
}
