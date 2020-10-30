import Circle from './GameObjects/Circle';
import Rectangle from './GameObjects/Rectangle';
import Vector2 from './Vector2';
var Physics = (function () {
    function Physics(config) {
        if (config === void 0) { config = {}; }
        this.gravity = new Vector2(0, 0);
        this.game = config.game || null;
        this.collisions = [];
    }
    Physics.prototype.setCollision = function (bodyA, bodyB, callback) {
        var collision = {
            bodyA: bodyA,
            bodyB: bodyB,
            callback: callback
        };
        this.collisions.push(collision);
        return collision;
    };
    Physics.prototype.checkCollision = function (collision) {
        if (collision.bodyA instanceof Circle && collision.bodyB instanceof Circle) {
            if (collision.bodyA.intersectCircle(collision.bodyB)) {
                collision.callback();
                return;
            }
        }
        if (collision.bodyA instanceof Rectangle && collision.bodyB instanceof Rectangle) {
            if (Rectangle.intersectAABB(collision.bodyB, collision.bodyB)) {
                collision.callback();
                return;
            }
        }
        if (collision.bodyA instanceof Rectangle && collision.bodyB) {
            if (Rectangle.intersectPointWithoutAngle(collision.bodyA, collision.bodyB.position)) {
                collision.callback();
                return;
            }
        }
        if (collision.bodyA && collision.bodyB instanceof Rectangle) {
            if (Rectangle.intersectPointWithoutAngle(collision.bodyB, collision.bodyA.position)) {
                collision.callback();
                return;
            }
        }
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
        this.collisions = this.collisions.filter(function (collision) {
            if (collision.bodyA.delete || collision.bodyB.delete) {
                return false;
            }
            return true;
        });
        for (var _b = 0, _c = this.collisions; _b < _c.length; _b++) {
            var collision = _c[_b];
            this.checkCollision(collision);
        }
    };
    return Physics;
}());
export default Physics;
