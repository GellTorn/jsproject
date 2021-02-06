import Game from "../../src/Game.js";
import Camera from "../../src/Camera.js";
import Rectangle from "../../src/GameObjects/Rectangle.js";
import Ellipse from "../../src/GameObjects/Ellipse.js";
import Sprite from "../../src/GameObjects/Sprite.js";
import Text from "../../src/GameObjects/Text.js";
import Circle from "../../src/GameObjects/Circle.js";
import Vector2 from "../../src/Vector2.js";
import Animation from "../../src/Animation.js";
import HpBar from "./HpBar.js";
const preload = function () {
  this.loadImage("rect", "../image/rect.png");
  this.loadImage("box", "../image/box.png");
  this.loadImage("ball", "../image/ball.png");
  this.loadImage("parrot", "../image/parrot.gif");
  this.loadImage("idle", "../image/char_idle.png");
  this.loadImage("walk1", "../image/char_walk1.png");
  this.loadImage("walk2", "../image/char_walk2.png");
};
const create = function () {
  let scene = this.createScene("start");
  scene.update = (time, ticks) => {};
  let background = scene.createEntity(
    new Rectangle({
      scene,
      position: new Vector2(0, 0),
      size: new Vector2(1e4, 1e4),
      color: "#ccc",
      active: false,
      name: "background",
      body: new Rectangle({
        position: new Vector2(0, 0),
        size: new Vector2(1e4, 1e4),
      }),
      update(time, ticks) {
        this.size.x += 100;
        this.size.y += 100;
      },
    })
  );
  let rect = scene.createEntity(
    new Rectangle({
      scene,
      position: new Vector2(100, 400),
      size: new Vector2(100, 50),
      color: "violet",
      angle: 0,
      active: true,
      body: new Rectangle({
        position: new Vector2(100, 400),
        size: new Vector2(100, 50),
      }),
      data: {
        point1: new Vector2(-400, 400),
        point2: new Vector2(400, 400),
        speed: 4,
        forward: true,
      },
      update(time, ticks) {
        if (this.data.forward) {
          this.position.x += this.data.speed;
          if (this.position.distance(this.data.point2) <= 0) {
            this.data.forward = false;
          }
        } else {
          this.position.x -= this.data.speed;
          if (this.position.distance(this.data.point1) <= 0) {
            this.data.forward = true;
          }
        }
      },
    })
  );
  let ellipse = scene.createEntity(
    new Ellipse({
      scene,
      position: new Vector2(100, 300),
      size: new Vector2(100, 50),
      color: "green",
      active: true,
      physics: true,
      update(time, ticks) {
        this.angle += -0.1;
      },
    })
  );
  let text = scene.createEntity(
    new Text({
      scene,
      position: new Vector2(0, -200),
      size: new Vector2(500, 50),
      color: "black",
      drawingType: "fill",
      angle: 0,
      text: "WASD to control",
      active: false,
      body: new Rectangle({
        position: new Vector2(0, -200),
        size: new Vector2(500, 50),
      }),
    })
  );
  let circle = scene.createEntity(
    new Circle({
      scene,
      position: new Vector2(200, 100),
      radius: 80,
      color: "brown",
      angle: 0,
      active: true,
      drawingType: "fill",
      data: {
        grow: false,
        growSpeed: 0.5,
        minSize: 20,
        maxSize: 80,
        hp: 5,
        maxHp: 5,
      },
      update(time, ticks) {
        if (this.data.hp <= 0) {
          this.delete = true;
        }
        if (this.data.grow) {
          this.radius += this.data.growSpeed;
          if (this.radius >= this.data.maxSize) {
            this.data.grow = false;
          }
        } else {
          this.radius -= this.data.growSpeed;
          if (this.radius <= this.data.minSize) {
            this.data.grow = true;
          }
        }
      },
    })
  );
  let circle2 = scene.createEntity(
    new Circle({
      scene,
      position: new Vector2(0, 0),
      radius: 25,
      color: "yellow",
      drawingType: "fill",
      active: true,
      data: {
        hp: 20,
        maxHp: 20,
      },
      update(time, ticks) {
        if (this.data.hp <= 0) {
          this.delete = true;
        }
        let x0 = 500;
        let y0 = 200;
        let radius = 100;
        let startAngle = 0;
        let angle = time / 200;
        this.position.x = x0 + Math.sin(angle + startAngle) * radius;
        this.position.y = y0 + Math.cos(angle + startAngle) * radius;
      },
    })
  );
  let box = scene.createEntity(
    new Sprite({
      scene,
      position: new Vector2(-200, 0),
      size: new Vector2(100, 200),
      angle: 0,
      active: false,
      imageId: "box",
      name: "WIDE BOX",
      body: new Rectangle({
        position: new Vector2(-200, 0),
        size: new Vector2(100, 200),
      }),
    })
  );
  let parrot = scene.createEntity(
    new Sprite({
      scene,
      position: new Vector2(-200, -300),
      angle: 0,
      imageId: "parrot",
      name: "parrot",
      active: true,
      physics: true,
      body: new Rectangle({
        position: new Vector2(-200, -300),
        size: new Vector2(100, 100),
      }),
      update(time, ticks) {
        this.angle += 0.1;
      },
    })
  );
  let player = scene.createEntity(
    new Circle({
      scene,
      position: new Vector2(0, 0),
      radius: 50,
      color: "blue",
      angle: 0,
      active: true,
      physics: true,
      drawingType: "stroke",
      name: "Player",
      data: {
        speed: 1,
        reload: false,
        timeToReload: 0,
      },
      update(time, ticks) {
        const shot = () => {
          if (ticks > this.data.timeToReload + 10) {
            this.data.reload = false;
          }
          if (!this.data.reload) {
            const bullet = new Circle({
              position: new Vector2(this.position.x, this.position.y),
              acceleration: new Vector2(
                Math.cos(this.angle) * 50,
                Math.sin(this.angle) * 50
              ),
              radius: 4,
              color: "black",
              angle: this.angle,
              active: true,
              physics: true,
              drawingType: "fill",
              name: "Bullet",
              data: {
                time,
                delay: 1e3 * 0.9,
              },
              update(time2, ticks2) {
                if (this.data.time + this.data.delay < time2) {
                  this.delete = true;
                }
              },
            });
            this.scene.createEntity(bullet);
            this.data.reload = true;
            this.data.timeToReload = ticks;
            const arr = [parrot, box, circle, circle2, ellipse, rect];
            for (let x of arr) {
              this.scene.game.physics.setCollision(bullet, x, () => {
                if (!bullet.data.colided) {
                  x.data.hp -= 1;
                  bullet.data.colided = true;
                }
              });
            }
          }
        };
        if (this.scene.game.events.includes("KeyW")) {
          this.applyForce(0, -this.data.speed);
        } else if (this.scene.game.events.includes("KeyS")) {
          this.applyForce(0, this.data.speed);
        }
        if (this.scene.game.events.includes("KeyA")) {
          this.applyForce(-this.data.speed, 0);
        } else if (this.scene.game.events.includes("KeyD")) {
          this.applyForce(this.data.speed, 0);
        }
        if (
          this.scene.game.events.includes("Space") ||
          this.scene.game.events.includes("mouse0")
        ) {
          shot();
        }
        const mC = camera.getMouseCoordinates();
        this.angle =
          Math.atan2(this.position.y - mC.y, this.position.x - mC.x) + Math.PI;
      },
    })
  );
  let character = scene.createEntity(
    new Sprite({
      scene,
      position: new Vector2(300, -100),
      angle: 0,
      imageId: "idle",
      name: "character",
      active: true,
      physics: true,
      data: {
        hp: 20,
        maxHp: 20,
      },
    })
  );
  let walk = scene.createEntity(
    new Animation({
      changingValue: "image",
      entity: character,
      values: [
        scene.game.getResource("walk1"),
        scene.game.getResource("walk2"),
        scene.game.getResource("walk1"),
        scene.game.getResource("walk2"),
        scene.game.getResource("walk1"),
        scene.game.getResource("walk2"),
        scene.game.getResource("walk1"),
        scene.game.getResource("walk2"),
        scene.game.getResource("walk1"),
        scene.game.getResource("idle"),
        scene.game.getResource("idle"),
        scene.game.getResource("idle"),
        scene.game.getResource("idle"),
      ],
      framesPerChange: 20,
      active: true,
    })
  );
  let camera = scene.createCamera(
    new Camera({
      ctx: game.ctx,
      position: new Vector2(0, 0),
      size: new Vector2(game.width, game.height),
      active: true,
      physics: false,
      isDraw: false,
      update() {
        if (this.scene.game.events.includes("up")) {
          this.zoom *= 1.1;
        }
        if (this.scene.game.events.includes("down")) {
          this.zoom *= 1 / 1.1;
        }
        this.scene.game.mouseObjects = [];
        const arr = [parrot, background, rect, box];
        const mouse = this.getMouseCoordinates();
        for (let obj of arr) {
          if (Rectangle.intersectPointWithoutAngle(obj.body, mouse)) {
            this.scene.game.mouseObjects.push(obj);
          }
        }
      },
    })
  );
  let hp1 = scene.createEntity(
    new HpBar({
      parentEntity: character,
      color: "#fcd703",
    })
  );
  let hp2 = scene.createEntity(
    new HpBar({
      parentEntity: player,
    })
  );
  let hp3 = scene.createEntity(
    new HpBar({
      parentEntity: circle,
    })
  );
  let hp4 = scene.createEntity(
    new HpBar({
      parentEntity: circle2,
    })
  );
  camera.follow = player;
  this.setScene("start");
};
const game = new Game({
  canvas: document.getElementById("canvas"),
  width: innerWidth,
  height: innerHeight,
  debug: true,
  alpha: true,
  imageSmoothingEnabled: false,
  backgroudColor: "#fff",
  physics: null,
  preload,
  create,
});
