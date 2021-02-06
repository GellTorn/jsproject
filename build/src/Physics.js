import Circle from "./GameObjects/Circle.js";
import Rectangle from "./GameObjects/Rectangle.js";
import Vector2 from "./Vector2.js";
export default class Physics {
  constructor(config = {}) {
    this.gravity = new Vector2(0, 0);
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
