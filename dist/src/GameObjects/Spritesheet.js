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
import Vector2 from '../Vector2';
var Spritesheet = (function (_super) {
    __extends(Spritesheet, _super);
    function Spritesheet(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.imageId = config.imageId || '';
        _this.image = _this.scene.game.getResource(_this.imageId);
        _this.spriteSize = config.spriteSize || new Vector2();
        _this.name = _this.name || 'Spritesheet';
        if (_this.size.x === 0 && _this.size.y === 0) {
            _this.size.x = _this.image.width;
            _this.size.y = _this.image.height;
        }
        return _this;
    }
    Spritesheet.prototype.getImage = function (id) {
    };
    Spritesheet.prototype.draw = function (ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    };
    return Spritesheet;
}(Rectangle));
export default Spritesheet;
;
