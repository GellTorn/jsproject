"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __importDefault(require("./Vector2"));
class Entity {
    constructor(config = {}) {
        this.scene = config.scene || null;
        this.position = config.position || new Vector2_1.default();
        this.velocity = config.velocity || new Vector2_1.default();
        this.acceleration = config.acceleration || new Vector2_1.default();
        this.mass = config.mass || 1;
        this.active = config.active || false;
        this.physics = config.physics || false;
        this.isDraw = config.isDraw || true;
        this._angle = config.angle || 0;
        this._body = config.body || null;
        this.delete = false;
        this.name = config.name || null;
        this.data = config.data || {};
        this.update = config.update || function () { };
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
        return new Vector2_1.default(this.position.x + this.parent.position.x, this.position.y + this.parent.position.y);
    }
    get calculatedAngle() {
        return this.angle + this.parent.angle;
    }
    set angle(value) {
        const max = Math.PI * 2;
        if (value > max) {
            value -= max;
        }
        else if (value < -max) {
            value += max;
        }
        this._angle = Math.round(value * 1000) / 1000;
    }
    get angle() {
        return this._angle;
    }
    draw(ctx) {
    }
    offscreen(camera) {
        if (this.position.distance(camera.position) > 2000) {
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
exports.default = Entity;
