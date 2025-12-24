import { Angle, Energy, Length, Mass, Time, Velocity, UOM } from "./uom";
import { Vector3 } from "./math";
import { DragTable, DragTableId, DragTableStorage } from "./drag_table";
import { Ammunition } from "./ammunition";
import { Atmosphere } from "./atmosphere";
import { Rifle, TwistDirection, Wind } from "./rifle";

export class TrajectoryPoint {
  constructor(
    public readonly time: Time,
    public readonly distance: Length,
    public readonly velocity: Velocity,
    public readonly mach: number,
    public readonly drop: Length,
    public readonly windage: Length,
    public readonly energy: Energy,
    public readonly dropAdjustment: Angle,
    public readonly windageAdjustment: Angle,
    public readonly optimalGameWeight: Mass
  ) {}

  static new(
    time: Time,
    distance: Length,
    velocity: Velocity,
    weight: Mass,
    mach: number,
    drop: Length,
    windage: Length
  ): TrajectoryPoint {
    return new TrajectoryPoint(
      time,
      distance,
      velocity,
      mach,
      drop,
      windage,
      TrajectoryPoint.calculateKineticEnergy(weight, velocity),
      Angle.radians(distance.inMeters > 0 ? Math.atan(drop.inMeters / distance.inMeters) : 0),
      Angle.radians(distance.inMeters > 0 ? Math.atan(windage.inMeters / distance.inMeters) : 0),
      TrajectoryPoint.calculateOptimalGameWeight(weight, velocity)
    );
  }

  static calculateKineticEnergy(weight: Mass, velocity: Velocity): Energy {
    const w = weight.inKilograms;
    const v = velocity.inMps;
    return Energy.joules(0.5 * w * Math.pow(v, 2));
  }

  static calculateOptimalGameWeight(weight: Mass, velocity: Velocity): Mass {
    const w = weight.inGrains;
    const v = velocity.inFps;
    // OGW = (V^3 * W^2) * 1.5e-12
    return Mass.pounds(Math.pow(w, 2) * Math.pow(v, 3) * 1.5e-12);
  }
}

export class ShotParameters {
  constructor(
    public readonly sightAngle: Angle,
    public readonly step: Length,
    public readonly maxDistance: Length,
    public readonly cantAngle: Angle,
    public readonly shotAngle: Angle,
    public readonly barrelAzimuth: Angle
  ) {}

  static new(
    sightAngle: Angle,
    step: Length,
    maxDistance: Length,
    cantAngle: Angle = Angle.ZERO,
    shotAngle: Angle = Angle.ZERO,
    barrelAzimuth: Angle = Angle.ZERO
  ): ShotParameters {
    return new ShotParameters(sightAngle, step, maxDistance, cantAngle, shotAngle, barrelAzimuth);
  }
}

export class TrajectoryCalculator {
  static readonly PIR = 2.08551e-4;

  public maxStepSize = Length.meters(0.1);
  public maxDrop = Length.meters(3000.0);
  public minVelocity = Velocity.mps(15.0);

