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

    this.size = config.size || new Vector2();

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

  intersectPoint(point) {
    const hw = this.size.x / 2;
    const hh = this.size.y / 2;

    const dist = this.distance(point);

    const res = {
      x: Math.cos(this.angle) * dist,
      y: Math.sin(this.angle) * dist,
    };

    if (res.x > hw || res.x < -hw ||
      res.y > hh || res.y < -hh) {
      return false;
    }
    return true;
  }

  intersectAABB(rect) {
    if (Math.abs(this.position.x - rect.position.x) > this.size.x / 2 + rect.size.x / 2)
      return false;
    if (Math.abs(this.position.y - rect.position.y) > this.size.y / 2 + rect.size.y / 2)
      return false;
    return true;
  }
};
