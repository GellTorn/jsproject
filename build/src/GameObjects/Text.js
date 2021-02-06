import Rectangle from "./Rectangle.js";
export default class Text extends Rectangle {
  constructor(config = {}) {
    super(config);
    this.color = config.color || "#000";
    this.drawingType = config.drawingType || "stroke";
    this.name = this.name || "Text";
    this.text = config.text || "";
    this.font = config.font || `${this.size.y}px sans-serif`;
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.textAlign = "left";
    ctx.font = this.font;
    const w = ctx.measureText(this.text).width;
    if (this.drawingType === "fill") {
      ctx.fillText(this.text, -w / 2, this.size.y / 2);
    } else {
      ctx.strokeText(this.text, -w / 2, this.size.y / 2);
    }
    ctx.restore();
  }
}
;
