"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle_1 = __importDefault(require("./Rectangle"));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.imageId = config.imageId || '';
        _this.image = _this.scene.game.getResource(_this.imageId);
        _this.name = _this.name || 'Sprite';
        return _this;
    }
    Sprite.prototype.draw = function (ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    };
    return Sprite;
}(Rectangle_1.default));
exports.default = Sprite;
;
