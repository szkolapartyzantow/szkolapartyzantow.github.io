import { describe, expect, it } from "vitest";

import {
  getReticleMagnificationScale,
  getVisualTargetPxPerMrad,
  getVisualTargetMagnificationScale,
} from "./magnification";

describe("getReticleMagnificationScale", () => {
  it("keeps second focal plane reticles at native visual scale", () => {
    expect(
      getReticleMagnificationScale({
        firstFocalPlane: false,
        trueMagnification: 10,
        currentMagnification: 5,
      })
    ).toBe(1);
  });

  it("scales first focal plane reticles with current magnification", () => {
    expect(
      getReticleMagnificationScale({
        firstFocalPlane: true,
        trueMagnification: 10,
        currentMagnification: 5,
      })
    ).toBe(0.5);
  });

  it("falls back to native scale for invalid magnification values", () => {
    expect(
      getReticleMagnificationScale({
        firstFocalPlane: true,
        trueMagnification: 0,
        currentMagnification: 5,
      })
    ).toBe(1);
  });
});

describe("getVisualTargetMagnificationScale", () => {
  it("scales visual targets by absolute current magnification", () => {
    expect(
      getVisualTargetMagnificationScale({
        firstFocalPlane: false,
        trueMagnification: 10,
        currentMagnification: 5,
      })
    ).toBe(0.5);
  });

  it("uses the same absolute magnification scale for first focal plane targets", () => {
    expect(
      getVisualTargetMagnificationScale({
        firstFocalPlane: true,
        trueMagnification: 10,
        currentMagnification: 5,
      })
    ).toBe(0.5);
  });

  it("falls back to native scale for invalid target magnification values", () => {
    expect(
      getVisualTargetMagnificationScale({
        firstFocalPlane: false,
        trueMagnification: 10,
        currentMagnification: 0,
      })
    ).toBe(1);
  });
});

describe("getVisualTargetPxPerMrad", () => {
  it("renders a 12x target larger than a 10x target independent of reticle calibration", () => {
    const targetAt10x = getVisualTargetPxPerMrad(320, 320, {
      firstFocalPlane: false,
      trueMagnification: 10,
      currentMagnification: 10,
    });
    const targetAt12x = getVisualTargetPxPerMrad(320, 320, {
      firstFocalPlane: false,
      trueMagnification: 12,
      currentMagnification: 12,
    });

    expect(targetAt12x).toBeGreaterThan(targetAt10x);
    expect(targetAt12x / targetAt10x).toBeCloseTo(1.2);
  });
});
