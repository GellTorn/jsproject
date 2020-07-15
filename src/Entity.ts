import Scene from "./Scene";
import Vector2 from "./Vector2";

export default class Entity {
  /** ссылка на сцену которой пренадлежит сущность */
  public scene: Scene;
  /** позиция */
  public position: Vector2;
  /** скорость */
  public velocity: Vector2;
  /** ускорение */
  public acceleration: Vector2;
  /** масса */
  public mass: number;
  /** флаг обновления */
  public active: boolean;
  /** флаг физики */
  public physics: boolean;
  /** флаг отрисовки */
  public isDraw: boolean;
  /** физическое тело сущности */
  public body: Entity | null;
  /** флаг на удаление */
  public delete: boolean;
  /** имя объекта */
  public name: string;
  /** объект для пользовательских переменных */
  public data;
  /** метод обновления объекта */
  public update;

  /** угол поворота */
  protected  _angle: number;

  constructor(config: any = {}) {

    this.scene = config.scene || null;

    this.position = config.position || new Vector2();

    this.velocity = config.velocity || new Vector2();
    
    this.acceleration = config.acceleration || new Vector2();

    this.mass = config.mass || 1;

    this.active = config.active || false;

    this.physics = config.physics || false;

    this.isDraw = config.isDraw || true;

    this._angle = config.angle || 0;

    this.body = config.body || null;

    this.delete = false;

    this.name = config.name || null;

    this.data = config.data || {};

    this.update = config.update || function () { };
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

  // функции для создания: draw, update, offscreen
  draw(ctx) {

  }

  offscreen(camera) {
    if (this.position.distance(camera.position) > 2000) {
      return false;
    }
    return true;
  }

  applyForce(x: number, y: number): Entity {
    this.acceleration.x += x / this.mass;
    this.acceleration.y += y / this.mass;

    return this;
  }
}
