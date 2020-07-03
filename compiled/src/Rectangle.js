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
var Entity_1 = __importDefault(require("./Entity"));
var Vector2_1 = __importDefault(require("./Vector2"));
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.size = config.size || new Vector2_1.default();
        _this.drawingType = config.drawingType || 'fill';
        _this.name = _this.name || 'Rectangle';
        _this.color = config.color || '#000';
        return _this;
    }
    Rectangle.prototype.draw = function (ctx) {
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
    };
    Rectangle.prototype.intersectPoint = function (point) {
        var hw = this.size.x / 2;
        var hh = this.size.y / 2;
        var dist = this.distance(point);
        var res = {
            x: Math.cos(this.angle) * dist,
            y: Math.sin(this.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    };
    Rectangle.prototype.intersectAABB = function (rect) {
        if (Math.abs(this.position.x - rect.position.x) > this.size.x / 2 + rect.size.x / 2)
            return false;
        if (Math.abs(this.position.y - rect.position.y) > this.size.y / 2 + rect.size.y / 2)
            return false;
        return true;
    };
    return Rectangle;
}(Entity_1.default));
exports.default = Rectangle;
;
