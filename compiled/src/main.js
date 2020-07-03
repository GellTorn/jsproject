(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle_1 = __importDefault(require("./Rectangle"));
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
    Camera.prototype.pointInRect = function (point, rect) {
        var hw = rect.size.x / 2;
        var hh = rect.size.y / 2;
        var cx = rect.position.x + hw;
        var cy = rect.position.y + hh;
        var dx = cx - point.x;
        var dy = cy - point.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var res = {
            x: Math.cos(rect.angle) * dist,
            y: Math.sin(rect.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    };
    Camera.prototype.getMouseCoordinates = function () {
        return {
            x: -(this.scene.game.mouse.x - this.position.x - this.size.x / 2),
            y: -(this.scene.game.mouse.y - this.position.y - this.size.y / 2),
        };
    };
    Camera.prototype.render = function () {
        if (this.follow) {
            this.position.x = this.follow.position.x;
            this.position.y = this.follow.position.y;
        }
        this.displayList = [];
        for (var _i = 0, _a = this.scene.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.name === 'Camera') {
                continue;
            }
            if (obj.offscreen(this)) {
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
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(50, 0);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
        if (this.scene.game.debug) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            this.ctx.fillRect(this.size.x / 2 - 1, this.size.y / 2 - 1, 2, 2);
            this.ctx.fillRect(2, this.size.y / 4, 2, this.size.y / 4 * 3);
        }
    };
    return Camera;
}(Rectangle_1.default));
exports.default = Camera;

},{"./Rectangle":7}],2:[function(require,module,exports){
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = __importDefault(require("./Entity"));
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.radius = config.radius || 0;
        _this.drawingType = config.drawingType || 'stroke';
        _this.name = _this.name || 'Circle';
        _this.color = config.color || '#000';
        return _this;
    }
    Circle.prototype.draw = function (ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        if (this.drawingType === 'fill') {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
        ctx.restore();
    };
    Circle.prototype.intersectCircle = function (circle) {
        return this.distance(circle) < this.radius + circle.radius;
    };
    Circle.prototype.intersectPoint = function (point) {
        return this.distance(point) < this.radius;
    };
    return Circle;
}(Entity_1.default));
exports.default = Circle;
;

},{"./Entity":4}],3:[function(require,module,exports){
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle_1 = __importDefault(require("./Rectangle"));
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
    return Ellipse;
}(Rectangle_1.default));
exports.default = Ellipse;
;

},{"./Rectangle":7}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2_1 = __importDefault(require("./Vector2"));
var Entity = (function () {
    function Entity(config) {
        if (config === void 0) { config = {}; }
        this.scene = config.scene || null;
        this.position = config.position || new Vector2_1.default();
        this.velocity = config.velocity || new Vector2_1.default();
        this.acceleration = config.acceleration || new Vector2_1.default();
        this.mass = config.mass || 1;
        this.active = config.active || false;
        this.physics = config.physics || false;
        this._angle = config.angle || 0;
        this.delete = false;
        this.name = config.name || null;
        this.data = config.data || {};
        this.update = config.update || function () { };
    }
    Object.defineProperty(Entity.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            var max = Math.PI * 2;
            if (value > max) {
                value -= max;
            }
            else if (value < -max) {
                value += max;
            }
            this._angle = Math.round(value * 1000) / 1000;
        },
        enumerable: false,
        configurable: true
    });
    Entity.prototype.draw = function (ctx) {
    };
    Entity.prototype.offscreen = function (camera) {
        if (this.distance(camera.position) > 2000) {
            return false;
        }
        return true;
    };
    Entity.prototype.distance = function (position) {
        var dx = this.position.x - position.x;
        var dy = this.position.y - position.y;
        var res = Math.sqrt(dx * dx + dy * dy);
        return res;
    };
    Entity.prototype.applyForce = function (x, y) {
        this.acceleration.x += x / this.mass;
        this.acceleration.y += y / this.mass;
        return this;
    };
    return Entity;
}());
exports.default = Entity;

},{"./Vector2":11}],5:[function(require,module,exports){
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

},{"./Physics":6,"./Scene":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Physics = (function () {
    function Physics(config) {
        if (config === void 0) { config = {}; }
        this.game = config.game || null;
        this.collisions = [];
    }
    Physics.prototype.setCollision = function (obj1, obj2, callback) {
        var collision = {
            obj1: obj1,
            obj2: obj2,
            callback: callback
        };
        this.collisions.push(collision);
        return collision;
    };
    Physics.prototype.update = function (time, ticks) {
        for (var _i = 0, _a = this.game.scene.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (!obj.physics) {
                continue;
            }
            var friction = 0.95;
            obj.velocity.x *= friction;
            obj.velocity.y *= friction;
            obj.velocity.x += obj.acceleration.x;
            obj.velocity.y += obj.acceleration.y;
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
            obj.acceleration.x = 0;
            obj.acceleration.y = 0;
        }
    };
    return Physics;
}());
exports.default = Physics;

},{}],7:[function(require,module,exports){
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = __importDefault(require("./Entity"));
var Vector2_1 = __importDefault(require("./Vector2"));
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.size = config.size || new Vector2_1.default();
        _this.drawingType = config.drawingType || 'fill';
        _this.name = _this.name || 'Rectangle';
        _this.color = config.color || '#000';
        return _this;
    }
    Rectangle.prototype.draw = function (ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        if (this.drawingType === 'fill') {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
        ctx.restore();
    };
    Rectangle.prototype.intersectPoint = function (point) {
        var hw = this.size.x / 2;
        var hh = this.size.y / 2;
        var dist = this.distance(point);
        var res = {
            x: Math.cos(this.angle) * dist,
            y: Math.sin(this.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    };
    Rectangle.prototype.intersectAABB = function (rect) {
        if (Math.abs(this.position.x - rect.position.x) > this.size.x / 2 + rect.size.x / 2)
            return false;
        if (Math.abs(this.position.y - rect.position.y) > this.size.y / 2 + rect.size.y / 2)
            return false;
        return true;
    };
    return Rectangle;
}(Entity_1.default));
exports.default = Rectangle;
;

},{"./Entity":4,"./Vector2":11}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle_1 = __importDefault(require("./Rectangle"));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.imageId = config.imageId || '';
        _this.image = _this.scene.game.getResource(_this.imageId);
        _this.name = _this.name || 'Sprite';
        return _this;
    }
    Sprite.prototype.draw = function (ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    };
    return Sprite;
}(Rectangle_1.default));
exports.default = Sprite;
;

},{"./Rectangle":7}],10:[function(require,module,exports){
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle_1 = __importDefault(require("./Rectangle"));
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
}(Rectangle_1.default));
exports.default = Text;
;

},{"./Rectangle":7}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2 = (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.toPolar = function () {
        return {
            p: Math.sqrt(this.x * this.x + this.y * this.y),
            q: Math.atan2(this.y, this.x),
        };
    };
    return Vector2;
}());
exports.default = Vector2;

},{}],12:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./Rectangle":7,"dup":1}],13:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./Entity":4,"dup":2}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __importDefault(require("./Game"));
var Camera_1 = __importDefault(require("./Camera"));
var Rectangle_1 = __importDefault(require("./Rectangle"));
var Ellipse_1 = __importDefault(require("./Ellipse"));
var Sprite_1 = __importDefault(require("./Sprite"));
var Text_1 = __importDefault(require("./Text"));
var Circle_1 = __importDefault(require("./Circle"));
var Vector2_1 = __importDefault(require("./Vector2"));
var preload = function () {
    this.loadImage('rect', '../image/rect.png');
    this.loadImage('box', '../image/box.png');
    this.loadImage('ball', '../image/ball.png');
    this.loadImage('parrot', '../image/parrot.gif');
};
var create = function () {
    var scene = this.createScene('start');
    scene.update = function (time, ticks) {
    };
    var back = scene.createEntity(new Rectangle_1.default({
        scene: scene,
        position: new Vector2_1.default(0, 0),
        size: new Vector2_1.default(10000, 10000),
        color: '#ccc',
        active: false,
        update: function (time, ticks) {
            this.size.x += 100;
            this.size.y += 100;
        }
    }));
    var rect = scene.createEntity(new Rectangle_1.default({
        scene: scene,
        position: new Vector2_1.default(100, 400),
        size: new Vector2_1.default(100, 50),
        color: 'violet',
        angle: 0,
        active: true,
        data: {
            point1: {
                x: -400,
                y: 400,
            },
            point2: {
                x: 400,
                y: 400,
            },
            speed: 4,
            forward: true,
        },
        update: function (time, ticks) {
            if (this.data.forward) {
                this.position.x += this.data.speed;
                if (this.distance(this.data.point2) <= 0) {
                    this.data.forward = false;
                }
            }
            else {
                this.position.x -= this.data.speed;
                if (this.distance(this.data.point1) <= 0) {
                    this.data.forward = true;
                }
            }
        },
    }));
    var ellipse = scene.createEntity(new Ellipse_1.default({
        scene: scene,
        position: new Vector2_1.default(100, 300),
        size: new Vector2_1.default(100, 50),
        color: 'green',
        active: true,
        physics: true,
        update: function (time, ticks) {
        }
    }));
    var text = scene.createEntity(new Text_1.default({
        scene: scene,
        position: new Vector2_1.default(0, -200),
        size: new Vector2_1.default(500, 50),
        color: 'black',
        drawingType: 'fill',
        angle: 0,
        text: 'WASD to control',
        active: false,
    }));
    var circle = scene.createEntity(new Circle_1.default({
        scene: scene,
        position: new Vector2_1.default(200, 100),
        radius: 80,
        color: 'brown',
        angle: 0,
        active: true,
        drawingType: 'fill',
        data: {
            grow: false,
            growSpeed: 0.5,
            minSize: 20,
            maxSize: 80,
        },
        update: function (time, ticks) {
            if (this.data.grow) {
                this.radius += this.data.growSpeed;
                if (this.radius >= this.data.maxSize) {
                    this.data.grow = false;
                }
            }
            else {
                this.radius -= this.data.growSpeed;
                if (this.radius <= this.data.minSize) {
                    this.data.grow = true;
                }
            }
        }
    }));
    var circle2 = scene.createEntity(new Circle_1.default({
        scene: scene,
        position: new Vector2_1.default(0, 0),
        radius: 25,
        color: 'yellow',
        drawingType: 'fill',
        active: true,
        update: function (time, ticks) {
            var x0 = 500;
            var y0 = 200;
            var radius = 100;
            var startAngle = 0;
            var angle = time / 200;
            this.position.x = x0 + Math.sin(angle + startAngle) * radius;
            this.position.y = y0 + Math.cos(angle + startAngle) * radius;
        }
    }));
    var box = scene.createEntity(new Sprite_1.default({
        scene: scene,
        position: new Vector2_1.default(-200, 0),
        size: new Vector2_1.default(100, 200),
        angle: 0,
        active: false,
        imageId: 'box',
    }));
    var ball = scene.createEntity(new Sprite_1.default({
        scene: scene,
        position: new Vector2_1.default(-200, -300),
        size: new Vector2_1.default(100, 100),
        angle: 0,
        imageId: 'ball',
        active: true,
        physics: true,
        update: function (time, ticks) {
        }
    }));
    var player = scene.createEntity(new Circle_1.default({
        scene: scene,
        position: new Vector2_1.default(0, 0),
        radius: 50,
        color: 'blue',
        angle: 0,
        active: true,
        physics: true,
        drawingType: 'stroke',
        name: 'Player',
        data: {
            speed: 1,
            reload: false,
            timeToReload: 0,
        },
        update: function (time, ticks) {
            var _this = this;
            var shot = function () {
                _this.scene.createEntity(new Circle_1.default({
                    position: new Vector2_1.default(_this.x, _this.y),
                    acceleration: new Vector2_1.default(Math.cos(_this.angle) * 50, Math.sin(_this.angle) * 50),
                    radius: 4,
                    color: 'black',
                    angle: _this.angle,
                    active: true,
                    physics: true,
                    drawingType: 'fill',
                    name: 'Bullet',
                    data: {
                        time: time,
                        delay: 1000 * 0.9,
                    },
                    update: function (time, ticks) {
                        if (this.data.time + this.data.delay < time) {
                            this.delete = true;
                        }
                    }
                }));
            };
            if (this.scene.game.events.includes('KeyW')) {
                this.applyForce(0, -this.data.speed);
            }
            else if (this.scene.game.events.includes('KeyS')) {
                this.applyForce(0, this.data.speed);
            }
            if (this.scene.game.events.includes('KeyA')) {
                this.applyForce(-this.data.speed, 0);
            }
            else if (this.scene.game.events.includes('KeyD')) {
                this.applyForce(this.data.speed, 0);
            }
            if (this.scene.game.events.includes('Space') || this.scene.game.events.includes('mouse0')) {
                if (ticks > this.data.timeToReload + 10) {
                    this.data.reload = false;
                }
                if (!this.data.reload) {
                    shot();
                    this.data.reload = true;
                    this.data.timeToReload = ticks;
                }
            }
            var mC = camera.getMouseCoordinates();
            this.angle = Math.atan2(this.position.y - mC.y, this.position.x - mC.x);
        },
    }));
    var camera = scene.createCamera(new Camera_1.default({
        ctx: game.ctx,
        position: new Vector2_1.default(0, 0),
        size: new Vector2_1.default(game.width, game.height),
        active: true,
        physics: false,
        update: function () {
            if (this.scene.game.events.includes('up')) {
                this.zoom *= 1.1;
            }
            if (this.scene.game.events.includes('down')) {
                this.zoom *= 1 / 1.1;
            }
            this.scene.game.mouseObjects = [];
            var mouse = this.scene.game.mouse;
        },
    }));
    camera.follow = player;
    this.setScene('start');
};
var game = new Game_1.default({
    canvas: document.getElementById('canvas'),
    width: innerWidth,
    height: innerHeight,
    debug: true,
    alpha: true,
    imageSmoothingEnabled: false,
    backgroudColor: '#fff',
    physics: null,
    preload: preload,
    create: create,
});

},{"./Camera":1,"./Circle":2,"./Ellipse":3,"./Game":5,"./Rectangle":7,"./Sprite":9,"./Text":10,"./Vector2":11}],15:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./Rectangle":7,"dup":3}]},{},[12,13,14,15,4,5,6,7,8,9,10,11]);
