"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Text extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.color = config.color || '#000';
        this.drawingType = config.drawingType || 'stroke';
        this.name = this.name || 'Text';
        this.text = config.text || '';
        this.font = config.font || `${this.size.y}px sans-serif`;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.textAlign = 'left';
        ctx.font = this.font;
        const w = ctx.measureText(this.text).width;
        if (this.drawingType === 'fill') {
            ctx.fillText(this.text, -w / 2, this.size.y / 2);
        }
        else {
            ctx.strokeText(this.text, -w / 2, this.size.y / 2);
        }
        ctx.restore();
    }
}
exports.default = Text;
;
