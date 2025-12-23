import { describe, expect, test } from "bun:test";
import { Length, Velocity, Mass, Pressure, Temperature, Angle, Time } from "./uom";

describe("Length", () => {
  test("factory methods and conversions", () => {
    const meters = Length.meters(1);
    expect(meters.inMeters).toBe(1);
    expect(meters.inCentimeters).toBeCloseTo(100);
    expect(meters.inMillimeters).toBeCloseTo(1000);
    expect(meters.inInches).toBeCloseTo(39.3701);
    expect(meters.inFeet).toBeCloseTo(3.28084);
    expect(meters.inYards).toBeCloseTo(1.09361);

    const inches = Length.inches(12);
    expect(inches.inFeet).toBeCloseTo(1);

    const feet = Length.feet(3);
    expect(feet.inYards).toBeCloseTo(1);

    const yards = Length.yards(1);
    expect(yards.inFeet).toBeCloseTo(3);
  });

  test("arithmetic", () => {
    const l1 = Length.meters(10);
    const l2 = Length.meters(5);

    expect(l1.add(l2).inMeters).toBe(15);
    expect(l1.subtract(l2).inMeters).toBe(5);
    expect(l1.multiply(2).inMeters).toBe(20);
    expect(l1.divide(2).inMeters).toBe(5);
  });

  test("zero", () => {
    expect(Length.ZERO.inMeters).toBe(0);
  });
});

describe("Velocity", () => {
  test("factory methods and conversions", () => {
    const mps = Velocity.mps(10);
    expect(mps.inMps).toBe(10);
    expect(mps.inFps).toBeCloseTo(32.8084);
    expect(mps.inMph).toBeCloseTo(22.3694);

    const fps = Velocity.fps(1000);
    expect(fps.inFps).toBe(1000);

    const mph = Velocity.mph(60);
    expect(mph.inMph).toBe(60);
  });

  test("arithmetic", () => {
    const v1 = Velocity.mps(20);
    const v2 = Velocity.mps(10);

    expect(v1.add(v2).inMps).toBe(30);
    expect(v1.subtract(v2).inMps).toBe(10);
    expect(v1.multiply(2).inMps).toBe(40);
    expect(v1.divide(2).inMps).toBe(10);
  });

  test("zero", () => {
    expect(Velocity.ZERO.inMps).toBe(0);
  });
});

describe("Mass", () => {
  test("factory methods and conversions", () => {
    const kg = Mass.kilograms(1);
    expect(kg.inKilograms).toBe(1);
    expect(kg.inPounds).toBeCloseTo(2.20462);
    expect(kg.inGrains).toBeCloseTo(15432.36);

    const lbs = Mass.pounds(1);
    expect(lbs.inPounds).toBe(1);
    expect(lbs.inKilograms).toBeCloseTo(0.453592);

    const grains = Mass.grains(7000);
    expect(grains.inPounds).toBeCloseTo(1);
  });

  test("arithmetic", () => {
    const m1 = Mass.kilograms(10);
    const m2 = Mass.kilograms(2);

    expect(m1.add(m2).inKilograms).toBe(12);
    expect(m1.subtract(m2).inKilograms).toBe(8);
    expect(m1.multiply(2).inKilograms).toBe(20);
    expect(m1.divide(2).inKilograms).toBe(5);
  });

  test("zero", () => {
    expect(Mass.ZERO.inKilograms).toBe(0);
  });
});

describe("Pressure", () => {
  test("factory methods and conversions", () => {
    const pascals = Pressure.pascals(100000);
    expect(pascals.inPascals).toBe(100000);
    expect(pascals.inBar).toBe(1);
    expect(pascals.inInHg).toBeCloseTo(29.53);

    const inHg = Pressure.inHg(29.92);
    expect(inHg.inInHg).toBe(29.92);

    const bar = Pressure.bar(1);
    expect(bar.inPascals).toBe(100000);
  });

  test("arithmetic", () => {
    const p1 = Pressure.pascals(200);
    const p2 = Pressure.pascals(100);

    expect(p1.add(p2).inPascals).toBe(300);
    expect(p1.subtract(p2).inPascals).toBe(100);
    expect(p1.multiply(2).inPascals).toBe(400);
    expect(p1.divide(2).inPascals).toBe(100);
  });

  test("zero", () => {
    expect(Pressure.ZERO.inPascals).toBe(0);
  });
});

describe("Temperature", () => {
  test("factory methods and conversions", () => {
    // Freezing point of water
    const c = Temperature.celsius(0);
    expect(c.inCelsius).toBe(0);
    expect(c.inKelvin).toBe(273.15);
    expect(c.inFahrenheit).toBe(32);

    // Boiling point of water
    const f = Temperature.fahrenheit(212);
    expect(f.inFahrenheit).toBe(212);
    expect(f.inCelsius).toBeCloseTo(100);
    expect(f.inKelvin).toBeCloseTo(373.15);

    const k = Temperature.kelvin(0);
    expect(k.inKelvin).toBe(0);
    expect(k.inCelsius).toBe(-273.15);
  });
});

describe("Angle", () => {
  test("factory methods and conversions", () => {
    const rad = Angle.radians(Math.PI);
    expect(rad.inRadians).toBe(Math.PI);
    expect(rad.inDegrees).toBe(180);

    const deg = Angle.degrees(90);
    expect(deg.inDegrees).toBe(90);
    expect(deg.inRadians).toBeCloseTo(Math.PI / 2);

    const moa = Angle.moa(1);
    expect(moa.inMoa).toBe(1);
    // 1 MOA is 1/60th of a degree
    expect(moa.inDegrees).toBeCloseTo(1 / 60);

    const mrad = Angle.mrad(1);
    expect(mrad.inMrad).toBe(1);
    expect(mrad.inRadians).toBe(0.001);
  });

  test("arithmetic", () => {
    const a1 = Angle.degrees(90);
    const a2 = Angle.degrees(30);

    expect(a1.add(a2).inDegrees).toBeCloseTo(120);
    expect(a1.subtract(a2).inDegrees).toBeCloseTo(60);
    expect(a1.multiply(2).inDegrees).toBe(180);
    expect(a1.divide(2).inDegrees).toBe(45);
  });

  test("trigonometry", () => {
    const a = Angle.degrees(60);
    expect(a.cos()).toBeCloseTo(0.5);
    expect(a.sin()).toBeCloseTo(Math.sqrt(3) / 2);

    const b = Angle.degrees(45);
    expect(b.tan()).toBeCloseTo(1);
  });
});

describe("Time", () => {
  test("factory methods and conversions", () => {
    const t = Time.seconds(60);
    expect(t.inSeconds).toBe(60);
  });

  test("arithmetic", () => {
    const t1 = Time.seconds(10);
    const t2 = Time.seconds(5);

    expect(t1.add(t2).inSeconds).toBe(15);
    expect(t1.subtract(t2).inSeconds).toBe(5);
    expect(t1.multiply(2).inSeconds).toBe(20);
    expect(t1.divide(2).inSeconds).toBe(5);
  });

  test("zero", () => {
    expect(Time.ZERO.inSeconds).toBe(0);
  });
});
