import { describe, expect, it } from "vitest";
import { BallisticCoefficient, BallisticCoefficientType, Ammunition } from "./ammunition";
import { DragTableId, DragTableStorage } from "./drag_table";
import { Atmosphere } from "./atmosphere";
import { Rifle, Sight, Wind, ZeroingParameters } from "./rifle";
import { ShotParameters, TrajectoryCalculator, TrajectoryPoint } from "./trajectory_calculator";
import { Angle, Length, Mass, Pressure, Time, Velocity } from "./uom";

describe("Rust parity checks", () => {
  it("matches Rust kinetic energy when bullet weight is specified in grains", () => {
    const point = TrajectoryPoint.new(
      Time.ZERO,
      Length.ZERO,
      Velocity.mps(825),
      Mass.grains(55),
      0,
      Length.ZERO,
      Length.ZERO
    );

    expect(point.energy.inJoules).toBeCloseTo(1212.85, 2);
  });

  it("matches Rust/uom kinetic energy when bullet weight is specified in grams", () => {
    const point = TrajectoryPoint.new(
      Time.ZERO,
      Length.ZERO,
      Velocity.mps(800),
      Mass.grams(4),
      0,
      Length.ZERO,
      Length.ZERO
    );

    expect(point.energy.inJoules).toBeCloseTo(1280, 6);
  });

  it("matches Rust/uom hectopascal pressure conversion", () => {
    expect(Pressure.hectoPascals(1013.25).inPascals).toBeCloseTo(101325, 6);
  });

  it("uses the Rust wind vector transform including sight angle and cant", () => {
    const shot = ShotParameters.new(
      Angle.degrees(10),
      Length.meters(100),
      Length.meters(100),
      Angle.degrees(30)
    );
    const wind = new Wind(Angle.degrees(45), Velocity.mps(10));

    const vector = TrajectoryCalculator.getWindVector(shot, wind);

    expect(vector.x).toBeCloseTo(6.9636424, 6);
    expect(vector.y).toBeCloseTo(2.4721603, 6);
    expect(vector.z).toBeCloseTo(6.7376634, 6);
  });

  it("uses the Rust trajectory drag-node lower-bound correction", () => {
    const mach = 0.685;
    const dragTable = DragTableStorage.get_drag_table(DragTableId.G1);
    const { node } = dragTable.find_lower_node(mach);

    expect(node.mach).toBeLessThanOrEqual(mach);
    expect(node.mach).toBeCloseTo(0.6, 6);
  });

  it.fails("documents intentional divergence from Rust trajectory behavior for cant-only shots", () => {
    const calculator = new TrajectoryCalculator();
    const bc = new BallisticCoefficient(
      0.222,
      BallisticCoefficientType.Coefficient,
      DragTableId.G1
    );
    const ammunition = new Ammunition(Mass.grains(55), bc, Velocity.mps(825));
    const rifle = new Rifle(
      new Sight(Length.centimeters(6.5)),
      new ZeroingParameters(Length.meters(50))
    );
    const atmosphere = Atmosphere.standard();
    const sightAngle = calculator.calculateSightAngle(ammunition, rifle, atmosphere);

    const flat = calculator.calculateTrajectory(
      ammunition,
      rifle,
      atmosphere,
      ShotParameters.new(sightAngle, Length.meters(200), Length.meters(200))
    );
    const canted = calculator.calculateTrajectory(
      ammunition,
      rifle,
      atmosphere,
      ShotParameters.new(sightAngle, Length.meters(200), Length.meters(200), Angle.degrees(90))
    );

    expect(canted[1]!.drop.inCentimeters).toBeCloseTo(flat[1]!.drop.inCentimeters, 6);
    expect(canted[1]!.windage.inCentimeters).toBeCloseTo(flat[1]!.windage.inCentimeters, 6);
  });
});
