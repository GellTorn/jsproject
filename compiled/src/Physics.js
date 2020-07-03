"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Physics = (function () {
    function Physics(config) {
        if (config === void 0) { config = {}; }
        this.game = config.game || null;
        this.collisions = [];
    }
    Physics.prototype.setCollision = function (obj1, obj2, callback) {
        var collision = {
            obj1: obj1,
            obj2: obj2,
            callback: callback
        };
        this.collisions.push(collision);
        return collision;
    };
    Physics.prototype.update = function (time, ticks) {
        for (var _i = 0, _a = this.game.scene.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (!obj.physics) {
                continue;
            }
            var friction = 0.95;
            obj.velocity.x *= friction;
            obj.velocity.y *= friction;
            obj.velocity.x += obj.acceleration.x;
            obj.velocity.y += obj.acceleration.y;
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
            obj.acceleration.x = 0;
            obj.acceleration.y = 0;
        }
    };
    return Physics;
}());
exports.default = Physics;
