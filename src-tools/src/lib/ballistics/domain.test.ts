import { describe, it, expect } from "bun:test";
import { Ammunition, BallisticCoefficient, BallisticCoefficientType } from "./ammunition";
import { DragTableId } from "./drag_table";
import { Length, Mass, Velocity } from "./uom";

describe("Ammunition", () => {
  it("should return correct ballistic coefficient for coefficient type", () => {
    const expectedCoefficient = 0.234;
    const bc = new BallisticCoefficient(
      expectedCoefficient,
      BallisticCoefficientType.Coefficient,
      DragTableId.G1
    );
    const ammo = new Ammunition(Mass.grains(55.0), bc, Velocity.mps(800.0));

    expect(ammo.getBallisticCoefficient()).toBeCloseTo(expectedCoefficient, 5);
  });

  it("should calculate ballistic coefficient from form factor", () => {
    // Rust test case: 40.0 grains, 0.204 inches, 1.184 form factor -> 0.116 expected
    const weight = 40.0;
    const diameter = 0.204;
    const formFactor = 1.184;
    const expectedCoefficient = 0.116;

    const bc = new BallisticCoefficient(
      formFactor,
      BallisticCoefficientType.FormFactor,
      DragTableId.G1
    );
    const ammo = new Ammunition(
      Mass.grains(weight),
      bc,
      Velocity.mps(800.0),
      Length.inches(diameter)
    );

    expect(ammo.getBallisticCoefficient()).toBeCloseTo(expectedCoefficient, 3);
  });

  it("should calculate ballistic coefficient from form factor (case 2)", () => {
    // Rust test case: 155.0 grains, 0.308 inches, 0.981 form factor -> 0.238 expected
    const weight = 155.0;
    const diameter = 0.308;
    const formFactor = 0.981;
    const expectedCoefficient = 0.238;

    const bc = new BallisticCoefficient(
      formFactor,
      BallisticCoefficientType.FormFactor,
      DragTableId.G1
    );
    const ammo = new Ammunition(
      Mass.grains(weight),
      bc,
      Velocity.mps(800.0),
      Length.inches(diameter)
    );

    expect(ammo.getBallisticCoefficient()).toBeCloseTo(expectedCoefficient, 3);
  });

  it("should throw error when weight is invalid for form factor calculation", () => {
    const bc = new BallisticCoefficient(0.981, BallisticCoefficientType.FormFactor, DragTableId.G1);
    const ammo = new Ammunition(Mass.grains(0.0), bc, Velocity.mps(800.0), Length.inches(0.308));

    expect(() => ammo.getBallisticCoefficient()).toThrow("Bullet weight must be greater than 0");
  });

  it("should throw error when diameter is missing for form factor calculation", () => {
    const bc = new BallisticCoefficient(0.981, BallisticCoefficientType.FormFactor, DragTableId.G1);
    const ammo = new Ammunition(Mass.grains(155.0), bc, Velocity.mps(800.0));

    expect(() => ammo.getBallisticCoefficient()).toThrow(
      "Diameter is required to calculate ballistic coefficient from form factor"
    );
  });
});
