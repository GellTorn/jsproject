(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
class Circle extends Entity_1.default {
    constructor(config = {}) {
        super(config);
        this.radius = config.radius || 0;
        this.drawingType = config.drawingType || 'stroke';
        this.name = this.name || 'Circle';
        this.color = config.color || '#000';
    }
    draw(ctx) {
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
    }
    area() {
        return (this.radius > 0) ? Math.PI * this.radius * this.radius : 0;
    }
    intersectCircle(circle) {
        return this.position.distance(circle.position) < this.radius + circle.radius;
    }
    intersectPoint(point) {
        return this.position.distance(point) < this.radius;
    }
}
exports.default = Circle;
;

},{"./Entity":2}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __importDefault(require("./Vector2"));
class Entity {
    constructor(config = {}) {
        this.scene = config.scene || null;
        this.position = config.position || new Vector2_1.default();
        this.velocity = config.velocity || new Vector2_1.default();
        this.acceleration = config.acceleration || new Vector2_1.default();
        this.mass = config.mass || 1;
        this.active = config.active || false;
        this.physics = config.physics || false;
        this.isDraw = config.isDraw || true;
        this._angle = config.angle || 0;
        this.body = config.body || null;
        this.delete = false;
        this.name = config.name || null;
        this.data = config.data || {};
        this.update = config.update || function () { };
    }
    set angle(value) {
        const max = Math.PI * 2;
        if (value > max) {
            value -= max;
        }
        else if (value < -max) {
            value += max;
        }
        this._angle = Math.round(value * 1000) / 1000;
    }
    get angle() {
        return this._angle;
    }
    draw(ctx) {
    }
    offscreen(camera) {
        if (this.position.distance(camera.position) > 2000) {
            return false;
        }
        return true;
    }
    applyForce(x, y) {
        this.acceleration.x += x / this.mass;
        this.acceleration.y += y / this.mass;
        return this;
    }
}
exports.default = Entity;

},{"./Vector2":6}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Circle_1 = __importDefault(require("./Circle"));
class Physics {
    constructor(config = {}) {
        this.game = config.game || null;
        this.collisions = [];
    }
    setCollision(bodyA, bodyB, callback) {
        const collision = {
            bodyA,
            bodyB,
            callback
        };
        this.collisions.push(collision);
        return collision;
    }
    checkCollision(collision) {
        if (collision.bodyA instanceof Circle_1.default && collision.bodyB instanceof Circle_1.default) {
            if (collision.bodyA.intersectCircle(collision.bodyB)) {
                collision.callback();
            }
        }
    }
    update(time, ticks) {
        for (let obj of this.game.scene.objects) {
            if (!obj.physics) {
                continue;
            }
            let friction = 0.95;
            obj.velocity.x *= friction;
            obj.velocity.y *= friction;
            obj.velocity.x += obj.acceleration.x;
            obj.velocity.y += obj.acceleration.y;
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
            obj.acceleration.x = 0;
            obj.acceleration.y = 0;
        }
        for (let collision of this.collisions) {
            this.checkCollision(collision);
        }
    }
}
exports.default = Physics;

},{"./Circle":1}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
const Vector2_1 = __importDefault(require("./Vector2"));
class Rectangle extends Entity_1.default {
    constructor(config = {}) {
        super(config);
        this.size = config.size || new Vector2_1.default(0, 0);
        this.drawingType = config.drawingType || 'fill';
        this.name = this.name || 'Rectangle';
        this.color = config.color || '#000';
    }
    draw(ctx) {
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
    }
    area(rect) {
        return rect.size.x * rect.size.y;
    }
    intersectPoint(point) {
        const hw = this.size.x / 2;
        const hh = this.size.y / 2;
        const dist = this.position.distance(point);
        const res = {
            x: Math.cos(this.angle) * dist,
            y: Math.sin(this.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    }
    intersectAABB(rect) {
        if (Math.abs(this.position.x - rect.position.x) > this.size.x / 2 + rect.size.x / 2)
            return false;
        if (Math.abs(this.position.y - rect.position.y) > this.size.y / 2 + rect.size.y / 2)
            return false;
        return true;
    }
}
exports.default = Rectangle;
;

},{"./Entity":2,"./Vector2":6}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static fromVector(vector) {
        return new Vector2(vector.x, vector.y);
    }
    static fromArray(array) {
        return new Vector2(array[0], array[1]);
    }
    set(x, y = x) {
        this.x = x;
        this.y = y;
        return this;
    }
    setToPolar(azimuth, radius = 1) {
        this.x = Math.cos(azimuth) * radius;
        this.y = Math.sin(azimuth) * radius;
        return this;
    }
    equals(v) {
        return ((this.x === v.x) && (this.y === v.y));
    }
    angle() {
        let angle = Math.atan2(this.y, this.x);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }
    setAngle(angle) {
        return this.setToPolar(angle, this.length());
    }
    add(src) {
        this.x += src.x;
        this.y += src.y;
        return this;
    }
    subtract(src) {
        this.x -= src.x;
        this.y -= src.y;
        return this;
    }
    multiply(src) {
        this.x *= src.x;
        this.y *= src.y;
        return this;
    }
    divide(src) {
        this.x /= src.x;
        this.y /= src.y;
        return this;
    }
    scale(value) {
        if (isFinite(value)) {
            this.x *= value;
            this.y *= value;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    distance(src) {
        const dx = src.x - this.x;
        const dy = src.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    distanceSq(src) {
        const dx = src.x - this.x;
        const dy = src.y - this.y;
        return dx * dx + dy * dy;
    }
    length() {
        const x = this.x;
        const y = this.y;
        return Math.sqrt(x * x + y * y);
    }
    setLength(length) {
        return this.normalize().scale(length);
    }
    lengthSq() {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }
    normalize() {
        const x = this.x;
        const y = this.y;
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = x * len;
            this.y = y * len;
        }
        return this;
    }
    normalizeRightHand() {
        const x = this.x;
        this.x = this.y * -1;
        this.y = x;
        return this;
    }
    normalizeLeftHand() {
        const x = this.x;
        this.x = this.y;
        this.y = x * -1;
        return this;
    }
    dot(src) {
        return this.x * src.x + this.y * src.y;
    }
    cross(src) {
        return this.x * src.y - this.y * src.x;
    }
    lerp(src, t = 0) {
        const ax = this.x;
        const ay = this.y;
        this.x = ax + t * (src.x - ax);
        this.y = ay + t * (src.y - ay);
        return this;
    }
    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    limit(max) {
        const len = this.length();
        if (len && len > max) {
            this.scale(max / len);
        }
        return this;
    }
    reflect(normal) {
        normal = Vector2.fromVector(normal).normalize();
        return this.subtract(normal.scale(2 * this.dot(normal)));
    }
    mirror(axis) {
        return this.reflect(axis).negate();
    }
    rotate(delta) {
        const cos = Math.cos(delta);
        const sin = Math.sin(delta);
        return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    }
    toPolar() {
        return {
            p: Math.sqrt(this.x * this.x + this.y * this.y),
            q: Math.atan2(this.y, this.x),
        };
    }
}
exports.default = Vector2;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Animation {
    constructor(config = {}) {
        this.scene = config.scene || null;
        this.entity = config.entity || null;
        this.changingValue = config.changingValue || null;
        this.values = config.values || [];
        this.currentValue = config.currentValue || 0;
        this.framesPerChange = config.framesPerChange || 1;
        this.currentFrame = config.currentFrame || 0;
        this.active = config.active || false;
        this.repeat = config.repeat || -1;
        this.yoyo = config.yoyo || false;
        this.name = config.name || 'Animation';
    }
    update(time, ticks) {
        this.currentFrame++;
        if (this.currentFrame === this.framesPerChange) {
            this.currentValue++;
            if (this.currentValue >= this.values.length) {
                this.currentValue = 0;
            }
            this.entity[this.changingValue] = this.values[this.currentValue];
            this.currentFrame = 0;
        }
    }
    run() {
        this.active = false;
    }
    stop() {
        this.active = true;
    }
}
exports.default = Animation;

},{}],8:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Camera extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.name = this.name || 'Camera';
        if (config.ctx) {
            this.ctx = config.ctx;
        }
        else {
            this.image = document.createElement('canvas');
            this.image.width = this.size.x;
            this.image.height = this.size.y;
            this.ctx = this.image.getContext('2d');
        }
        this.follow = config.follow || null;
        this.zoom = config.zoom || 1;
        this.displayList = [];
    }
    pointInRect(point, rect) {
        const hw = rect.size.x / 2;
        const hh = rect.size.y / 2;
        const cx = rect.position.x + hw;
        const cy = rect.position.y + hh;
        const dx = cx - point.x;
        const dy = cy - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const res = {
            x: Math.cos(rect.angle) * dist,
            y: Math.sin(rect.angle) * dist,
        };
        if (res.x > hw || res.x < -hw ||
            res.y > hh || res.y < -hh) {
            return false;
        }
        return true;
    }
    getMouseCoordinates() {
        return {
            x: -(this.scene.game.mouse.x - this.position.x - this.size.x / 2),
            y: -(this.scene.game.mouse.y - this.position.y - this.size.y / 2),
        };
    }
    render() {
        if (this.follow) {
            this.position.x = this.follow.position.x;
            this.position.y = this.follow.position.y;
        }
        this.displayList = [];
        for (let obj of this.scene.objects) {
            if (!obj.isDraw) {
                continue;
            }
            if (obj.offscreen(this)) {
                this.displayList.push(obj);
            }
        }
        for (let obj of this.displayList) {
            let x = obj.position.x;
            let y = obj.position.y;
            let ang = obj.angle;
            let z = this.zoom;
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
    }
}
exports.default = Camera;

},{"./Rectangle":4}],9:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./Entity":2,"dup":1}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Ellipse extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.drawingType = config.drawingType || 'fill';
        this.name = this.name || 'Ellipse';
        this.color = config.color || '#000';
    }
    draw(ctx) {
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
    }
    getMinorRadius() {
        return Math.min(this.size.x, this.size.y) / 2;
    }
    getMajorRadius() {
        return Math.max(this.size.x, this.size.y) / 2;
    }
    isEmpty() {
        return (this.size.x <= 0 || this.size.y <= 0);
    }
    area() {
        if (this.isEmpty()) {
            return 0;
        }
        return (this.getMajorRadius() * this.getMinorRadius() * Math.PI);
    }
}
exports.default = Ellipse;
;

},{"./Rectangle":4}],11:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./Vector2":6,"dup":2}],12:[function(require,module,exports){
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

},{"./Physics":3,"./Scene":5}],13:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./Circle":1,"dup":3}],14:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Entity":2,"./Vector2":6,"dup":4}],15:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Sprite extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.imageId = config.imageId || '';
        this.image = this.scene.game.getResource(this.imageId);
        this.name = this.name || 'Sprite';
        if (this.size.x === 0 && this.size.y === 0) {
            this.size.x = this.image.width;
            this.size.y = this.image.height;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
    setImage(imageId) {
        this.imageId = imageId;
        this.image = this.scene.game.getResource(imageId);
        return this;
    }
}
exports.default = Sprite;
;

},{"./Rectangle":4}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
const Vector2_1 = __importDefault(require("./Vector2"));
class Spritesheet extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.imageId = config.imageId || '';
        this.image = this.scene.game.getResource(this.imageId);
        this.spriteSize = config.spriteSize || new Vector2_1.default();
        this.name = this.name || 'Spritesheet';
        if (this.size.x === 0 && this.size.y === 0) {
            this.size.x = this.image.width;
            this.size.y = this.image.height;
        }
    }
    getImage(id) {
    }
    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
}
exports.default = Spritesheet;
;

},{"./Rectangle":4,"./Vector2":6}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __importDefault(require("./Rectangle"));
class Text extends Rectangle_1.default {
    constructor(config = {}) {
        super(config);
        this.color = config.color || '#000';
        this.drawingType = config.drawingType || 'stroke';
        this.name = this.name || 'Text';
        this.text = config.text || '';
        this.font = config.font || `${this.size.y}px sans-serif`;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.textAlign = 'left';
        ctx.font = this.font;
        const w = ctx.measureText(this.text).width;
        if (this.drawingType === 'fill') {
            ctx.fillText(this.text, -w / 2, this.size.y / 2);
        }
        else {
            ctx.strokeText(this.text, -w / 2, this.size.y / 2);
        }
        ctx.restore();
    }
}
exports.default = Text;
;

},{"./Rectangle":4}],19:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}]},{},[8,9,10,11,12,13,14,15,16,18,19,17,7]);
