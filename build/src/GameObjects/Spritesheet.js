import Rectangle from "./Rectangle.js";
import Vector2 from "../Vector2.js";
export default class Spritesheet extends Rectangle {
  constructor(config = {}) {
    super(config);
    this.imageId = config.imageId || "";
    this.image = this.scene.game.getResource(this.imageId);
    this.spriteSize = config.spriteSize || new Vector2();
    this.name = this.name || "Spritesheet";
    if (this.size.x === 0 && this.size.y === 0) {
      this.size.x = this.image.width;
      this.size.y = this.image.height;
    }
  }
  getImage(id) {
  }
  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
  }
}
;
