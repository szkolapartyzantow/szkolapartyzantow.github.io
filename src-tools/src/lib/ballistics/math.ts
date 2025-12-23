/**
 * Math Helpers
 *
 * Simple 3D vector implementation and math utilities.
 * Vector3 is immutable and stores values as raw numbers (representing SI base units).
 */

export class Vector3 {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {}

  static readonly ZERO = new Vector3(0, 0, 0);

  static new(x: number, y: number, z: number): Vector3 {
    return new Vector3(x, y, z);
  }

  /**
   * Adds another vector to this one.
   */
  add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * Subtracts another vector from this one.
   */
  subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /**
   * Scales the vector by a scalar value.
   */
  scale(s: number): Vector3 {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  }

  /**
   * Calculates the dot product with another vector.
   */
  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Calculates the cross product with another vector.
   */
  cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Calculates the magnitude (length) of the vector.
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Returns a normalized unit vector.
   * Returns ZERO if magnitude is 0.
   */
  normalize(): Vector3 {
    const m = this.magnitude();
    if (m === 0) return Vector3.ZERO;
    return this.scale(1 / m);
  }

  /**
   * Access components by index (0=x, 1=y, 2=z) to mirror Rust vec3 behavior.
   */
  get(index: number): number {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
