import Vector2 from "./Vector2";
var Entity = (function () {
    function Entity(config) {
        if (config === void 0) { config = {}; }
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
        this.update = config.update || function () { };
        this.parent = config.parent || null;
    }
    Object.defineProperty(Entity.prototype, "body", {
        get: function () {
            return this._body;
        },
        set: function (newBody) {
            newBody.parent = this;
            this._body = newBody;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "calculatedPosition", {
        get: function () {
            return new Vector2(this.position.x + this.parent.position.x, this.position.y + this.parent.position.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "calculatedAngle", {
        get: function () {
            return this.angle + this.parent.angle;
        },
        enumerable: false,
        configurable: true
    });
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
        if (this.position.distance(camera.position) > 2000) {
            return false;
        }
        return true;
    };
    Entity.prototype.applyForce = function (x, y) {
        this.acceleration.x += x / this.mass;
        this.acceleration.y += y / this.mass;
        return this;
    };
    return Entity;
}());
export default Entity;
