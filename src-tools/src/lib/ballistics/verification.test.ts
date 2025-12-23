import { describe, it, expect } from "bun:test";
import * as fs from "fs";
import * as path from "path";
import { TrajectoryCalculator, ShotParameters } from "./trajectory_calculator";
import { Ammunition, BallisticCoefficient, BallisticCoefficientType } from "./ammunition";
import { Atmosphere } from "./atmosphere";
import { Rifle, Sight, ZeroingParameters, Rifling, TwistDirection } from "./rifle";
import { DragTableId } from "./drag_table";
import { Length, Mass, Velocity, Angle, UOM } from "./uom";

describe("Ballistics Verification", () => {
  it("should match Rust reference output", () => {
    // 1. Setup
    const calculator = new TrajectoryCalculator();

    const bc = new BallisticCoefficient(
      0.222,
      BallisticCoefficientType.Coefficient,
      DragTableId.G1
    );

    // Ammunition: 55gr, 825m/s, BC 0.222
    // Note: Rust example omits diameter and length, so we do too.
    const ammunition = new Ammunition(Mass.grains(55.0), bc, Velocity.mps(825.0));

    // Sight: 6.5cm height
    const sight = new Sight(Length.centimeters(6.5));

    // Zeroing: 50m
    const zeroParams = new ZeroingParameters(Length.meters(50.0));

    // Rifling: 7 inch twist, Right (Standard AR-15 usually, example uses 7")
    const rifling = new Rifling(Length.inches(7.0), TwistDirection.Right);

    const rifle = new Rifle(sight, zeroParams, rifling);

    const atmosphere = Atmosphere.standard();

    // 2. Calculate Zero
    // The rust example calculates sight angle first.
    // calculator.calculate_sight_angle(&ammunition, &rifle, &atmosphere, &None)
    const sightAngle = calculator.calculateSightAngle(ammunition, rifle, atmosphere);

    // 3. Prepare Shot
    // Rust example uses Step 200.0, Max 200.0? But CSV has 10m steps.
    // We will use 10m step to match CSV data granularity.
    const shotParams = ShotParameters.new(
      sightAngle,
      Length.meters(10.0), // Step
      Length.meters(200.0) // Max Distance
    );

    // 4. Calculate Trajectory
    const results = calculator.calculateTrajectory(ammunition, rifle, atmosphere, shotParams);

    // 5. Load and Compare CSV
    const csvPath = path.join(process.cwd(), "src/lib/ballistics/reference_result.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");
    const header = lines[0].split(",");
    const dataRows = lines.slice(1);

    // Map column names to indices
    const colMap = {
      distance: header.indexOf("distance"),
      velocity: header.indexOf("velocity"),
      drop: header.indexOf("drop"),
      adjustment: header.indexOf("adjustment"),
      energy: header.indexOf("energy"),
    };

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBe(dataRows.length);

    dataRows.forEach((row, index) => {
      const cols = row.split(",").map(parseFloat);
      const resultPoint = results[index];

      const expectedDistance = cols[colMap.distance];
      const expectedVelocity = cols[colMap.velocity];
      const expectedDrop = cols[colMap.drop];
      const expectedAdjustment = cols[colMap.adjustment];
      const expectedEnergy = cols[colMap.energy];

      // Debug output for first failure
      const context = `Row ${index} (Dist: ${expectedDistance})`;

      // Distance (m)
      expect(resultPoint.distance.inMeters).toBeCloseTo(expectedDistance, 1);

      // Velocity (m/s)
      expect(resultPoint.velocity.inMps).toBeCloseTo(expectedVelocity, 1);

      // Drop (cm) - Rust output is in cm. TS result.drop is Length.
      // Note: Rust output uses point.drop.get::<centimeter>().
      expect(resultPoint.drop.inCentimeters).toBeCloseTo(expectedDrop, 1);

      // Adjustment (mil) - Rust output uses NATO Mils (6400 per circle)
      // TS Angle.inMrad uses Mathematical Milliradians (2*PI*1000 per circle ~ 6283)
      // Conversion: 1 NATO Mil = 2*PI / 6400 radians
      // Expected (NATO) -> Radians -> Math Mrad
      const expectedAdjustmentNatoMil = expectedAdjustment;
      const expectedAdjustmentRadians = expectedAdjustmentNatoMil * ((2 * Math.PI) / 6400);
      const expectedAdjustmentMathMrad = expectedAdjustmentRadians * 1000;

      expect(resultPoint.dropAdjustment.inMrad).toBeCloseTo(expectedAdjustmentMathMrad, 1);

      // Energy (Joule)
      expect(resultPoint.energy.inJoules).toBeCloseTo(expectedEnergy, 0);
    });
  });
});
