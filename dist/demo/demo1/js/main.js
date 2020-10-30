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
import Game from "./Game";
import Camera from "./Camera";
import Entity from "./GameObjects/Entity";
import Rectangle from "./GameObjects/Rectangle";
import Ellipse from "./GameObjects/Ellipse";
import Sprite from "./GameObjects/Sprite";
import Text from "./GameObjects/Text";
import Circle from "./GameObjects/Circle";
import Vector2 from "./Vector2";
import Animation from "./Animation";
var HpBar = (function (_super) {
    __extends(HpBar, _super);
    function HpBar(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.name = 'HP bar';
        _this.parentEntity = config.parentEntity || null;
        _this.offset = config.offset || new Vector2(0, -50);
        _this.size = config.size || new Vector2(100, 10);
        _this.color = config.color || 'red';
        return _this;
    }
    HpBar.prototype.draw = function (ctx) {
        if (this.parentEntity.data.hp === this.parentEntity.data.maxHp || this.parentEntity.data.hp <= 0) {
            return;
        }
        var x = this.parentEntity.position.x - this.size.x / 2;
        var y = this.parentEntity.position.y + this.offset.y;
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, this.size.x, this.size.y);
        ctx.fillStyle = this.color;
        var width = this.parentEntity.data.hp * this.size.x / this.parentEntity.data.maxHp;
        ctx.fillRect(x, y, width, this.size.y);
    };
    return HpBar;
}(Entity));
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
var preload = function () {
    this.loadImage('rect', '../image/rect.png');
    this.loadImage('box', '../image/box.png');
    this.loadImage('ball', '../image/ball.png');
    this.loadImage('parrot', '../image/parrot.gif');
    this.loadImage('idle', '../image/сhar_idle.png');
    this.loadImage('walk1', '../image/сhar_walk1.png');
    this.loadImage('walk2', '../image/сhar_walk2.png');
};
var create = function () {
    var scene = this.createScene('start');
    scene.update = function (time, ticks) {
    };
    var background = scene.createEntity(new Rectangle({
        scene: scene,
        position: new Vector2(0, 0),
        size: new Vector2(10000, 10000),
        color: '#ccc',
        active: false,
        name: 'background',
        body: new Rectangle({
            position: new Vector2(0, 0),
            size: new Vector2(10000, 10000),
        }),
        update: function (time, ticks) {
            this.size.x += 100;
            this.size.y += 100;
        }
    }));
    var rect = scene.createEntity(new Rectangle({
        scene: scene,
        position: new Vector2(100, 400),
        size: new Vector2(100, 50),
        color: 'violet',
        angle: 0,
        active: true,
        body: new Rectangle({
            position: new Vector2(100, 400),
            size: new Vector2(100, 50)
        }),
        data: {
            point1: new Vector2(-400, 400),
            point2: new Vector2(400, 400),
            speed: 4,
            forward: true,
        },
        update: function (time, ticks) {
            if (this.data.forward) {
                this.position.x += this.data.speed;
                if (this.position.distance(this.data.point2) <= 0) {
                    this.data.forward = false;
                }
            }
            else {
                this.position.x -= this.data.speed;
                if (this.position.distance(this.data.point1) <= 0) {
                    this.data.forward = true;
                }
            }
        },
    }));
    var ellipse = scene.createEntity(new Ellipse({
        scene: scene,
        position: new Vector2(100, 300),
        size: new Vector2(100, 50),
        color: 'green',
        active: true,
        physics: true,
        update: function (time, ticks) {
            this.angle += -0.1;
        }
    }));
    var text = scene.createEntity(new Text({
        scene: scene,
        position: new Vector2(0, -200),
        size: new Vector2(500, 50),
        color: 'black',
        drawingType: 'fill',
        angle: 0,
        text: 'WASD to control',
        active: false,
        body: new Rectangle({
            position: new Vector2(0, -200),
            size: new Vector2(500, 50),
        }),
    }));
    var circle = scene.createEntity(new Circle({
        scene: scene,
        position: new Vector2(200, 100),
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
            hp: 5,
            maxHp: 5,
        },
        update: function (time, ticks) {
            if (this.data.hp <= 0) {
                this.delete = true;
            }
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
    var circle2 = scene.createEntity(new Circle({
        scene: scene,
        position: new Vector2(0, 0),
        radius: 25,
        color: 'yellow',
        drawingType: 'fill',
        active: true,
        data: {
            hp: 20,
            maxHp: 20,
        },
        update: function (time, ticks) {
            if (this.data.hp <= 0) {
                this.delete = true;
            }
            var x0 = 500;
            var y0 = 200;
            var radius = 100;
            var startAngle = 0;
            var angle = time / 200;
            this.position.x = x0 + Math.sin(angle + startAngle) * radius;
            this.position.y = y0 + Math.cos(angle + startAngle) * radius;
        }
    }));
    var box = scene.createEntity(new Sprite({
        scene: scene,
        position: new Vector2(-200, 0),
        size: new Vector2(100, 200),
        angle: 0,
        active: false,
        imageId: 'box',
        name: 'WIDE BOX',
        body: new Rectangle({
            position: new Vector2(-200, 0),
            size: new Vector2(100, 200),
        }),
    }));
    var parrot = scene.createEntity(new Sprite({
        scene: scene,
        position: new Vector2(-200, -300),
        angle: 0,
        imageId: 'parrot',
        name: 'parrot',
        active: true,
        physics: true,
        body: new Rectangle({
            position: new Vector2(-200, -300),
            size: new Vector2(100, 100),
        }),
        update: function (time, ticks) {
            this.angle += 0.1;
        }
    }));
    var player = scene.createEntity(new Circle({
        scene: scene,
        position: new Vector2(0, 0),
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
                if (ticks > _this.data.timeToReload + 10) {
                    _this.data.reload = false;
                }
                if (!_this.data.reload) {
                    var bullet_1 = new Circle({
                        position: new Vector2(_this.position.x, _this.position.y),
                        acceleration: new Vector2(Math.cos(_this.angle) * 50, Math.sin(_this.angle) * 50),
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
                    });
                    _this.scene.createEntity(bullet_1);
                    _this.data.reload = true;
                    _this.data.timeToReload = ticks;
                    var arr = [parrot, box, circle, circle2, ellipse, rect];
                    var _loop_1 = function (x) {
                        _this.scene.game.physics.setCollision(bullet_1, x, function () {
                            if (!bullet_1.data.colided) {
                                x.data.hp -= 1;
                                bullet_1.data.colided = true;
                            }
                        });
                    };
                    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                        var x = arr_1[_i];
                        _loop_1(x);
                    }
                }
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
                shot();
            }
            var mC = camera.getMouseCoordinates();
            this.angle = Math.atan2(this.position.y - mC.y, this.position.x - mC.x) + Math.PI;
        },
    }));
    var character = scene.createEntity(new Sprite({
        scene: scene,
        position: new Vector2(300, -100),
        angle: 0,
        imageId: 'idle',
        name: 'character',
        active: true,
        physics: true,
        data: {
            hp: 20,
            maxHp: 20,
        },
    }));
    var walk = scene.createEntity(new Animation({
        changingValue: 'image',
        entity: character,
        values: [
            scene.game.getResource('walk1'),
            scene.game.getResource('walk2'),
            scene.game.getResource('walk1'),
            scene.game.getResource('walk2'),
            scene.game.getResource('walk1'),
            scene.game.getResource('walk2'),
            scene.game.getResource('walk1'),
            scene.game.getResource('walk2'),
            scene.game.getResource('walk1'),
            scene.game.getResource('idle'),
            scene.game.getResource('idle'),
            scene.game.getResource('idle'),
            scene.game.getResource('idle'),
        ],
        framesPerChange: 20,
        active: true,
    }));
    var camera = scene.createCamera(new Camera({
        ctx: game.ctx,
        position: new Vector2(0, 0),
        size: new Vector2(game.width, game.height),
        active: true,
        physics: false,
        isDraw: false,
        update: function () {
            if (this.scene.game.events.includes('up')) {
                this.zoom *= 1.1;
            }
            if (this.scene.game.events.includes('down')) {
                this.zoom *= 1 / 1.1;
            }
            this.scene.game.mouseObjects = [];
            var arr = [parrot, background, rect, box];
            var mouse = this.getMouseCoordinates();
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var obj = arr_2[_i];
                if (Rectangle.intersectPointWithoutAngle(obj.body, mouse)) {
                    this.scene.game.mouseObjects.push(obj);
                }
            }
        },
    }));
    var hp1 = scene.createEntity(new HpBar({
        parentEntity: character,
        color: '#fcd703',
    }));
    var hp2 = scene.createEntity(new HpBar({
        parentEntity: player,
    }));
    var hp3 = scene.createEntity(new HpBar({
        parentEntity: circle,
    }));
    var hp4 = scene.createEntity(new HpBar({
        parentEntity: circle2,
    }));
    camera.follow = player;
    this.setScene('start');
};
var game = new Game({
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