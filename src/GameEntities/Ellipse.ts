import Rectangle from './Rectangle';

export default class Ellipse extends Rectangle {
  /** тип рисования (fill/stroke) */
  public drawingType: string;
  /** Имя объекта */
  public name: string;
  /** любой объект цвета или текстуры */
  public color: string;

  constructor(config: any = {}) {
    super(config);

    this.drawingType = config.drawingType || 'fill';

    this.name = this.name || 'Ellipse';

    this.color = config.color || '#000';
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.size.x / 2, this.size.y / 2, 0, 0, Math.PI * 2);
    if (this.drawingType === 'fill') {
      ctx.fill();
    }
    else {
      ctx.stroke();
    }
    ctx.restore();
  }
  /** Returns the minor radius of the ellipse. Also known as the Semi Minor Axis. */
  getMinorRadius(): number {
    return Math.min(this.size.x, this.size.y) / 2;
  }
  /** Returns the major radius of the ellipse. Also known as the Semi Major Axis. */
  getMajorRadius(): number {
    return Math.max(this.size.x, this.size.y) / 2;
  }
  /** Checks to see if the Ellipse is empty: has a width or height equal to zero. */
  isEmpty(): boolean {
    return (this.size.x <= 0 || this.size.y <= 0);
  }
  /** Calculates the area of the Ellipse. */
  area(): number {
    if (this.isEmpty()) {
        return 0;
    }

    return (this.getMajorRadius() * this.getMinorRadius() * Math.PI);
  }
}
