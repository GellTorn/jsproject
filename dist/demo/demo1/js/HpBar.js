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
import Entity from "../../../src/GameObjects/Entity";
import Vector2 from "../../../src/Vector2";
var HpBar = (function (_super) {
    __extends(HpBar, _super);
    function HpBar(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.name = 'HP bar';
        _this.parentEntity = config.parentEntity || null;
        _this.offset = config.offset || new Vector2(0, -50);
        _this.size = config.size || new Vector2(100, 10);
        _this.color = config.color || 'red';
        return _this;
    }
    HpBar.prototype.draw = function (ctx) {
        if (this.parentEntity.data.hp === this.parentEntity.data.maxHp || this.parentEntity.data.hp <= 0) {
            return;
        }
        var x = this.parentEntity.position.x - this.size.x / 2;
        var y = this.parentEntity.position.y + this.offset.y;
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, this.size.x, this.size.y);
        ctx.fillStyle = this.color;
        var width = this.parentEntity.data.hp * this.size.x / this.parentEntity.data.maxHp;
        ctx.fillRect(x, y, width, this.size.y);
    };
    return HpBar;
}(Entity));
export default HpBar;
