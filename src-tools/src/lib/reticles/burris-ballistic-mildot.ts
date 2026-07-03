import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const MIL_TO_MRAD = 3.4377;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

interface BurrisBallisticMilDotConfig {
  radiusMrad: number;
  dotRadiusMil: number;
  lowerHashesMil: number[];
  lowerPostStartMil: number;
  postHalfWidthMil: number;
}

export function drawBallisticMildotBurris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBurrisBallisticMilDot(canvas, input, {
    radiusMrad: 19,
    dotRadiusMil: 0.1,
    lowerHashesMil: [0.7639, 2.3205, 4.3736, 6.8755, 9.9599, 13.818],
    lowerPostStartMil: 13.818,
    postHalfWidthMil: 0.1,
  });
}

export function drawXtrBallisticMildotBurris(
  canvas: ReticleCanvas,
  input: ReticleRenderInput
): void {
  drawBurrisBallisticMilDot(canvas, input, {
    radiusMrad: 30,
    dotRadiusMil: 0.15,
    lowerHashesMil: [2.3489, 5.5709, 9.3431, 13.657, 18.555, 24.144],
    lowerPostStartMil: 24.144,
    postHalfWidthMil: 0.1,
  });
}

function drawBurrisBallisticMilDot(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  config: BurrisBallisticMilDotConfig
): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMrad = size / (config.radiusMrad * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const pxPerMil = pxPerMrad * MIL_TO_MRAD;
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * config.radiusMrad;
  const scaledRadius = pxPerMrad * config.radiusMrad;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(centerX, centerY - scaledRadius, centerX, centerY + scaledRadius, linePaint);
  canvas.line(centerX - scaledRadius, centerY, centerX + scaledRadius, centerY, linePaint);

  const dotRadius = config.dotRadiusMil * pxPerMil;
  for (const offsetMil of [1, 2, 3, 4]) {
    const offset = offsetMil * pxPerMil;
    canvas.circle(centerX, centerY - offset, dotRadius, fillPaint);
    canvas.circle(centerX + offset, centerY, dotRadius, fillPaint);
    canvas.circle(centerX - offset, centerY, dotRadius, fillPaint);
  }

  for (const offsetMil of config.lowerHashesMil) {
    const y = centerY + offsetMil * pxPerMil;
    canvas.line(centerX - 0.5 * pxPerMil, y, centerX + 0.5 * pxPerMil, y, linePaint);
  }

  const postStartPx = 5 * pxPerMil;
  const postHalfWidth = config.postHalfWidthMil * pxPerMil;
  canvas.rect(
    centerX + postStartPx,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - postStartPx,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - postStartPx,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + config.lowerPostStartMil * pxPerMil,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
}
