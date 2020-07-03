"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scene_1 = __importDefault(require("./Scene"));
var Physics_1 = __importDefault(require("./Physics"));
var Game = (function () {
    function Game(config) {
        if (config === void 0) { config = {}; }
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
    Game.prototype.onMouseMove = function (event) {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
    };
    Game.prototype.onMouseClick = function (event) {
        event.preventDefault();
    };
    Game.prototype.onContextMenu = function (event) {
        event.preventDefault();
    };
    Game.prototype.onMouseDown = function (event) {
        this.events.push('mouse' + event.button);
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        event.preventDefault();
    };
    Game.prototype.onMouseUp = function (event) {
        var index = this.events.indexOf('mouse' + event.button);
        if (index == -1) {
            return;
        }
        this.events.splice(index, 1);
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        event.preventDefault();
    };
    Game.prototype.onKeyDown = function (event) {
        if (event.repeat) {
            return;
        }
        this.events.push(event.code);
    };
    Game.prototype.onKeyUp = function (event) {
        while (this.events.indexOf(event.code) != -1) {
            var index = this.events.indexOf(event.code);
            this.events.splice(index, 1);
        }
        event.preventDefault();
    };
    Game.prototype.onWheel = function (event) {
        if (event.deltaY < 0) {
            this.events.push('up');
        }
        else if (event.deltaY > 0) {
            this.events.push('down');
        }
    };
    Game.prototype.onFocus = function (event) {
        this.scene.paused = false;
    };
    Game.prototype.onBlur = function (event) {
        this.scene.paused = true;
    };
    Game.prototype.checkEventCode = function (event, events) {
    };
    Game.prototype.setScene = function (sceneId) {
        this.scene = this.scenes[sceneId];
        return this;
    };
    Game.prototype.createScene = function (sceneId, config) {
        if (config === void 0) { config = {}; }
        var scene = new Scene_1.default(config);
        scene.game = this;
        this.scenes[sceneId] = scene;
        return scene;
    };
    Game.prototype.check = function () {
        this.fps = this.frameAmount;
        this.frameAmount = 0;
    };
    Game.prototype.loadImage = function (imageId, source) {
        var image = new Image();
        this.resources[imageId] = image;
        image.src = source;
        image.loaded = false;
        image.onload = function () {
            image.loaded = true;
        };
        image.onload.bind(this);
        return this;
    };
    Game.prototype.loadVideo = function (videoId, source) {
        var video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        this.resources[videoId] = video;
        video.src = source;
        video.loaded = false;
        video.onload = function () {
            video.loaded = true;
            video.play();
        };
        video.onload.bind(this);
        return this;
    };
    Game.prototype.getResource = function (resourceId) {
        return this.resources[resourceId];
    };
    Game.prototype._preloadDone = function () {
        for (var _i = 0, _a = this.resources; _i < _a.length; _i++) {
            var image = _a[_i];
            if (!image.loaded) {
                console.log('not ready');
                return false;
            }
        }
        clearInterval(this._preloadDoneInterval);
        this.create();
        console.info("Game engine v" + this.version);
        window.requestAnimationFrame(this.update.bind(this));
        this._setFps = setInterval(this.check.bind(this), 1000);
    };
    Game.prototype.update = function () {
        if (this.scene == null) {
            return;
        }
        if (!this.scene.paused) {
            this.scene.time = Date.now() - this.scene.lastTimePaused;
            this.scene.timeTick++;
            this.scene.objects = this.scene.objects.filter(function (obj) {
                if (!obj.delete) {
                    return true;
                }
                return false;
            });
            this.scene.createUpdateList();
            this.physics.update(this.scene.time, this.scene.timeTick);
            for (var _i = 0, _a = this.scene.updateList; _i < _a.length; _i++) {
                var obj = _a[_i];
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
        for (var _b = 0, _c = this.scene.cameras; _b < _c.length; _b++) {
            var camera = _c[_b];
            camera.render();
        }
        if (this.debug) {
            this.ctx.textAlign = 'left';
            this.ctx.font = '8px';
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(this.fps + " fps", 2, 10);
            this.ctx.fillText("camera(" + this.scene.cameras[0].position.x + ", " + this.scene.cameras[0].position.y + ", " + this.scene.cameras[0].zoom + ")", 2, 30);
            var mouse = this.scene.cameras[0].getMouseCoordinates();
            this.ctx.fillText("mouse(" + this.mouse.x + ", " + this.mouse.y + ") (" + mouse.x + ", " + mouse.y + ") Event(" + this.events + ")", 2, 40);
            this.ctx.fillText("mouseObjects(" + this.mouseObjects.map(function (item) { return item.name; }) + ")", 2, 50);
            this.ctx.fillText("time:" + (this.scene.time / 1000).toFixed(1) + " sec", 2, 20);
            var x = 60;
            for (var _d = 0, _e = this.scene.objects; _d < _e.length; _d++) {
                var obj = _e[_d];
                this.ctx.fillText(obj.name + "(" + obj.position.x + ", " + obj.position.y + ", " + obj.angle + ")", 2, x);
                x += 10;
            }
        }
        this.frameAmount++;
        var delEvents = ['up', 'down'];
        for (var _f = 0, delEvents_1 = delEvents; _f < delEvents_1.length; _f++) {
            var x = delEvents_1[_f];
            while (this.events.indexOf(x) != -1) {
                var ind = this.events.indexOf(x);
                this.events.splice(ind, 1);
            }
        }
        window.requestAnimationFrame(this.update.bind(this));
    };
    return Game;
}());
exports.default = Game;
