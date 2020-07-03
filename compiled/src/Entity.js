"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2_1 = __importDefault(require("./Vector2"));
var Entity = (function () {
    function Entity(config) {
        if (config === void 0) { config = {}; }
        this.scene = config.scene || null;
        this.position = config.position || new Vector2_1.default();
        this.velocity = config.velocity || new Vector2_1.default();
        this.acceleration = config.acceleration || new Vector2_1.default();
        this.mass = config.mass || 1;
        this.active = config.active || false;
        this.physics = config.physics || false;
        this._angle = config.angle || 0;
        this.delete = false;
        this.name = config.name || null;
        this.data = config.data || {};
        this.update = config.update || function () { };
    }
    Object.defineProperty(Entity.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            var max = Math.PI * 2;
            if (value > max) {
                value -= max;
            }
            else if (value < -max) {
                value += max;
            }
            this._angle = Math.round(value * 1000) / 1000;
        },
        enumerable: false,
        configurable: true
    });
    Entity.prototype.draw = function (ctx) {
    };
    Entity.prototype.offscreen = function (camera) {
        if (this.distance(camera.position) > 2000) {
            return false;
        }
        return true;
    };
    Entity.prototype.distance = function (position) {
        var dx = this.position.x - position.x;
        var dy = this.position.y - position.y;
        var res = Math.sqrt(dx * dx + dy * dy);
        return res;
    };
    Entity.prototype.applyForce = function (x, y) {
        this.acceleration.x += x / this.mass;
        this.acceleration.y += y / this.mass;
        return this;
    };
    return Entity;
}());
exports.default = Entity;
