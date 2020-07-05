(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("../src/Game"));
const Camera_1 = __importDefault(require("../src/Camera"));
const Rectangle_1 = __importDefault(require("../src/Rectangle"));
const Ellipse_1 = __importDefault(require("../src/Ellipse"));
const Sprite_1 = __importDefault(require("../src/Sprite"));
const Text_1 = __importDefault(require("../src/Text"));
const Circle_1 = __importDefault(require("../src/Circle"));
const Vector2_1 = __importDefault(require("../src/Vector2"));
const preload = function () {
    this.loadImage('rect', '../image/rect.png');
    this.loadImage('box', '../image/box.png');
    this.loadImage('ball', '../image/ball.png');
    this.loadImage('parrot', '../image/parrot.gif');
};
const create = function () {
    let scene = this.createScene('start');
    scene.update = (time, ticks) => {
    };
    let back = scene.createEntity(new Rectangle_1.default({
        scene: scene,
        position: new Vector2_1.default(0, 0),
        size: new Vector2_1.default(10000, 10000),
        color: '#ccc',
        active: false,
        update(time, ticks) {
            this.size.x += 100;
            this.size.y += 100;
        }
    }));
    let rect = scene.createEntity(new Rectangle_1.default({
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
        update(time, ticks) {
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
    let ellipse = scene.createEntity(new Ellipse_1.default({
        scene: scene,
        position: new Vector2_1.default(100, 300),
        size: new Vector2_1.default(100, 50),
        color: 'green',
        active: true,
        physics: true,
        update(time, ticks) {
        }
    }));
    let text = scene.createEntity(new Text_1.default({
        scene: scene,
        position: new Vector2_1.default(0, -200),
        size: new Vector2_1.default(500, 50),
        color: 'black',
        drawingType: 'fill',
        angle: 0,
        text: 'WASD to control',
        active: false,
    }));
    let circle = scene.createEntity(new Circle_1.default({
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
        update(time, ticks) {
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
    let circle2 = scene.createEntity(new Circle_1.default({
        scene: scene,
        position: new Vector2_1.default(0, 0),
        radius: 25,
        color: 'yellow',
        drawingType: 'fill',
        active: true,
        update(time, ticks) {
            let x0 = 500;
            let y0 = 200;
            let radius = 100;
            let startAngle = 0;
            let angle = time / 200;
            this.position.x = x0 + Math.sin(angle + startAngle) * radius;
            this.position.y = y0 + Math.cos(angle + startAngle) * radius;
        }
    }));
    let box = scene.createEntity(new Sprite_1.default({
        scene: scene,
        position: new Vector2_1.default(-200, 0),
        size: new Vector2_1.default(100, 200),
        angle: 0,
        active: false,
        imageId: 'box',
    }));
    let ball = scene.createEntity(new Sprite_1.default({
        scene: scene,
        position: new Vector2_1.default(-200, -300),
        size: new Vector2_1.default(100, 100),
        angle: 0,
        imageId: 'ball',
        active: true,
        physics: true,
        update(time, ticks) {
        }
    }));
    let player = scene.createEntity(new Circle_1.default({
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
        update(time, ticks) {
            let shot = () => {
                this.scene.createEntity(new Circle_1.default({
                    position: new Vector2_1.default(this.position.x, this.position.y),
                    acceleration: new Vector2_1.default(Math.cos(this.angle) * 50, Math.sin(this.angle) * 50),
                    radius: 4,
                    color: 'black',
                    angle: this.angle,
                    active: true,
                    physics: true,
                    drawingType: 'fill',
                    name: 'Bullet',
                    data: {
                        time: time,
                        delay: 1000 * 0.9,
                    },
                    update(time, ticks) {
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
            let mC = camera.getMouseCoordinates();
            this.angle = Math.atan2(this.position.y - mC.y, this.position.x - mC.x);
        },
    }));
    let camera = scene.createCamera(new Camera_1.default({
        ctx: game.ctx,
        position: new Vector2_1.default(0, 0),
        size: new Vector2_1.default(game.width, game.height),
        active: true,
        physics: false,
        update() {
            if (this.scene.game.events.includes('up')) {
                this.zoom *= 1.1;
            }
            if (this.scene.game.events.includes('down')) {
                this.zoom *= 1 / 1.1;
            }
            this.scene.game.mouseObjects = [];
            const mouse = this.scene.game.mouse;
        },
    }));
    camera.follow = player;
    this.setScene('start');
};
const game = new Game_1.default({
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

},{"../src/Camera":2,"../src/Circle":3,"../src/Ellipse":4,"../src/Game":6,"../src/Rectangle":8,"../src/Sprite":10,"../src/Text":11,"../src/Vector2":12}],2:[function(require,module,exports){
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
            if (obj.name === 'Camera') {
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

},{"./Rectangle":8}],3:[function(require,module,exports){
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
    intersectCircle(circle) {
        return this.distance(circle) < this.radius + circle.radius;
    }
    intersectPoint(point) {
        return this.distance(point) < this.radius;
    }
}
exports.default = Circle;
;

},{"./Entity":5}],4:[function(require,module,exports){
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
}
exports.default = Ellipse;
;

},{"./Rectangle":8}],5:[function(require,module,exports){
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
        this._angle = config.angle || 0;
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
        if (this.distance(camera.position) > 2000) {
            return false;
        }
        return true;
    }
    distance(position) {
        const dx = this.position.x - position.x;
        const dy = this.position.y - position.y;
        const res = Math.sqrt(dx * dx + dy * dy);
        return res;
    }
    applyForce(x, y) {
        this.acceleration.x += x / this.mass;
        this.acceleration.y += y / this.mass;
        return this;
    }
}
exports.default = Entity;

},{"./Vector2":12}],6:[function(require,module,exports){
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
            let mouse = this.scene.cameras[0].getMouseCoordinates();
            this.ctx.fillText(`mouse(${this.mouse.x}, ${this.mouse.y}) (${mouse.x}, ${mouse.y}) Event(${this.events})`, 2, 40);
            this.ctx.fillText(`mouseObjects(${this.mouseObjects.map((item) => item.name)})`, 2, 50);
            this.ctx.fillText(`time:${(this.scene.time / 1000).toFixed(1)} sec`, 2, 20);
            let x = 60;
            for (let obj of this.scene.objects) {
                this.ctx.fillText(`${obj.name}(${obj.position.x}, ${obj.position.y}, ${obj.angle})`, 2, x);
                x += 10;
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

},{"./Physics":7,"./Scene":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Physics {
    constructor(config = {}) {
        this.game = config.game || null;
        this.collisions = [];
    }
    setCollision(obj1, obj2, callback) {
        const collision = {
            obj1,
            obj2,
            callback
        };
        this.collisions.push(collision);
        return collision;
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
    }
}
exports.default = Physics;

},{}],8:[function(require,module,exports){
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
        this.size = config.size || new Vector2_1.default();
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
    intersectPoint(point) {
        const hw = this.size.x / 2;
        const hh = this.size.y / 2;
        const dist = this.distance(point);
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

},{"./Entity":5,"./Vector2":12}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
    }
    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
}
exports.default = Sprite;
;

},{"./Rectangle":8}],11:[function(require,module,exports){
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

},{"./Rectangle":8}],12:[function(require,module,exports){
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

},{}]},{},[1]);