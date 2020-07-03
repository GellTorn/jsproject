import Rectangle from './Rectangle';

export default class Sprite extends Rectangle {
  /** Имя объекта */
  public name: string;

  public imageId: string;

  public image;

  constructor(config: any = {}) {
    super(config);

    this.imageId = config.imageId || '';

    this.image = this.scene.game.getResource(this.imageId);

    this.name = this.name || 'Sprite';
  }

  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
  }
};
