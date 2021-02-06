import Entity from "./Entity.js";
export default class Circle extends Entity {
  constructor(config = {}) {
    super(config);
    this.radius = config.radius || 0;
    this.drawingType = config.drawingType || "stroke";
    this.name = this.name || "Circle";
    this.color = config.color || "#000";
  }
  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    if (this.drawingType === "fill") {
      ctx.fill();
    } else {
      ctx.stroke();
    }
    ctx.restore();
  }
  area() {
    return this.radius > 0 ? Math.PI * this.radius * this.radius : 0;
  }
  intersectCircle(circle) {
    return this.position.distance(circle.position) < this.radius + circle.radius;
  }
  intersectPoint(point) {
    return this.position.distance(point) < this.radius;
  }
}
;
