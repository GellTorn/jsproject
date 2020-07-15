import Entity from './Entity';
import Vector2 from './Vector2';

export default class Circle extends Entity {
  /** радиус круга */
  public radius: number;
  /** тип рисования (fill/stroke) */
  public drawingType: string;
  /** Имя объекта */
  public name: string;
  /** любой объект цвета или текстуры */
  public color: string;

  constructor(config: any = {}) {
    super(config);

    this.radius = config.radius || 0;

    this.drawingType = config.drawingType || 'stroke';

    this.name = this.name || 'Circle';

    this.color = config.color || '#000';
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    if (this.drawingType === 'fill') {
      ctx.fill();
    }
    else {
      ctx.stroke();
    }
    ctx.restore();
  }

  area(): number {
    return (this.radius > 0) ? Math.PI * this.radius * this.radius : 0;
  }

  intersectCircle(circle: Circle): boolean {
    return this.position.distance(circle.position) < this.radius + circle.radius;
  }

  intersectPoint(point: Vector2): boolean {
    return this.position.distance(point) < this.radius;
  }
};