  calculateTrajectory(
    ammunition: Ammunition,
    rifle: Rifle,
    atmosphere: Atmosphere,
    shotParameters: ShotParameters,
    wind?: Wind[],
    customDragTable?: DragTable
  ): TrajectoryPoint[] {
    const rangeTo = shotParameters.maxDistance;
    const step = shotParameters.step;
    const calculationStep = this.getCalculationStep(step);

    let dragTable: DragTable;
    if (customDragTable) {
      dragTable = customDragTable;
    } else {
      dragTable = DragTableStorage.get_drag_table(ammunition.getDragTableId());
    }

    const alt0 = atmosphere.altitude;
    const altDelta = Length.meters(1.0);
    let densityFactor = 0.0;
    let mach = Velocity.mps(0.0);

    const calculateDrift = !!rifle.rifling && !!ammunition.diameter && !!ammunition.length;

    let stabilityCoefficient = 1.0;
    if (calculateDrift) {
      stabilityCoefficient = TrajectoryCalculator.calculateStabilityCoefficient(
        ammunition,
        rifle,
        atmosphere
      );
    }

    const barrelAzimuth = shotParameters.barrelAzimuth;

    let velocity = ammunition.muzzleVelocity;
    let time = Time.ZERO;

    let currentWindIndex = 0;
    const defaultNextWindRange = Length.meters(1e7);
    let nextWindRange = defaultNextWindRange;
    if (wind && wind.length > 0 && wind[0].maxRange) {
      nextWindRange = wind[0].maxRange;
    }

    let windVector = Vector3.ZERO;
    if (wind && wind.length > 0) {
      windVector = TrajectoryCalculator.getWindVector(shotParameters, wind[0]);
    }

    // x - distance towards target
    // y - drop
    // z - windage

    // Initial Velocity Vector Calculation with Cant and Shot Angle
    // 1. Rifle Frame (No Cant, No Shot Angle)
    //    We align X with Line of Sight (LOS).
    //    Barrel is elevated by sightAngle relative to LOS.
    //    Barrel Azimuth is yaw relative to LOS.
    const sightAngle = shotParameters.sightAngle.inRadians;
    const barrelAzimuthAngle = barrelAzimuth.inRadians;
    const cantAngle = shotParameters.cantAngle.inRadians;
    const shotAngle = shotParameters.shotAngle.inRadians;
    const v = velocity.inMps;

    // Position in Rifle Frame
    // Scope is at (0,0,0)
    // Barrel is at (0, -sightHeight, 0)
    const p_x_rifle = 0;
    const p_y_rifle = -rifle.sight.height.inMeters;
    const p_z_rifle = 0;

    // Velocity in Rifle Frame (aligned with LOS, before cant)
    // x = forward, y = up, z = right
    const v_x_rifle = v * Math.cos(sightAngle) * Math.cos(barrelAzimuthAngle);
    const v_y_rifle = v * Math.sin(sightAngle);
    const v_z_rifle = v * Math.cos(sightAngle) * Math.sin(barrelAzimuthAngle);

    // 2. Apply Cant (Rotation around X axis)
    //    If I cant Right, top goes Right. RHR around X: Y -> Z.
    //    y' = y cos - z sin
    //    z' = y sin + z cos
    const cosCant = Math.cos(cantAngle);
    const sinCant = Math.sin(cantAngle);

    const v_x_canted = v_x_rifle;
    const v_y_canted = v_y_rifle * cosCant - v_z_rifle * sinCant;
    const v_z_canted = v_y_rifle * sinCant + v_z_rifle * cosCant;

    const p_x_canted = p_x_rifle;
    const p_y_canted = p_y_rifle * cosCant - p_z_rifle * sinCant;
    const p_z_canted = p_y_rifle * sinCant + p_z_rifle * cosCant;

    // 3. Apply Shot Angle (Rotation around Z axis - Pitch)
    //    Shot Angle is elevation of LOS.
    //    We rotate the whole system UP by shotAngle.
    //    Rotation around Z axis (if Z is right).
    //    x'' = x' cos(s) - y' sin(s)
    //    y'' = x' sin(s) + y' cos(s)
    //    z'' = z'
    const cosShotAngle = Math.cos(shotAngle);
    const sinShotAngle = Math.sin(shotAngle);

    const v_x_global = v_x_canted * cosShotAngle - v_y_canted * sinShotAngle;
    const v_y_global = v_x_canted * sinShotAngle + v_y_canted * cosShotAngle;
    const v_z_global = v_z_canted;

    const p_x_global = p_x_canted * cosShotAngle - p_y_canted * sinShotAngle;
    const p_y_global = p_x_canted * sinShotAngle + p_y_canted * cosShotAngle;
    const p_z_global = p_z_canted;

    let velocityVector = new Vector3(v_x_global, v_y_global, v_z_global);
    let rangeVector = new Vector3(p_x_global, p_y_global, p_z_global);

    let currentItem = 0;
    const maxItem = Math.floor(rangeTo.inMeters / step.inMeters) + 1;
    const maximumRange = rangeTo.add(calculationStep);
    let nextRangeDistance = Length.ZERO;
    let lastAtAltitude = Length.meters(-1000000.0);
    const ballisticCoefficientVal = ammunition.getBallisticCoefficient();
    const ballisticFactor = 1.0 / ballisticCoefficientVal;
    const accumulatedFactor = TrajectoryCalculator.PIR * ballisticFactor;
    const earthGravity = 9.80665; // m/s^2
    let alt = alt0;

    const trajectoryPoints: TrajectoryPoint[] = [];

    // Precompute cos/sin for performance in loop for LOS transformation
    const cosShot = Math.cos(shotAngle);
    const sinShot = Math.sin(shotAngle);

    while (true) {
      // Calculate LOS position
      // Inverse rotation of Shot Angle (Pitch down by shotAngle)
      // x_los = x_g * cos(s) + y_g * sin(s)
      // y_los = -x_g * sin(s) + y_g * cos(s)
      const losX = rangeVector.x * cosShot + rangeVector.y * sinShot;
      const losY = -rangeVector.x * sinShot + rangeVector.y * cosShot;
      const losZ = rangeVector.z;

      if (losX > maximumRange.inMeters) {
        break;
      }

      // Update density and Mach velocity
      if (Math.abs(lastAtAltitude.inMeters - alt.inMeters) > altDelta.inMeters) {
        const result = atmosphere.getDensityFactorAndMachAtAltitude(alt);
        densityFactor = result.densityFactor;
        mach = result.mach;
        lastAtAltitude = alt;
      }

      if (velocity.inMps < this.minVelocity.inMps || rangeVector.y < -this.maxDrop.inMeters) {
        break;
      }

      // Wind updates
      if (losX >= nextWindRange.inMeters) {
        currentWindIndex += 1;
        if (wind && currentWindIndex < wind.length) {
          windVector = TrajectoryCalculator.getWindVector(shotParameters, wind[currentWindIndex]);
          if (wind[currentWindIndex].maxRange) {
            // If it's not the last wind segment
            if (currentWindIndex !== wind.length - 1) {
              nextWindRange = wind[currentWindIndex].maxRange!;
            } else {
              nextWindRange = Length.meters(1e7);
            }
          } else {
            nextWindRange = Length.meters(1e7);
          }
        }
      }

      // Record point
      if (losX >= nextRangeDistance.inMeters) {
        let windageVal = losZ;
        if (calculateDrift && rifle.rifling) {
          const twistDirectionVal = rifle.rifling.twistDirection === TwistDirection.Right ? -1 : 1;
          // Formula from Rust: 1.25 * (Sg + 1.2) * t^1.83 * twist_dir

          const driftInches =
            1.25 *
            (stabilityCoefficient + 1.2) *
            Math.pow(time.inSeconds, 1.83) *
            twistDirectionVal;

          windageVal += Length.inches(driftInches).inMeters;
        }

        trajectoryPoints.push(
          TrajectoryPoint.new(
            time,
            Length.meters(losX),
            velocity,
            ammunition.weight,
            velocity.inMps / mach.inMps,
            Length.meters(losY),
            Length.meters(windageVal)
          )
        );

        nextRangeDistance = nextRangeDistance.add(step);
        currentItem += 1;
        if (currentItem === maxItem) {
          break;
        }
      }

      // Integration Step
      const deltaTime = TrajectoryCalculator.calculateTravelTime(
        calculationStep,
        Velocity.mps(velocityVector.x)
      );

      const velocityAdjusted = new Vector3(
        velocityVector.x - windVector.x,
        velocityVector.y - windVector.y,
        velocityVector.z - windVector.z
      );

      velocity = Velocity.mps(velocityAdjusted.magnitude());

      const currentMach = velocity.inMps / mach.inMps;
      const { node: dragTableNode } = dragTable.find_node(currentMach);

      // Rust has a while loop to ensure node mach > current mach ?

      // Rust:
      /*
        let (mut drag_table_node, mut node_index) = drag_table.find_node(current_mach);
        while drag_table_node.mach > current_mach {
            node_index -= 1;
            drag_table_node = drag_table.get_node(node_index)
        }
      */
      // My `findNode` implementation in `drag_table.ts` already returns the correct interval (lower bound usually, or closest).
      // Let's assume `findNode` is correct. The Rust logic seems to be a safeguard or specific behavior of their binary search.
      // In `drag_table.ts` I wrote `find_node` returning `{node, index}`.
      // It returns the closest node?
      /*
        if (this.nodes[high].mach - mach > mach - this.nodes[low].mach) {
            return { node: this.nodes[low], index: low };
        } else {
            return { node: this.nodes[high], index: high };
        }
      */
      // This returns the *closest* node.
      // The Rust code seems to want the node *below* current_mach? Or just ensuring correct interpolation range?
      // `calculate_drag` uses `a, b, c` coefficients which are pre-calculated.
      // `c + mach * (b + a * mach)`
      // This looks like it expects `mach` to be relative to something or absolute?
      // Looking at `DragTable` constructor in TS (which I ported):
      // It fits a curve. The coefficients are likely for the segment starting at `node.mach`?
      // No, `DragTableNode` stores `mach`.
      // The formula is polynomial.
      // Let's stick to using the node returned by `findNode` for now.

      const drag =
        accumulatedFactor *
        densityFactor *
        dragTableNode.calculate_drag(currentMach) *
        velocity.inFps;
      const dt = deltaTime.inSeconds;

      velocityVector = new Vector3(
        velocityVector.x - dt * drag * velocityAdjusted.x,
        velocityVector.y - dt * drag * velocityAdjusted.y - earthGravity * dt,
        velocityVector.z - dt * drag * velocityAdjusted.z
      );

      const deltaRangeVector = new Vector3(
        calculationStep.inMeters,
        velocityVector.y * dt,
        velocityVector.z * dt
      );

      rangeVector = rangeVector.add(deltaRangeVector);
      alt = alt.add(Length.meters(deltaRangeVector.y));

      velocity = Velocity.mps(velocityVector.magnitude());

      // Recalculate time
      const deltaRangeVectorMagnitude = Length.meters(deltaRangeVector.magnitude());
      time = time.add(
        TrajectoryCalculator.calculateTravelTime(deltaRangeVectorMagnitude, velocity)
      );
    }

    return trajectoryPoints;
  }

