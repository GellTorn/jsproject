'use strict';

const preload = function() {
    this.loadImage('rect', '../image/rect.png');
    this.loadImage('box', '../image/box.png');
    this.loadImage('ball', '../image/ball.png');
    this.loadImage('parrot', '../image/parrot.gif');
}

const create = function() {
    let scene = this.createScene('start');

    scene.update = (time, ticks) => {

    };

    let back = scene.createEntity(new Rectangle({
        x: 0,   
        y: 0,
        width: 10000,
        height: 10000,
        color: '#ccc',
        active: false,
        update(time, ticks) {
            this.width += 100;
            this.height += 100;
        }
    }));
    
    let rect = scene.createEntity(new Rectangle({
        x: 100,
        y: 400,
        width: 100,
        height: 50,
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
        update(time, ticks){
            // function interpolate(x1, y1, x2, y2, x) {
            //     const y = y1 + (y2 - y1) / (x2 - x1) * (x - x1);
            //     return y;
            // }

            if(this.data.forward) {
                
                this.x += this.data.speed;
                if(this.distance(this.data.point2) <= 0) {
                    this.data.forward = false;
                }
            }
            else {
                this.x -= this.data.speed;
                if(this.distance(this.data.point1) <= 0) {
                    this.data.forward = true;
                }
            }
        },
    }));

    let ellipse = scene.createEntity(new Ellipse({
        x: 100,
        y: 300,
        width: 100,
        height: 50,
        color: 'green',
        active: true,
        physics: true,
        update(time, ticks) {
            this.aA = -0.005;
        }
    }));

    let text = scene.createEntity(new Text({
        x: 0,
        y: -200,
        width: 500,
        height: 50,
        color: 'black',
        drawingType: 'fill',
        angle: 0,
        text: 'WASD to control',
        active: false,
    }));

    let circle = scene.createEntity(new Circle({
        x: 200,
        y: 100,
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
            if(this.data.grow) {
                this.radius += this.data.growSpeed;
                if(this.radius >= this.data.maxSize) {
                    this.data.grow = false;
                }
            }
            else {
                this.radius -= this.data.growSpeed;
                if(this.radius <= this.data.minSize) {
                    this.data.grow = true;
                }
            }
        }
    }));

    let circle2 = scene.createEntity(new Circle({
        x: 0,
        y: 0,
        radius: 25,
        width: 50,
        height: 50,
        color: 'yellow',
        drawingType: 'fill',
        active: true,
        update(time, ticks) {
            let x0 = 500;
            let y0 = 200;
            let radius = 100;
            let startAngle = 0;
            let angle = time / 200; // aka speed
            this.x = x0 + Math.sin(angle + startAngle) * radius;
            this.y = y0 + Math.cos(angle + startAngle) * radius;
        }
    }));

    let box = scene.createEntity(new Sprite({
        scene: scene,
        x:-200,
        y: 0,
        width: 100,
        height: 200,
        angle: 0,
        active: false,
        imageId: 'box',
    }));

    let ball = scene.createEntity(new Sprite({
        scene: scene,
        x:-200,
        y: -300,
        width: 100,
        height: 100,
        angle: 0,
        imageId: 'ball',
        active: true,
        physics: true,
        update(time, ticks) {
            this.aA = 0.005;
        }
    }));

    let player = scene.createEntity(new Circle({
        x: 0,
        y: 0,
        radius: 50,
        width: 50,
        height: 50,
        color: 'blue',
        angle: 0,
        active: true,
        physics: true,
        drawingType: 'stroke',
        name: 'player',
        data: {
            speed: 1,
            reload: false,
            timeToReload: 0,
        },
        update(time, ticks) {
            let shot = () => {
                this.scene.createEntity(new Circle({
                    x: this.x,
                    y: this.y,
                    aX: Math.cos(this.angle) * 50,
                    aY: Math.sin(this.angle) * 50,
                    radius: 4,
                    color: 'black',
                    angle: this.angle,
                    active: true,
                    physics: true,
                    drawingType: 'fill',
                    name: 'bullet',
                    data: {
                        time: time,
                        delay: 1000 * 0.9,
                    },
                    update(time, ticks) {
                        if(this.data.time + this.data.delay < time) {
                            this.delete = true;
                        }
                    }
                }));
            }

            if(this.scene.game.events.includes('KeyW')){
                this.applyForce(0, -this.data.speed);
            }
            else if(this.scene.game.events.includes('KeyS')){
                this.applyForce(0, this.data.speed);
            }

            if(this.scene.game.events.includes('KeyA')){
                this.applyForce(-this.data.speed, 0);
            }
            else if(this.scene.game.events.includes('KeyD')){
                this.applyForce(this.data.speed, 0);
            }

            if(this.scene.game.events.includes('Space') || this.scene.game.events.includes('mouse0')){
                if(ticks > this.data.timeToReload + 10){
                    this.data.reload = false;
                }
                if(!this.data.reload) {
                    shot();
                    this.data.reload = true;
                    this.data.timeToReload = ticks;
                }
            }
            
            let mC = camera.getMouseCoordinates();
            this.angle = Math.atan2(this.y - mC.y, this.x - mC.x);

        },
    }));

    let camera = scene.createCamera(new Camera({
        ctx: game.ctx,
        x: 0,
        y: 0,
        width: game.width,
        height: game.height,
        active: true,
        physics: false,
        update() {
			// зум на колесико
            if(this.scene.game.events.includes('up')) {
				this.zoom *= 1.1;
            }
            if(this.scene.game.events.includes('down')){
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
    physics: 'matter',
    preload: preload,
    create: create,
});

