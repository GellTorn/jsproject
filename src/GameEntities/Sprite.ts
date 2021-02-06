import Rectangle from './Rectangle';

export default class Sprite extends Rectangle {
  /** Имя объекта */
  public name: string;

  public imageId: string;

  public image: HTMLImageElement;

  constructor(config: any = {}) {
    super(config);

    this.imageId = config.imageId || '';

    this.image = this.scene.game.getResource(this.imageId);

    this.name = this.name || 'Sprite';
    /** назначаем размеры спрайта равные размеру изображения, если размеры не заданны */
    if(this.size.x === 0 && this.size.y === 0) {
      this.size.x = this.image.width;
      this.size.y = this.image.height;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
  }

  setImage(imageId: string): Sprite {
    this.imageId = imageId;
    this.image = this.scene.game.getResource(imageId);
    return this;
  }
}
