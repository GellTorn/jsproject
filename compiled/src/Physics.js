"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Circle_1 = __importDefault(require("./Circle"));
const Vector2_1 = __importDefault(require("./Vector2"));
class Physics {
    constructor(config = {}) {
        this.gravity = new Vector2_1.default(0, 0);
        this.game = config.game || null;
        this.collisions = [];
    }
    setCollision(bodyA, bodyB, callback) {
        const collision = {
            bodyA,
            bodyB,
            callback
        };
        this.collisions.push(collision);
        return collision;
    }
    checkCollision(collision) {
        if (collision.bodyA instanceof Circle_1.default && collision.bodyB instanceof Circle_1.default) {
            if (collision.bodyA.intersectCircle(collision.bodyB)) {
                collision.callback();
                return;
            }
        }
    }
    update(time, ticks) {
        for (let obj of this.game.scene.objects) {
            if (!obj.physics) {
                continue;
            }
            let friction = 0.95;
            obj.velocity.x *= friction;
            obj.velocity.y *= friction;
            obj.velocity.x += obj.acceleration.x;
            obj.velocity.y += obj.acceleration.y;
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
            obj.acceleration.x = 0;
            obj.acceleration.y = 0;
        }
        this.collisions = this.collisions.filter((collision) => {
            if (collision.bodyA.delete || collision.bodyB.delete) {
                return false;
            }
            return true;
        });
        for (let collision of this.collisions) {
            this.checkCollision(collision);
        }
    }
}
exports.default = Physics;
