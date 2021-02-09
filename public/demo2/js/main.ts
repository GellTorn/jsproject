import Game from "../../../src/Game";
import Entity from "../../../src/GameEntities/Entity";
import Camera from "../../../src/GameEntities/Camera";
import Rectangle from "../../../src/GameEntities/Rectangle";
import Vector2 from "../../../src/Vector2";

class Tower extends Entity {
  color: string;

  shotRadius: number;

  damage: number;

  shotTime: number;

  projectileSpeed: number;

  enemyList: Enemy[];

  target: Enemy;

  constructor(config: any = {}) {
    super(config);

    this.active = true;

    this.isDraw = true;

    this.physics = false;

    this.name = 'Tower';

    this.color = '#3c9139';

    this.shotRadius = 200;

    this.damage = 1;
    // sec
    this.shotTime = 0.7;

    this.projectileSpeed = 10;

    this.enemyList = config.enemyList || [];

    this.target = null;

    this.update = function(time, ticks): void {
      this.angle += 0.01;

      this.target = this.enemyList.reduce((distance, enemy) => {
        const distanceBetween = this.position.distance(enemy.position);
        if(distanceBetween < distance) {
          return distanceBetween;
        }
        return distance;
      }, Infinity);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(-15,25);
    ctx.lineTo(25,0);
    ctx.lineTo(-15,-25);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, this.shotRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  shot(target: Enemy): void {

  }
}

class Enemy extends Entity {
  color: string;

  hp: number;

  speed: number;

  constructor(config = {}) {
    super(config);

    this.active = true;

    this.isDraw = true;

    this.physics = false;

    this.color = '#a82727';

    this.name = 'Enemy';

    this.hp = 3;

    this.speed = 2;

    this.update = function(time, ticks): void {
      if(this.hp <= 0) {
        this.delete = true;
        return;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = this.color;

    const radius = 12;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Bullet extends Entity {
  color: string;

  speed: number;

  constructor(config = {}) {
    super(config);

    this.active = true;

    this.isDraw = true;

    this.physics = false;

    this.color = '#000';

    this.name = 'Bullet';

    this.speed = 2;

    this.update = function(time, ticks): void {
      
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = this.color;

    const radius = 4;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}


const preload = function () {
  
}

const create = function () {
  const scene = this.createScene('level 1');

  const enemyList = [];

  const background = scene.createEntity(new Rectangle({
    scene,
    position: new Vector2(0, 0),
    size: new Vector2(2000, 2000),
    active: false,
    physics: false,
    isDraw: true,
    color: '#ccc'
  }));

  const tower1 = scene.createEntity(new Tower({
    scene,
    position: new Vector2(0, 0),
    angle: 0,
    enemyList
  }));

  const enemy1 = scene.createEntity(new Enemy({
    scene,
    position: new Vector2(100, 50),
    angle: 0,
  }));

  const testBullet = scene.createEntity(new Bullet({
    scene,
    position: new Vector2(100, 100),
    angle: 0,
  }));

  const camera = scene.createCamera(new Camera({
    ctx: game.ctx,
    position: new Vector2(0, 0),
    size: new Vector2(game.width, game.height),
    active: true,
    physics: false,
    isDraw: false,
    update() {
      // зум на колесико
      if (this.scene.game.events.includes('up')) {
        if(this.zoom <= 4) {
          this.zoom *= 1.1;
        } 
      }
      if (this.scene.game.events.includes('down')) {
        if(this.zoom >= 1.1) {
          this.zoom *= 1 / 1.1;
        } 
      }
    },
  }));

  // запускаем созданную сцену
  this.setScene('level 1');
}

const game = new Game({
  canvas: document.getElementById('canvas'),
  width: innerWidth,
  height: innerHeight,
  debug: true,
  alpha: true,
  imageSmoothingEnabled: false,
  backgroudColor: '#fff',
  preload: preload,
  create: create,
});
