"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scene {
    constructor(config = {}) {
        this.game = config.game || null;
        this.cameras = config.cameras || [];
        for (let camera of this.cameras) {
            camera.scene = this;
        }
        this.objects = config.objects || [];
        for (let obj of this.objects) {
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
    createCamera(camera) {
        camera.scene = this;
        this.cameras.push(camera);
        return camera;
    }
    createEntity(entity) {
        entity.scene = this;
        this.objects.push(entity);
        return entity;
    }
    createUpdateList() {
        this.updateList = [];
        for (let obj of this.objects) {
            if (obj.active) {
                this.updateList.push(obj);
            }
        }
        for (let camera of this.cameras) {
            if (camera.active) {
                this.updateList.push(camera);
            }
        }
        return this;
    }
    set paused(value) {
        if (value) {
            this.lastTimePaused = Date.now();
        }
        this._paused = value;
    }
    get paused() {
        return this._paused;
    }
}
exports.default = Scene;
