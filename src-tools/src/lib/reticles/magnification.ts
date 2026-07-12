import type { ReticleMagnification } from "./types";

const VISUAL_TARGET_BASE_MAGNIFICATION = 10;
const VISUAL_TARGET_BASE_RADIUS_MRAD = 7;

export function getReticleMagnificationScale(magnification?: ReticleMagnification): number {
  if (magnification?.firstFocalPlane) {
    return getValidMagnificationRatio(magnification);
  }

  return 1;
}

export function getVisualTargetMagnificationScale(magnification?: ReticleMagnification): number {
  const currentMagnification =
    magnification?.currentMagnification ?? VISUAL_TARGET_BASE_MAGNIFICATION;

  if (Number.isFinite(currentMagnification) && currentMagnification > 0) {
    return currentMagnification / VISUAL_TARGET_BASE_MAGNIFICATION;
  }

  return 1;
}

export function getVisualTargetPxPerMrad(
  width: number,
  height: number,
  magnification?: ReticleMagnification
): number {
  const size = Math.min(width || 320, height || 320);

  return (
    (size / (VISUAL_TARGET_BASE_RADIUS_MRAD * 2)) * getVisualTargetMagnificationScale(magnification)
  );
}

function getValidMagnificationRatio(magnification: ReticleMagnification): number {
  const trueMagnification = magnification.trueMagnification ?? 1;
  const currentMagnification = magnification.currentMagnification ?? trueMagnification;

  if (
    Number.isFinite(trueMagnification) &&
    Number.isFinite(currentMagnification) &&
    trueMagnification > 0 &&
    currentMagnification > 0
  ) {
    return currentMagnification / trueMagnification;
  }

  return 1;
}
