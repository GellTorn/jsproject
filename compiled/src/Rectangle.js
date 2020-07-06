"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
const Vector2_1 = __importDefault(require("./Vector2"));
class Rectangle extends Entity_1.default {
    constructor(config = {}) {
        super(config);
        this.size = config.size || new Vector2_1.default();
        this.drawingType = config.drawingType || 'fill';
        this.name = this.name || 'Rectangle';
        this.color = config.color || '#000';
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        if (this.drawingType === 'fill') {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
        ctx.restore();
    }
    area(rect) {
        return rect.size.x * rect.size.y;
    }
    intersectPoint(point) {
        const hw = this.size.x / 2;
        const hh = this.size.y / 2;
        const dist = this.position.distance(point);
        const res = {
            x: Math.cos(this.angle) * dist,
            y: Math.sin(this.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    }
    intersectAABB(rect) {
        if (Math.abs(this.position.x - rect.position.x) > this.size.x / 2 + rect.size.x / 2)
            return false;
        if (Math.abs(this.position.y - rect.position.y) > this.size.y / 2 + rect.size.y / 2)
            return false;
        return true;
    }
}
exports.default = Rectangle;
;
