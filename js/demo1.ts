import Game from "../src/Game";
import Camera from "../src/Camera";
import Scene from "../src/Scene";
import Entity from "../src/Entity";
import Rectangle from "../src/Rectangle";
import Physics from "../src/Physics";
import Ellipse from "../src/Ellipse";
import Sprite from "../src/Sprite";
import Text from "../src/Text";
import Circle from "../src/Circle";
import Vector2 from "../src/Vector2";
import Animation from "../src/Animation";

const preload = function () {
  this.loadImage('rect', '../image/rect.png');
  this.loadImage('box', '../image/box.png');
  this.loadImage('ball', '../image/ball.png');
  this.loadImage('parrot', '../image/parrot.gif');
  this.loadImage('idle', '../image/сhar_idle.png');
  this.loadImage('walk1', '../image/сhar_walk1.png');
  this.loadImage('walk2', '../image/сhar_walk2.png');
}

const create = function () {
  let scene = this.createScene('start');

  scene.update = (time, ticks) => {

  };

  let back = scene.createEntity(new Rectangle({
    scene: scene,
    position: new Vector2(0, 0),
    size: new Vector2(10000, 10000),
    color: '#ccc',
    active: false,
    update(time, ticks) {
      this.size.x += 100;
      this.size.y += 100;
    }
  }));

  let rect = scene.createEntity(new Rectangle({
    scene: scene,
    position: new Vector2(100, 400),
    size: new Vector2(100, 50),
    color: 'violet',
    angle: 0,
    active: true,
    data: {
      point1: new Vector2(-400, 400),
      point2: new Vector2(400, 400),
      speed: 4,
      forward: true,
    },
    update(time, ticks) {
      // function interpolate(x1, y1, x2, y2, x) {
      //     const y = y1 + (y2 - y1) / (x2 - x1) * (x - x1);
      //     return y;
      // }

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

  let ellipse = scene.createEntity(new Ellipse({
    scene: scene,
    position: new Vector2(100, 300),
    size: new Vector2(100, 50),
    color: 'green',
    active: true,
    physics: true,
    update(time, ticks) {
      this.angle += -0.1;
    }
  }));

  let text = scene.createEntity(new Text({
    scene: scene,
    position: new Vector2(0, -200),
    size: new Vector2(500, 50),
    color: 'black',
    drawingType: 'fill',
    angle: 0,
    text: 'WASD to control',
    active: false,
  }));

  let circle = scene.createEntity(new Circle({
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

  let circle2 = scene.createEntity(new Circle({
    scene: scene,
    position: new Vector2(0, 0),
    radius: 25,
    color: 'yellow',
    drawingType: 'fill',
    active: true,
    update(time, ticks) {
      let x0 = 500;
      let y0 = 200;
      let radius = 100;
      let startAngle = 0;
      let angle = time / 200; // aka speed
      this.position.x = x0 + Math.sin(angle + startAngle) * radius;
      this.position.y = y0 + Math.cos(angle + startAngle) * radius;
    }
  }));

  let box = scene.createEntity(new Sprite({
    scene: scene,
    position: new Vector2(-200, 0),
    size: new Vector2(100, 200),
    angle: 0,
    active: false,
    imageId: 'box',
  }));

  let ball = scene.createEntity(new Sprite({
    scene: scene,
    position: new Vector2(-200, -300),
    angle: 0,
    imageId: 'parrot',
    active: true,
    physics: true,
    update(time, ticks) {
      this.angle += 0.1;
    }
  }));

  let player = scene.createEntity(new Circle({
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
    update(time, ticks) {
      const shot = () => {
        if (ticks > this.data.timeToReload + 10) {
          this.data.reload = false;
        }
        if (!this.data.reload) {
          const bullet = new Circle({
            position: new Vector2(this.position.x, this.position.y),
            acceleration: new Vector2(Math.cos(this.angle) * 50, Math.sin(this.angle) * 50),
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
          });
          this.scene.createEntity(bullet);
          this.data.reload = true;
          this.data.timeToReload = ticks;

          const arr = [ball, box, circle, circle2, ellipse, rect];

          for(let x of arr) {
            this.scene.game.physics.setCollision(bullet, x, ()=>{
              x.delete = true;
            });
          }
        }
      }

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

      let mC = camera.getMouseCoordinates();
      this.angle = Math.atan2(this.position.y - mC.y, this.position.x - mC.x);
    },
  }));

  let character = scene.createEntity(new Sprite({
    scene: scene,
    position: new Vector2(300, -100),
    angle: 0,
    imageId: 'idle',
    active: true,
    physics: false,
    data: {
    },
    update(time, ticks) {
    }
  }));

  let walk = scene.createEntity(new Animation({
      changingValue: 'image',
      entity: character,
      values: [
        scene.game.getResource('walk1'),
        scene.game.getResource('walk2'),
      ],
      framesPerChange: 20,
      active: true,
    })
  );

  let camera = scene.createCamera(new Camera({
    ctx: game.ctx,
    position: new Vector2(0, 0),
    size: new Vector2(game.width, game.height),
    active: true,
    physics: false,
    isDraw: false,
    update() {
      // зум на колесико
      if (this.scene.game.events.includes('up')) {
        this.zoom *= 1.1;
      }
      if (this.scene.game.events.includes('down')) {
        this.zoom *= 1 / 1.1;
      }

      // добаляем объекты на которые наведена мышь
      this.scene.game.mouseObjects = [];
      const mouse = this.scene.game.mouse;
      // for(let obj of this.scene.objects){
      //     if(this.pointInRect(mouse, obj)){
      //         this.scene.game.mouseObjects.push(obj);
      //     }
      // }
    },
  }));

  camera.follow = player;

  // запускаем созданную сцену
  this.setScene('start');
}

const game = new Game({
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

