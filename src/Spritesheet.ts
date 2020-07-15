import Rectangle from './Rectangle';
import Vector2 from './Vector2';

export default class Spritesheet extends Rectangle {
  /** Имя объекта */
  public name: string;

  public imageId: string;

  public image: HTMLImageElement;

  public spriteSize: Vector2;

  constructor(config: any = {}) {
    super(config);

    this.imageId = config.imageId || '';

    this.image = this.scene.game.getResource(this.imageId);

    this.spriteSize = config.spriteSize || new Vector2();

    this.name = this.name || 'Spritesheet';
    /** назначаем размеры спрайта равные размеру изображения, если размеры не заданны */
    if(this.size.x === 0 && this.size.y === 0) {
      this.size.x = this.image.width;
      this.size.y = this.image.height;
    }
  }

  getImage(id: number) {

  }

  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
  }
};
