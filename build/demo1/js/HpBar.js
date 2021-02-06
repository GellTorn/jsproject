import Entity from "../../src/GameObjects/Entity.js";
import Vector2 from "../../src/Vector2.js";
export default class HpBar extends Entity {
  constructor(config = {}) {
    super(config);
    this.name = "HP bar";
    this.parentEntity = config.parentEntity || null;
    this.offset = config.offset || new Vector2(0, -50);
    this.size = config.size || new Vector2(100, 10);
    this.color = config.color || "red";
  }
  draw(ctx) {
    if (this.parentEntity.data.hp === this.parentEntity.data.maxHp || this.parentEntity.data.hp <= 0) {
      return;
    }
    const x = this.parentEntity.position.x - this.size.x / 2;
    const y = this.parentEntity.position.y + this.offset.y;
    ctx.fillStyle = "#000";
    ctx.fillRect(x, y, this.size.x, this.size.y);
    ctx.fillStyle = this.color;
    const width = this.parentEntity.data.hp * this.size.x / this.parentEntity.data.maxHp;
    ctx.fillRect(x, y, width, this.size.y);
  }
}
