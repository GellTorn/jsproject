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
        this.size = config.size || new Vector2_1.default(0, 0);
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
    static intersectPointWithAngle(rect, entity) {
        const hw = rect.size.x / 2;
        const hh = rect.size.y / 2;
        const dist = rect.position.distance(entity.position);
        const res = {
            x: Math.cos(rect.angle) * dist,
            y: Math.sin(rect.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    }
    static intersectPointWithoutAngle(rect, point) {
        if (Math.abs(rect.position.x - point.x) > rect.size.x / 2)
            return false;
        if (Math.abs(rect.position.y - point.y) > rect.size.y / 2)
            return false;
        return true;
    }
    static intersectAABB(rect1, rect2) {
        if (Math.abs(rect1.position.x - rect2.position.x) > rect1.size.x / 2 + rect2.size.x / 2)
            return false;
        if (Math.abs(rect1.position.y - rect2.position.y) > rect1.size.y / 2 + rect2.size.y / 2)
            return false;
        return true;
    }
}
exports.default = Rectangle;
;
