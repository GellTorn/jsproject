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
import Rectangle from "./GameObjects/Rectangle";
import Vector2 from "./Vector2";
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.name = _this.name || 'Camera';
        if (config.ctx) {
            _this.ctx = config.ctx;
        }
        else {
            _this.image = document.createElement('canvas');
            _this.image.width = _this.size.x;
            _this.image.height = _this.size.y;
            _this.ctx = _this.image.getContext('2d');
        }
        _this.follow = config.follow || null;
        _this.zoom = config.zoom || 1;
        _this.displayList = [];
        return _this;
    }
    Camera.prototype.getMouseCoordinates = function () {
        return new Vector2((this.scene.game.mouse.x + this.position.x - this.size.x / 2), (this.scene.game.mouse.y + this.position.y - this.size.y / 2));
    };
    Camera.prototype.render = function () {
        if (this.follow) {
            this.position.x = this.follow.position.x;
            this.position.y = this.follow.position.y;
        }
        this.displayList = [];
        for (var _i = 0, _a = this.scene.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (!obj.isDraw) {
                continue;
            }
            if (!obj.body)
                obj.body = new Rectangle();
            obj.body.position = obj.position;
            if (Rectangle.intersectAABB(this, obj.body)) {
                this.displayList.push(obj);
            }
        }
        for (var _b = 0, _c = this.displayList; _b < _c.length; _b++) {
            var obj = _c[_b];
            var x = obj.position.x;
            var y = obj.position.y;
            var ang = obj.angle;
            var z = this.zoom;
            this.ctx.save();
            this.ctx.translate(this.size.x / 2, this.size.y / 2);
            this.ctx.rotate(-this.angle);
            this.ctx.scale(z, z);
            this.ctx.translate(x - this.position.x, y - this.position.y);
            this.ctx.rotate(ang);
            obj.draw(this.ctx);
            if (this.scene.game.debug) {
                this.ctx.strokeStyle = 'red';
                this.ctx.beginPath();
                this.ctx.moveTo(-15, 0);
                this.ctx.lineTo(25, 0);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(0, -15);
                this.ctx.lineTo(0, 15);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
    };
    return Camera;
}(Rectangle));
export default Camera;
