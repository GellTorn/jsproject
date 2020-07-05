
export default class Vector2 {

  public x: number;

  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  /** Create Vector form another Vector */
  static fromVector(vector: Vector2): Vector2 {
    return new Vector2(vector.x, vector.y);
  }
  /** Create Vector form array */
  static fromArray(array: number[]): Vector2 {
    return new Vector2(array[0], array[1]);
  }
  /** Set the `x` and `y` components of the this Vector to the given `x` and `y` values. */
  set(x: number, y: number = x): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }
  /** Sets the `x` and `y` values of this object from a given polar coordinate. */
  setToPolar(azimuth: number, radius: number = 1): Vector2 {
    this.x = Math.cos(azimuth) * radius;
    this.y = Math.sin(azimuth) * radius;
    return this;
  }
  /** Check whether this Vector is equal to a given Vector. */
  equals(v: Vector2): boolean {
    return ((this.x === v.x) && (this.y === v.y));
  }
  /** Calculate the angle between this Vector and the positive x-axis, in radians. */
  angle(): number {
    let angle = Math.atan2(this.y, this.x);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }
    return angle;
  }
  /** Set the angle of this Vector. */
  setAngle(angle: number): Vector2 {
    return this.setToPolar(angle, this.length());
  }
  /** Add a given Vector to this Vector. Addition is component-wise. */
  add(src: Vector2): Vector2{
    this.x += src.x;
    this.y += src.y;
    return this;
  }
  /** Subtract the given Vector from this Vector. Subtraction is component-wise. */
  subtract(src: Vector2): Vector2{
    this.x -= src.x;
    this.y -= src.y;
    return this;
  }
  /** Multiplies this Vector by the given Vector. */
  multiply(src: Vector2): Vector2{
    this.x *= src.x;
    this.y *= src.y;
    return this;
  }
  /** Divides this Vector by the given Vector. */
  divide(src: Vector2): Vector2{
    this.x /= src.x;
    this.y /= src.y;
    return this;
  }
  /** Scale this Vector by the given value. */
  scale(value: number): Vector2{
    if (isFinite(value)) {
      this.x *= value;
      this.y *= value;
    }
    else{
      this.x = 0;
      this.y = 0;
    }
    return this;
  }
  /** Negate the `x` and `y` components of this Vector. */
  negate(): Vector2{
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  /** Calculate the distance between this Vector and the given Vector. */
  distance(src: Vector2): number {
    const dx = src.x - this.x;
    const dy = src.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
  /** Calculate the distance between this Vector and the given Vector, squared. */
  distanceSq(src: Vector2): number{
    const dx = src.x - this.x;
    const dy = src.y - this.y;

    return dx * dx + dy * dy;
  }
  /** Calculate the length (or magnitude) of this Vector. */
  length(): number {
    const x = this.x;
    const y = this.y;

    return Math.sqrt(x * x + y * y);
  }
  /** Set the length (or magnitude) of this Vector. */
  setLength(length: number): Vector2 {
    return this.normalize().scale(length);
  }
  /** Calculate the length of this Vector squared. */
  lengthSq(): number {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }
  /** Makes the vector a unit length vector (magnitude of 1) in the same direction. */
  normalize(): Vector2{
    const x = this.x;
    const y = this.y;
    let len = x * x + y * y;

    if (len > 0) {
      len = 1 / Math.sqrt(len);

      this.x = x * len;
      this.y = y * len;
    }

    return this;
  }
  /** Rotate this Vector to its perpendicular, in the positive direction. */
  normalizeRightHand(): Vector2 {
    const x = this.x;

    this.x = this.y * -1;
    this.y = x;

    return this;
  }
  /** Rotate this Vector to its perpendicular, in the negative direction. */
  normalizeLeftHand(): Vector2{
    const x = this.x;

    this.x = this.y;
    this.y = x * -1;

    return this;
  }
  /** Calculate the dot product of this Vector and the given Vector. */
  dot(src: Vector2): number {
    return this.x * src.x + this.y * src.y;
  }
  /** Calculate the cross product of this Vector and the given Vector. */
  cross(src: Vector2): number {
    return this.x * src.y - this.y * src.x;
  }
  /**Linearly interpolate between this Vector and the given Vector.
   *
   * Interpolates this Vector towards the given Vector. 
   * The interpolation percentage, between 0 and 1.
   */
  lerp(src: Vector2, t: number = 0): Vector2{
    const ax = this.x;
    const ay = this.y;

    this.x = ax + t * (src.x - ax);
    this.y = ay + t * (src.y - ay);

    return this;
  }
  /** Make this Vector the zero vector (0, 0). */
  reset(): Vector2{
    this.x = 0;
    this.y = 0;

    return this;
  }
  /** Limit the length (or magnitude) of this Vector. */
  limit(max: number): Vector2 {
    const len = this.length();

    if (len && len > max) {
      this.scale(max / len);
    }

    return this;
  }
  /** Reflect this Vector off a line defined by a normal. */
  reflect(normal: Vector2): Vector2 {
      normal = Vector2.fromVector(normal).normalize();

      return this.subtract(normal.scale(2 * this.dot(normal)));
  }
  /** Reflect this Vector across another. */
  mirror(axis: Vector2): Vector2 {
     return this.reflect(axis).negate();
  }
  /** Rotate this Vector by an angle amount. 
   * 
   * The angle to rotate by, in radians.
  */
  rotate(delta: number): Vector2 {
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);

    return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }

  toPolar() {
    return {
      p: Math.sqrt(this.x * this.x + this.y * this.y),
      q: Math.atan2(this.y, this.x),
    };
  }
}