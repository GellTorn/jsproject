"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Ellipse extends Rectangle_1.default {
    constructor(config = {}) {
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
}
exports.default = Ellipse;
;
