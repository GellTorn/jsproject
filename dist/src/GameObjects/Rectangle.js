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
import Entity from './Entity';
import Vector2 from '../Vector2';
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.size = config.size || new Vector2(0, 0);
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
    Rectangle.prototype.area = function (rect) {
        return rect.size.x * rect.size.y;
    };
    Rectangle.intersectPointWithAngle = function (rect, entity) {
        var hw = rect.size.x / 2;
        var hh = rect.size.y / 2;
        var dist = rect.position.distance(entity.position);
        var res = {
            x: Math.cos(rect.angle) * dist,
            y: Math.sin(rect.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    };
    Rectangle.intersectPointWithoutAngle = function (rect, point) {
        if (Math.abs(rect.position.x - point.x) > rect.size.x / 2)
            return false;
        if (Math.abs(rect.position.y - point.y) > rect.size.y / 2)
            return false;
        return true;
    };
    Rectangle.intersectAABB = function (rect1, rect2) {
        if (Math.abs(rect1.position.x - rect2.position.x) > rect1.size.x / 2 + rect2.size.x / 2)
            return false;
        if (Math.abs(rect1.position.y - rect2.position.y) > rect1.size.y / 2 + rect2.size.y / 2)
            return false;
        return true;
    };
    return Rectangle;
}(Entity));
export default Rectangle;
;
