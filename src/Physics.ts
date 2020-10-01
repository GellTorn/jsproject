import Game from './Game';
import Entity from './Entity';
import Circle from './Circle';
import Vector2 from './Vector2';

export default class Physics {
  /** ссылка на объект игры */
  public game: Game;
  /** массив объектов коллизий, проверяются в каждом обновлении физики */
  public collisions;
  /** Вектор гравитации */
  public gravity: Vector2 = new Vector2(0, 0);

  constructor(config: any = {}) {
    this.game = config.game || null;

    /** массив объектов коллизий, проверяются в каждом обновлении физики */
    this.collisions = [];
  }

  setCollision(bodyA: Entity, bodyB: Entity, callback) {
    const collision = {
      bodyA,
      bodyB,
      callback
    };
    this.collisions.push(collision);
    return collision;
  }

  checkCollision(collision) {
    if(collision.bodyA instanceof Circle && collision.bodyB instanceof Circle) {
      if(collision.bodyA.intersectCircle(collision.bodyB)){
        collision.callback();
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
    for (let collision of this.collisions) {
      this.checkCollision(collision);
    }
  }
}