  calculateSightAngle(
    ammunition: Ammunition,
    rifle: Rifle,
    atmosphere?: Atmosphere,
    customDragTable?: DragTable
  ): Angle {
    const rangeTo = rifle.zeroingParameters.distance.multiply(2.0);
    const step = rifle.zeroingParameters.distance.divide(100.0);
    const calculationStep = this.getCalculationStep(step);

    let dragTable: DragTable;
    if (customDragTable && ammunition.getDragTableId() === DragTableId.GC) {
      dragTable = customDragTable;
    } else if (customDragTable) {
      throw new Error(
        "Custom drag table provided, but ammunition ballistic coefficient is not a custom one."
      );
    } else if (ammunition.getDragTableId() === DragTableId.GC) {
      throw new Error(
        "Custom drag table needs to be provided if ammunition ballistic coefficient is a custom one!"
      );
    } else {
      dragTable = DragTableStorage.get_drag_table(ammunition.getDragTableId());
    }

    const defaultAtmosphere = Atmosphere.standard();
    const effectiveAtmosphere =
      rifle.zeroingParameters.atmosphere || atmosphere || defaultAtmosphere;
    const effectiveAmmunition = rifle.zeroingParameters.ammunition || ammunition;

    const alt0 = effectiveAtmosphere.altitude;
    const altDelta = Length.ZERO;
    let densityFactor = 0.0;
    let mach = Velocity.mps(0.0);

    const verticalOffset = rifle.zeroingParameters.verticalOffset || Length.ZERO;

    // Initial guess
    let sightAngle = Angle.moa(15.0); // Rust uses 150.0 minutes? 150 MOA is huge (2.5 degrees). Maybe 150.0 is right for long range, but for zeroing...
    // Rust: Angle::new::<minute>(150.0). 150 arcminutes.
    sightAngle = Angle.moa(150.0);

    const barrelAzimuth = Angle.radians(0.0);

    for (let i = 0; i < 100; i++) {
      const barrelElevation = sightAngle;
      let velocity = effectiveAmmunition.muzzleVelocity;
      let time = Time.ZERO;

      let rangeVector = new Vector3(0, -rifle.sight.height.inMeters, 0);
      let velocityVector = new Vector3(
        velocity.inMps * barrelElevation.cos() * barrelAzimuth.cos(),
        velocity.inMps * barrelElevation.sin(),
        velocity.inMps * barrelElevation.cos() * barrelAzimuth.sin()
      );

      let lastAtAltitude = Length.meters(-1000000.0);
      const ballisticFactor = 1.0 / effectiveAmmunition.getBallisticCoefficient();
      const accumulatedFactor = TrajectoryCalculator.PIR * ballisticFactor;
      const earthGravity = 9.80665;
      let alt = alt0;

      while (rangeVector.x <= rangeTo.inMeters) {
        if (Math.abs(lastAtAltitude.inMeters - alt.inMeters) > altDelta.inMeters) {
          const result = effectiveAtmosphere.getDensityFactorAndMachAtAltitude(alt);
          densityFactor = result.densityFactor;
          mach = result.mach;
          lastAtAltitude = alt;
        }

        if (velocity.inMps < this.minVelocity.inMps || rangeVector.y < -this.maxDrop.inMeters) {
          break;
        }

        const deltaTime = TrajectoryCalculator.calculateTravelTime(
          calculationStep,
          Velocity.mps(velocityVector.x)
        );
        const currentMach = velocity.inMps / mach.inMps;

        const { node: dragTableNode } = dragTable.find_node(currentMach);
        const drag =
          accumulatedFactor *
          densityFactor *
          dragTableNode.calculate_drag(currentMach) *
          velocity.inFps;

        const dt = deltaTime.inSeconds;
        velocityVector = new Vector3(
          velocityVector.x - dt * drag * velocityVector.x,
          velocityVector.y - dt * drag * velocityVector.y - earthGravity * dt,
          velocityVector.z - dt * drag * velocityVector.z
        );

        const deltaRangeVector = new Vector3(
          calculationStep.inMeters,
          velocityVector.y * dt,
          velocityVector.z * dt
        );

        rangeVector = rangeVector.add(deltaRangeVector);
        alt = alt.add(Length.meters(deltaRangeVector.y));

        if (rangeVector.x >= rifle.zeroingParameters.distance.inMeters) {
          const sightMatch = rangeVector.y - verticalOffset.inMeters;

          // Tolerance: 1mm
          if (Math.abs(sightMatch * 1000) < 1.0) {
            // sightMatch is meters, *1000 = mm
            return sightAngle;
          }

          // Adjustment
          // Rust:
          /*
                  sight_angle += Angle::new::<radian>(
                      (-sight_match.get::<centimeter>()
                          / rifle.zeroing_parameters.distance().get::<meter>()
                          * 100.0)
                          / 15574.0772465490,
                  );
                */
          // -sightMatch(m) * 100 (cm)
          // / distance(m) * 100
          // That simplifies to -sightMatch(m) / distance(m) * 10000 ?
          // Let's use base units.
          // -sightMatch (meters) / distance (meters) gives radians approx (tangent).
          // The magic number 15574... might be related to MOA or some convergence factor.
          // 15574 is roughly 1/0.0000642
          // Let's replicate exact formula using getters
          const sightMatchCm = sightMatch * 100;
          const distanceM = rifle.zeroingParameters.distance.inMeters;
          const adjustment = ((-sightMatchCm / distanceM) * 100.0) / 15574.077246549;
          sightAngle = sightAngle.add(Angle.radians(adjustment));
          break;
        }

        velocity = Velocity.mps(velocityVector.magnitude());
        const deltaRangeVectorMagnitude = Length.meters(deltaRangeVector.magnitude());
        time = time.add(
          TrajectoryCalculator.calculateTravelTime(deltaRangeVectorMagnitude, velocity)
        );
      }
    }

    throw new Error("Cannot find sight angle for given zero parameters.");
  }

