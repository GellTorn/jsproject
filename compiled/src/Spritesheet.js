"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
const Vector2_1 = __importDefault(require("./Vector2"));
class Spritesheet extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.imageId = config.imageId || '';
        this.image = this.scene.game.getResource(this.imageId);
        this.spriteSize = config.spriteSize || new Vector2_1.default();
        this.name = this.name || 'Spritesheet';
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
exports.default = Spritesheet;
;
