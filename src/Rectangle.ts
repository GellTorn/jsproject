import Entity from './Entity';
import Vector2 from './Vector2';

export default class Rectangle extends Entity {
  /** размеры */
  public size: Vector2;
  /** тип рисования (fill/stroke) */
  public drawingType: string;
  /** Имя объекта */
  public name: string;
  /** любой объект цвета или текстуры */
  public color: string;

  constructor(config: any = {}) {
    super(config);

    this.size = config.size || new Vector2(0, 0);

    this.drawingType = config.drawingType || 'fill';

    this.name = this.name || 'Rectangle';

    this.color = config.color || '#000';
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    if (this.drawingType === 'fill') {
      ctx.fill();
    }
    else {
      ctx.stroke();
    }
    ctx.restore();
  }

  area(rect: Rectangle): number {
    return rect.size.x * rect.size.y;
  }

  static intersectPointWithAngle(rect: Rectangle, entity: Entity): boolean {
    const hw = rect.size.x / 2;
    const hh = rect.size.y / 2;

    const dist = rect.position.distance(entity.position);

    const res = {
      x: Math.cos(rect.angle) * dist,
      y: Math.sin(rect.angle) * dist,
    };

    if (res.x > hw || res.x < -hw ||
      res.y > hh || res.y < -hh) {
      return false;
    }
    return true;
  }

  static intersectPointWithoutAngle(rect: Rectangle, point: Vector2): boolean {
    if (Math.abs(rect.position.x - point.x) > rect.size.x / 2)
      return false;
    if (Math.abs(rect.position.y - point.y) > rect.size.y / 2)
      return false;
    return true;
  }

  static intersectAABB(rect1: Rectangle, rect2: Rectangle) {
    if (Math.abs(rect1.position.x - rect2.position.x) > rect1.size.x / 2 + rect2.size.x / 2)
      return false;
    if (Math.abs(rect1.position.y - rect2.position.y) > rect1.size.y / 2 + rect2.size.y / 2)
      return false;
    return true;
  }
};
