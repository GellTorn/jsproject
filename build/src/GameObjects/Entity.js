import Vector2 from "../Vector2.js";
export default class Entity {
  constructor(config = {}) {
    this.scene = config.scene || null;
    this.position = config.position || new Vector2();
    this.velocity = config.velocity || new Vector2();
    this.acceleration = config.acceleration || new Vector2();
    this.mass = config.mass || 1;
    this.active = config.active || false;
    this.physics = config.physics || false;
    this.isDraw = config.isDraw || true;
    this._angle = config.angle || 0;
    this._body = config.body || null;
    this.delete = false;
    this.name = config.name || null;
    this.data = config.data || {};
    this.update = config.update || function() {
    };
    this.parent = config.parent || null;
  }
  get body() {
    return this._body;
  }
  set body(newBody) {
    newBody.parent = this;
    this._body = newBody;
  }
  get calculatedPosition() {
    return new Vector2(this.position.x + this.parent.position.x, this.position.y + this.parent.position.y);
  }
  get calculatedAngle() {
    return this.angle + this.parent.angle;
  }
  set angle(value) {
    const max = Math.PI * 2;
    if (value > max) {
      value -= max;
    } else if (value < -max) {
      value += max;
    }
    this._angle = Math.round(value * 1e3) / 1e3;
  }
  get angle() {
    return this._angle;
  }
  draw(ctx) {
  }
  offscreen(camera) {
    if (this.position.distance(camera.position) > 2e3) {
      return false;
    }
    return true;
  }
  applyForce(x, y) {
    this.acceleration.x += x / this.mass;
    this.acceleration.y += y / this.mass;
    return this;
  }
}
