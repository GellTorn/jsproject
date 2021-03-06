import Drawable from "../interfaces/Drawable";
import Updatable from "../interfaces/Updatable";
import Scene from "../Scene";
import Vector2 from "../Vector2";
import Camera from "./Camera";
import Rectangle from "./Rectangle";

export default class Entity implements Drawable, Updatable {
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
  public _body: Rectangle | null;
  /** флаг на удаление */
  public delete: boolean;
  /** имя объекта */
  public name: string;
  /** объект для пользовательских переменных */
  public data;
  /** метод обновления объекта */
  public update;
  /** родительский объект */
  public parent: Entity | null;

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

    this._body = config.body || null;

    this.delete = false;

    this.name = config.name || null;

    this.data = config.data || {};

    this.update = config.update || function () { };

    this.parent = config.parent || null;
  }

  get body(): Rectangle | null {
    return this._body;
  }

  set body(newBody: Rectangle | null) {
    newBody.parent = this;
    this._body = newBody;
  }

  get calculatedPosition(): Vector2 {
    return new Vector2(this.position.x + this.parent.position.x, this.position.y + this.parent.position.y);
  }

  get calculatedAngle(): number {
    return this.angle + this.parent.angle;
  }

  set angle(value: number) {
    const max = Math.PI * 2;
    if (value > max) {
      value -= max;
    }
    else if (value < -max) {
      value += max;
    }
    this._angle = Math.round(value * 1000) / 1000;
  }

  get angle(): number {
    return this._angle;
  }

  // функции для создания: draw, update, offscreen
  draw(ctx: CanvasRenderingContext2D): void {

  }

  offscreen(camera: Camera): boolean {
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
