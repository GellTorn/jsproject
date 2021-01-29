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
import Sprite from "../../../src/GameObjects/Sprite";
import Vector2 from "../../../src/Vector2";
import HpBar from "./HpBar";
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.update = function (time, ticks) {
            if (_this.data.hp <= 0) {
                _this.delete = true;
            }
        };
        _this.size = new Vector2(100, 100);
        _this.active = true;
        _this.data = {
            hp: 5,
            maxHp: 5,
        };
        _this.hpBar = _this.scene.createEntity(new HpBar({
            parentEntity: _this,
        }));
        return _this;
    }
    return Box;
}(Sprite));
export default Box;
