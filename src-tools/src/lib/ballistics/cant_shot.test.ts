import { describe, it, expect } from "vitest";
import { Ammunition, BallisticCoefficient, BallisticCoefficientType } from "./ammunition";
import { Atmosphere } from "./atmosphere";
import { DragTableId } from "./drag_table";
import { Rifle, Sight, ZeroingParameters } from "./rifle";
import { ShotParameters, TrajectoryCalculator } from "./trajectory_calculator";
import { Angle, Length, Mass, Velocity } from "./uom";

describe("TrajectoryCalculator - Cant and Shot Angle", () => {
  const bc = new BallisticCoefficient(0.5, BallisticCoefficientType.Coefficient, DragTableId.G1);
  const ammo = new Ammunition(Mass.grains(168), bc, Velocity.fps(2650));

  const zeroParams = new ZeroingParameters(Length.meters(100));
  const sight = new Sight(Length.centimeters(5));
  const rifle = new Rifle(sight, zeroParams);

  const calc = new TrajectoryCalculator();
  const sightAngle = calc.calculateSightAngle(ammo, rifle);

  it("rotates trajectory behavior for 90 degree cant without wind", () => {
    // Case 1: Standard shot
    const params1 = ShotParameters.new(
      sightAngle,
      Length.meters(100),
      Length.meters(1000),
      Angle.ZERO,
      Angle.ZERO
    );

    const traj1 = calc.calculateTrajectory(ammo, rifle, Atmosphere.standard(), params1);
    const point1 = traj1[traj1.length - 1]!;

    // Case 2: 90 deg Cant
    const params2 = ShotParameters.new(
      sightAngle,
      Length.meters(100),
      Length.meters(1000),
      Angle.degrees(90),
      Angle.ZERO
    );

    const traj2 = calc.calculateTrajectory(ammo, rifle, Atmosphere.standard(), params2);
    const point2 = traj2[traj2.length - 1]!;

    expect(point2.windage.inMeters).toBeGreaterThan(0.5);
    expect(Math.abs(point1.drop.inMeters - point2.drop.inMeters)).toBeGreaterThan(0.5);
    expect(point2.drop.inMeters).toBeLessThan(point1.drop.inMeters);
  });

  it("outputs drop relative to LOS for angled shots", () => {
    // Case 3: 45 deg Shot Angle (Uphill)
    const params3 = ShotParameters.new(
      sightAngle,
      Length.meters(100),
      Length.meters(1000),
      Angle.ZERO,
      Angle.degrees(45)
    );

    const traj3 = calc.calculateTrajectory(ammo, rifle, Atmosphere.standard(), params3);
    const point3 = traj3[traj3.length - 1]!;

    expect(point3.drop.inMeters).toBeLessThan(0);
    expect(Math.abs(point3.drop.inMeters)).toBeLessThan(50.0);
  });
});
