"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = (function () {
    function Scene(config) {
        if (config === void 0) { config = {}; }
        this.game = config.game || null;
        this.cameras = config.cameras || [];
        for (var _i = 0, _a = this.cameras; _i < _a.length; _i++) {
            var camera = _a[_i];
            camera.scene = this;
        }
        this.objects = config.objects || [];
        for (var _b = 0, _c = this.objects; _b < _c.length; _b++) {
            var obj = _c[_b];
            obj.scene = this;
        }
        this.updateList = [];
        this.createTime = Date.now();
        this.lastTimePaused = this.createTime;
        this.time = 0;
        this.timeTick = 0;
        this._paused = config.paused || false;
        this.update = config.update || function () { };
    }
    Scene.prototype.createCamera = function (camera) {
        camera.scene = this;
        this.cameras.push(camera);
        return camera;
    };
    Scene.prototype.createEntity = function (entity) {
        entity.scene = this;
        this.objects.push(entity);
        return entity;
    };
    Scene.prototype.createUpdateList = function () {
        this.updateList = [];
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.active) {
                this.updateList.push(obj);
            }
        }
        for (var _b = 0, _c = this.cameras; _b < _c.length; _b++) {
            var camera = _c[_b];
            if (camera.active) {
                this.updateList.push(camera);
            }
        }
        return this;
    };
    Object.defineProperty(Scene.prototype, "paused", {
        get: function () {
            return this._paused;
        },
        set: function (value) {
            if (value) {
                this.lastTimePaused = Date.now();
            }
            this._paused = value;
        },
        enumerable: false,
        configurable: true
    });
    return Scene;
}());
exports.default = Scene;
