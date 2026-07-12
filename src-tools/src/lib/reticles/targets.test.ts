import { describe, expect, it, vi } from "vitest";

import type { ReticleCanvas } from "./types";
import { drawVisualTarget } from "./targets";

describe("drawVisualTarget", () => {
  it("draws an IDPA target using regulation proportions", () => {
    const canvas: ReticleCanvas = {
      line: vi.fn(),
      circle: vi.fn(),
      rect: vi.fn(),
      polygon: vi.fn(),
    };

    drawVisualTarget(canvas, 100, 200, 10, {
      kind: "IDPA",
      widthMrad: 18,
      heightMrad: 30,
    });

    expect(canvas.polygon).toHaveBeenNthCalledWith(
      1,
      [
        { x: 70, y: 50 },
        { x: 130, y: 50 },
        { x: 130, y: 110 },
        { x: 160, y: 110 },
        { x: 190, y: 140 },
        { x: 190, y: 300 },
        { x: 160, y: 350 },
        { x: 40, y: 350 },
        { x: 10, y: 300 },
        { x: 10, y: 140 },
        { x: 40, y: 110 },
        { x: 70, y: 110 },
      ],
      expect.objectContaining({ fill: true })
    );
    expect(canvas.circle).toHaveBeenNthCalledWith(1, 100, 80, 20, expect.any(Object));
    expect(canvas.circle).toHaveBeenNthCalledWith(2, 100, 190, 40, expect.any(Object));
  });
});
