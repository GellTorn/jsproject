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
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.color = config.color || '#000';
        _this.drawingType = config.drawingType || 'stroke';
        _this.name = _this.name || 'Text';
        _this.text = config.text || '';
        _this.font = config.font || _this.size.y + "px sans-serif";
        return _this;
    }
    Text.prototype.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.textAlign = 'left';
        ctx.font = this.font;
        var w = ctx.measureText(this.text).width;
        if (this.drawingType === 'fill') {
            ctx.fillText(this.text, -w / 2, this.size.y / 2);
        }
        else {
            ctx.strokeText(this.text, -w / 2, this.size.y / 2);
        }
        ctx.restore();
    };
    return Text;
}(Rectangle));
export default Text;
;
