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
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.radius = config.radius || 0;
        _this.drawingType = config.drawingType || 'stroke';
        _this.name = _this.name || 'Circle';
        _this.color = config.color || '#000';
        return _this;
    }
    Circle.prototype.draw = function (ctx) {
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
    };
    Circle.prototype.intersectCircle = function (circle) {
        return this.distance(circle) < this.radius + circle.radius;
    };
    Circle.prototype.intersectPoint = function (point) {
        return this.distance(point) < this.radius;
    };
    return Circle;
}(Entity_1.default));
exports.default = Circle;
;
