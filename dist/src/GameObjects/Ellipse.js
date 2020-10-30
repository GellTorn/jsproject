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
import Rectangle from './Rectangle';
var Ellipse = (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.drawingType = config.drawingType || 'fill';
        _this.name = _this.name || 'Ellipse';
        _this.color = config.color || '#000';
        return _this;
    }
    Ellipse.prototype.draw = function (ctx) {
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
    };
    Ellipse.prototype.getMinorRadius = function () {
        return Math.min(this.size.x, this.size.y) / 2;
    };
    Ellipse.prototype.getMajorRadius = function () {
        return Math.max(this.size.x, this.size.y) / 2;
    };
    Ellipse.prototype.isEmpty = function () {
        return (this.size.x <= 0 || this.size.y <= 0);
    };
    Ellipse.prototype.area = function () {
        if (this.isEmpty()) {
            return 0;
        }
        return (this.getMajorRadius() * this.getMinorRadius() * Math.PI);
    };
    return Ellipse;
}(Rectangle));
export default Ellipse;
;