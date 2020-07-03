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
