import Rectangle from "./Rectangle.js";
export default class Sprite extends Rectangle {
  constructor(config = {}) {
    super(config);
    this.imageId = config.imageId || "";
    this.image = this.scene.game.getResource(this.imageId);
    this.name = this.name || "Sprite";
    if (this.size.x === 0 && this.size.y === 0) {
      this.size.x = this.image.width;
      this.size.y = this.image.height;
    }
  }
  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
  }
  setImage(imageId) {
    this.imageId = imageId;
    this.image = this.scene.game.getResource(imageId);
    return this;
  }
}
;
