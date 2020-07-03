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

  draw(ctx) {
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
};
