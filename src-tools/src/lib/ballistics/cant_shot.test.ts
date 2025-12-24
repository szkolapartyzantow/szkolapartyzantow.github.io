import { describe, it, expect } from "bun:test";
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

  it("should have different drop/windage when canted 90 degrees", () => {
    // Case 1: Standard shot
    const params1 = ShotParameters.new(
      sightAngle,
      Length.meters(100),
      Length.meters(1000),
      Angle.ZERO,
      Angle.ZERO
    );

    const traj1 = calc.calculateTrajectory(ammo, rifle, Atmosphere.standard(), params1);
    const point1 = traj1[traj1.length - 1];

    // Case 2: 90 deg Cant
    const params2 = ShotParameters.new(
      sightAngle,
      Length.meters(100),
      Length.meters(1000),
      Angle.degrees(90),
      Angle.ZERO
    );

    const traj2 = calc.calculateTrajectory(ammo, rifle, Atmosphere.standard(), params2);
    const point2 = traj2[traj2.length - 1];

    // Expect Windage to be non-zero (drift to right due to initial velocity vector rotation)
    expect(point2.windage.inMeters).toBeGreaterThan(0.5);

    // Expect Drop to be different (likely more drop because we lost sight elevation relative to gravity)
    // point1.drop is around -12.85m
    // point2.drop is around -14.15m
    expect(Math.abs(point1.drop.inMeters - point2.drop.inMeters)).toBeGreaterThan(0.5);
    expect(point2.drop.inMeters).toBeLessThan(point1.drop.inMeters);
  });

  it("should output drop relative to LOS for angled shots", () => {
    // Case 3: 45 deg Shot Angle (Uphill)
    const params3 = ShotParameters.new(
      sightAngle,
      Length.meters(100),
      Length.meters(1000),
      Angle.ZERO,
      Angle.degrees(45)
    );

    const traj3 = calc.calculateTrajectory(ammo, rifle, Atmosphere.standard(), params3);
    const point3 = traj3[traj3.length - 1];

    // If bug existed, drop would be huge positive (Altitude ~700m).
    // Correct drop should be small negative (relative to LOS).
    // Expected drop is around -8.8m
    expect(point3.drop.inMeters).toBeLessThan(0); // Should be negative (drop)
    expect(Math.abs(point3.drop.inMeters)).toBeLessThan(50.0); // Should be reasonable
  });
});
