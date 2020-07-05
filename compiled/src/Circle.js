"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
class Circle extends Entity_1.default {
    constructor(config = {}) {
        super(config);
        this.radius = config.radius || 0;
        this.drawingType = config.drawingType || 'stroke';
        this.name = this.name || 'Circle';
        this.color = config.color || '#000';
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        if (this.drawingType === 'fill') {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
        ctx.restore();
    }
    intersectCircle(circle) {
        return this.distance(circle) < this.radius + circle.radius;
    }
    intersectPoint(point) {
        return this.distance(point) < this.radius;
    }
}
exports.default = Circle;
;
