"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene_1 = __importDefault(require("./Scene"));
const Physics_1 = __importDefault(require("./Physics"));
class Game {
    constructor(config = {}) {
        this.canvas = config.canvas || null;
        this.version = '0.0.1';
        this.width = config.width || 600;
        this.height = config.height || 400;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d', {
            alpha: config.alpha
        });
        this.ctx.imageSmoothingEnabled = config.imageSmoothingEnabled || false;
        this.backgroudColor = config.backgroudColor || null;
        this.scenes = config.scenes || {};
        this.resources = {};
        this.preload = config.preload || function () { };
        this.create = config.create || function () { };
        this.scene = null;
        this.physics = config.physics || new Physics_1.default({
            game: this,
        });
        this.debug = config.debug || false;
        this.frameAmount = 0;
        this.fps = 0;
        this.mouse = {
            x: 0,
            y: 0,
        };
        this.events = [];
        this.mouseObjects = [];
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('contextmenu', this.onContextMenu.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this));
        this.preload();
        this._preloadDoneInterval = setInterval(this._preloadDone.bind(this), 100);
    }
    onMouseMove(event) {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
    }
    onMouseClick(event) {
        event.preventDefault();
    }
    onContextMenu(event) {
        event.preventDefault();
    }
    onMouseDown(event) {
        this.events.push('mouse' + event.button);
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        event.preventDefault();
    }
    onMouseUp(event) {
        const index = this.events.indexOf('mouse' + event.button);
        if (index == -1) {
            return;
        }
        this.events.splice(index, 1);
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        event.preventDefault();
    }
    onKeyDown(event) {
        if (event.repeat) {
            return;
        }
        this.events.push(event.code);
    }
    onKeyUp(event) {
        while (this.events.indexOf(event.code) != -1) {
            let index = this.events.indexOf(event.code);
            this.events.splice(index, 1);
        }
        event.preventDefault();
    }
    onWheel(event) {
        if (event.deltaY < 0) {
            this.events.push('up');
        }
        else if (event.deltaY > 0) {
            this.events.push('down');
        }
    }
    onFocus(event) {
        this.scene.paused = false;
    }
    onBlur(event) {
        this.scene.paused = true;
    }
    checkEventCode(event, events) {
    }
    setScene(sceneId) {
        this.scene = this.scenes[sceneId];
        return this;
    }
    createScene(sceneId, config = {}) {
        let scene = new Scene_1.default(config);
        scene.game = this;
        this.scenes[sceneId] = scene;
        return scene;
    }
    check() {
        this.fps = this.frameAmount;
        this.frameAmount = 0;
    }
    loadImage(resourceId, source) {
        let image = new Image();
        this.resources[resourceId] = {
            resource: image,
            loaded: false,
        };
        image.src = source;
        image.onload = () => {
            this.resources[resourceId].loaded = true;
        };
        image.onload.bind(this);
        return this;
    }
    loadVideo(resourceId, source) {
        let video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        this.resources[resourceId] = {
            resource: video,
            loaded: false,
        };
        video.src = source;
        video.onload = () => {
            this.resources[resourceId].loaded = true;
            video.play();
        };
        video.onload.bind(this);
        return this;
    }
    getResource(resourceId) {
        return this.resources[resourceId].resource;
    }
    _preloadDone() {
        for (let resource in this.resources) {
            if (!this.resources[resource].loaded) {
                console.log('not ready');
                return false;
            }
        }
        clearInterval(this._preloadDoneInterval);
        this.create();
        console.info(`Game engine v${this.version}`);
        window.requestAnimationFrame(this.update.bind(this));
        this._setFps = setInterval(this.check.bind(this), 1000);
    }
    update() {
        if (this.scene == null) {
            return;
        }
        if (!this.scene.paused) {
            this.scene.time = Date.now() - this.scene.lastTimePaused;
            this.scene.timeTick++;
            this.scene.objects = this.scene.objects.filter((obj) => {
                if (!obj.delete) {
                    return true;
                }
                return false;
            });
            this.scene.createUpdateList();
            this.physics.update(this.scene.time, this.scene.timeTick);
            for (let obj of this.scene.updateList) {
                obj.update(this.scene.time, this.scene.timeTick);
            }
            this.scene.update(this.scene.time, this.scene.timeTick);
        }
        if (!this.backgroudColor) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        else {
            this.ctx.fillStyle = this.backgroudColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        for (let camera of this.scene.cameras) {
            camera.render();
        }
        if (this.debug) {
            this.ctx.textAlign = 'left';
            this.ctx.font = '8px';
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(`${this.fps} fps`, 2, 10);
            this.ctx.fillText(`camera(${this.scene.cameras[0].position.x}, ${this.scene.cameras[0].position.y}, ${this.scene.cameras[0].zoom})`, 2, 30);
            const mouse = this.scene.cameras[0].getMouseCoordinates();
            this.ctx.fillText(`mouse(${this.mouse.x}, ${this.mouse.y}) (${mouse.x}, ${mouse.y}) Event(${this.events})`, 2, 40);
            this.ctx.fillText(`mouseObjects(${this.mouseObjects.map((item) => item.name)})`, 2, 50);
            this.ctx.fillText(`time:${(this.scene.time / 1000).toFixed(1)} sec`, 2, 20);
            let offsetX = 60;
            for (let obj of this.scene.objects) {
                if (!obj.position)
                    continue;
                this.ctx.fillText(`${obj.name}(${obj.position.x}, ${obj.position.y}, ${obj.angle})`, 2, offsetX);
                offsetX += 10;
            }
        }
        this.frameAmount++;
        let delEvents = ['up', 'down'];
        for (let x of delEvents) {
            while (this.events.indexOf(x) != -1) {
                let ind = this.events.indexOf(x);
                this.events.splice(ind, 1);
            }
        }
        window.requestAnimationFrame(this.update.bind(this));
    }
}
exports.default = Game;
