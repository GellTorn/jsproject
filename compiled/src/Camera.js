"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Camera extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.name = this.name || 'Camera';
        if (config.ctx) {
            this.ctx = config.ctx;
        }
        else {
            this.image = document.createElement('canvas');
            this.image.width = this.size.x;
            this.image.height = this.size.y;
            this.ctx = this.image.getContext('2d');
        }
        this.follow = config.follow || null;
        this.zoom = config.zoom || 1;
        this.displayList = [];
    }
    pointInRect(point, rect) {
        const hw = rect.size.x / 2;
        const hh = rect.size.y / 2;
        const cx = rect.position.x + hw;
        const cy = rect.position.y + hh;
        const dx = cx - point.x;
        const dy = cy - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
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
    getMouseCoordinates() {
        return {
            x: -(this.scene.game.mouse.x - this.position.x - this.size.x / 2),
            y: -(this.scene.game.mouse.y - this.position.y - this.size.y / 2),
        };
    }
    render() {
        if (this.follow) {
            this.position.x = this.follow.position.x;
            this.position.y = this.follow.position.y;
        }
        this.displayList = [];
        for (let obj of this.scene.objects) {
            if (obj.name === 'Camera') {
                continue;
            }
            if (obj.offscreen(this)) {
                this.displayList.push(obj);
            }
        }
        for (let obj of this.displayList) {
            let x = obj.position.x;
            let y = obj.position.y;
            let ang = obj.angle;
            let z = this.zoom;
            this.ctx.save();
            this.ctx.translate(this.size.x / 2, this.size.y / 2);
            this.ctx.rotate(-this.angle);
            this.ctx.scale(z, z);
            this.ctx.translate(x - this.position.x, y - this.position.y);
            this.ctx.rotate(ang);
            obj.draw(this.ctx);
            if (this.scene.game.debug) {
                this.ctx.strokeStyle = 'red';
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(50, 0);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
        if (this.scene.game.debug) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            this.ctx.fillRect(this.size.x / 2 - 1, this.size.y / 2 - 1, 2, 2);
            this.ctx.fillRect(2, this.size.y / 4, 2, this.size.y / 4 * 3);
        }
    }
}
exports.default = Camera;
