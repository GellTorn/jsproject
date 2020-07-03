import Game from './Game';

export default class Physics {
  /** ссылка на объект игры */
  public game: Game;
  /** массив объектов коллизий, проверяются в каждом обновлении физики */
  public collisions;

  constructor(config: any = {}) {
    this.game = config.game || null;

    /** массив объектов коллизий, проверяются в каждом обновлении физики */
    this.collisions = [];
  }

  setCollision(obj1, obj2, callback) {
    const collision = {
      obj1,
      obj2,
      callback
    };
    this.collisions.push(collision);
    return collision;
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
  }
}