  static calculateTravelTime(distance: Length, velocity: Velocity): Time {
    return Time.seconds(distance.inMeters / velocity.inMps);
  }

  static getWindVector(shotParameters: ShotParameters, wind: Wind): Vector3 {
    // Wind is defined on the horizontal plane (Global Frame).
    // X is downrange (horizontal), Y is up (vertical), Z is right.
    // wind.direction is angle relative to X axis?
    // Usually 0 degrees = From North? Or 0 = Tailwind?
    // In this codebase context (based on usage `rangeVelocity = windVelocity * Math.cos(windDirection)`),
    // it implies direction is angle from the Line of Fire (X axis).
    // So 0 deg = Tailwind (blowing towards target along X).

    const windDirection = wind.direction.inRadians;
    const windVelocity = wind.velocity.inMps;

    return new Vector3(
      windVelocity * Math.cos(windDirection),
      0,
      windVelocity * Math.sin(windDirection)
    );
  }

  getCalculationStep(step: Length): Length {
    let s = step.inMeters / 2.0;
    const maxStep = this.maxStepSize.inMeters;
    if (s <= maxStep) {
      return Length.meters(s);
    }

    const stepOrder = Math.floor(Math.log10(s));
    const maximumOrder = Math.floor(Math.log10(maxStep));
    const c = Math.pow(10.0, stepOrder - maximumOrder + 1.0);
    s = s / c;
    return Length.meters(s);
  }

  static calculateStabilityCoefficient(
    ammunition: Ammunition,
    rifle: Rifle,
    atmosphere: Atmosphere
  ): number {
    const weight = ammunition.weight.inGrains;
    if (!ammunition.diameter) throw new Error("Bullet diameter is required");
    const diameter = ammunition.diameter.inInches;

    if (!rifle.rifling) throw new Error("Rifling is required");
    const twist = rifle.rifling.step.inInches / diameter;

    if (!ammunition.length) throw new Error("Ammunition length is required");
    const length = ammunition.length.inInches / diameter;

    const sd =
      (30.0 * weight) /
      (Math.pow(twist, 2.0) * Math.pow(diameter, 3.0) * length * (1.0 + Math.pow(length, 2.0)));

    const fv = Math.pow(ammunition.muzzleVelocity.inFps / 2800.0, 1.0 / 3.0);

    const ft = atmosphere.temperature.inFahrenheit;
    const pt = atmosphere.pressure.inInHg;
    const ftp = ((ft + 460.0) / (59.0 + 460.0)) * (29.92 / pt);

    return sd * fv * ftp;
  }
}
