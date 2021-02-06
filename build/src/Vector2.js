export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  static fromVector(vector) {
    return new Vector2(vector.x, vector.y);
  }
  static fromArray(array) {
    return new Vector2(array[0], array[1]);
  }
  set(x, y = x) {
    this.x = x;
    this.y = y;
    return this;
  }
  setToPolar(azimuth, radius = 1) {
    this.x = Math.cos(azimuth) * radius;
    this.y = Math.sin(azimuth) * radius;
    return this;
  }
  equals(v) {
    return this.x === v.x && this.y === v.y;
  }
  angle() {
    let angle = Math.atan2(this.y, this.x);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }
    return angle;
  }
  setAngle(angle) {
    return this.setToPolar(angle, this.length());
  }
  add(src) {
    this.x += src.x;
    this.y += src.y;
    return this;
  }
  subtract(src) {
    this.x -= src.x;
    this.y -= src.y;
    return this;
  }
  multiply(src) {
    this.x *= src.x;
    this.y *= src.y;
    return this;
  }
  divide(src) {
    this.x /= src.x;
    this.y /= src.y;
    return this;
  }
  scale(value) {
    if (isFinite(value)) {
      this.x *= value;
      this.y *= value;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  distance(src) {
    const dx = src.x - this.x;
    const dy = src.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  distanceSq(src) {
    const dx = src.x - this.x;
    const dy = src.y - this.y;
    return dx * dx + dy * dy;
  }
  length() {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x * x + y * y);
  }
  setLength(length) {
    return this.normalize().scale(length);
  }
  lengthSq() {
    const x = this.x;
    const y = this.y;
    return x * x + y * y;
  }
  normalize() {
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
  normalizeRightHand() {
    const x = this.x;
    this.x = this.y * -1;
    this.y = x;
    return this;
  }
  normalizeLeftHand() {
    const x = this.x;
    this.x = this.y;
    this.y = x * -1;
    return this;
  }
  dot(src) {
    return this.x * src.x + this.y * src.y;
  }
  cross(src) {
    return this.x * src.y - this.y * src.x;
  }
  lerp(src, t = 0) {
    const ax = this.x;
    const ay = this.y;
    this.x = ax + t * (src.x - ax);
    this.y = ay + t * (src.y - ay);
    return this;
  }
  reset() {
    this.x = 0;
    this.y = 0;
    return this;
  }
  limit(max) {
    const len = this.length();
    if (len && len > max) {
      this.scale(max / len);
    }
    return this;
  }
  reflect(normal) {
    normal = Vector2.fromVector(normal).normalize();
    return this.subtract(normal.scale(2 * this.dot(normal)));
  }
  mirror(axis) {
    return this.reflect(axis).negate();
  }
  rotate(delta) {
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);
    return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }
  toPolar() {
    return {
      p: Math.sqrt(this.x * this.x + this.y * this.y),
      q: Math.atan2(this.y, this.x)
    };
  }
}
