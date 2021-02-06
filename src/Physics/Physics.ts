import Game from '../Game';
import Entity from '../GameEntities/Entity';
import Circle from '../GameEntities/Circle';
import Rectangle from '../GameEntities/Rectangle';
import Vector2 from '../Vector2';
import Collision from './Collision';

export default class Physics {
  /** ссылка на объект игры */
  public game: Game;
  /** массив объектов коллизий, проверяются в каждом обновлении физики */
  public collisions: Collision[];
  /** Вектор гравитации */
  public gravity: Vector2 = new Vector2(0, 0);

  constructor(config: any = {}) {
    this.game = config.game || null;

    /** массив объектов коллизий, проверяются в каждом обновлении физики */
    this.collisions = [];
  }

  setCollision(bodyA: Entity, bodyB: Entity, callback: () => void): Collision {
    const collision = {
      bodyA,
      bodyB,
      callback
    };
    this.collisions.push(collision);
    return collision;
  }

  checkCollision(collision: Collision): void {
    // Circle x Circle
    if(collision.bodyA instanceof Circle && collision.bodyB instanceof Circle) {
      if(collision.bodyA.intersectCircle(collision.bodyB)){
        collision.callback();
        return;
      }
    }
    // Rectangle x Rectangle
    if(collision.bodyA instanceof Rectangle && collision.bodyB instanceof Rectangle) {
      if(Rectangle.intersectAABB(collision.bodyB, collision.bodyB)){
        collision.callback();
        return;
      }
    }
    // Rectangle x Point
    if(collision.bodyA instanceof Rectangle && collision.bodyB) {
      if(Rectangle.intersectPointWithoutAngle(collision.bodyA, collision.bodyB.position)){
        collision.callback();
        return;
      }
    }
    // Point x Rectangle
    if(collision.bodyA && collision.bodyB instanceof Rectangle) {
      if(Rectangle.intersectPointWithoutAngle(collision.bodyB, collision.bodyA.position)){
        collision.callback();
        return;
      }
    }
  }

  update(time: number, ticks: number): void {
    for (const obj of this.game.scene.objects) {
      if (!obj.physics) {
        continue;
      }

      const friction = 0.95;

      obj.velocity.x *= friction;
      obj.velocity.y *= friction;

      obj.velocity.x += obj.acceleration.x;
      obj.velocity.y += obj.acceleration.y;

      obj.position.x += obj.velocity.x;
      obj.position.y += obj.velocity.y;

      obj.acceleration.x = 0;
      obj.acceleration.y = 0;
    }

    this.collisions = this.collisions.filter((collision: Collision) => {
      if(collision.bodyA.delete || collision.bodyB.delete) {
        return false;
      }
      return true;
    });

    for (const collision of this.collisions) {
      this.checkCollision(collision);
    }
  }
}