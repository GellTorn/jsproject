'use strict';

const preload = function() {
    this.loadImage('rect', './image/rect.png');
    this.loadImage('box', './image/box.png');
    this.loadImage('ball', './image/ball.png');
}

const create = function() {
    let scene = this.createScene('start');

    let back = scene.createEntity(new Rectangle({
        x: 0,   
        y: 0,
        width: 500,
        height: 500,
        color: '#ccc',
        anchor: [0, 0],
        active: false,
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
                _x: 100,
                _y: 400,
            },
            point2: {
                _x: 400,
                _y: 400,
            },
            speed: 200,
            forward: true,
        },
        update(time, ticks){
            // function interpolate(x1, y1, x2, y2, x) {
            //     const y = y1 + (y2 - y1) / (x2 - x1) * (x - x1);
            //     return y;
            // }

            if(this.data.forward) {
                this._x += (this.data.point2._x - this.data.point1._x) / this.data.speed;
                this._y += (this.data.point2._y - this.data.point1._y) / this.data.speed;
                if(this.distance(this.data.point2) < 20) {
                        this.data.forward = false;
                }
            }
            else {
                this._x += (this.data.point1._x - this.data.point2._x) / this.data.speed;
                this._y += (this.data.point1._y - this.data.point2._y) / this.data.speed;
                if(this.distance(this.data.point1) < 20) {
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
        anchor: [0.5, 0.5],
        active: true,
        update(time, ticks){
            this.angle -= 0.01;
        },
    }));

    let text = scene.createEntity(new Text({
        x: 100,
        y: 200,
        width: 500,
        height: 50,
        color: 'black',
        angle: 0,
        active: false,
        anchor: [0, 0],
        text: 'wasd to control 😄',
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
        anchor: [0.5, 0.5],
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

    let sprite = scene.createEntity(new Sprite({
        scene: scene,
        x: 100,
        y: 500,
        angle: 0,
        active: false,
        imageId: 'box',
        anchor: [0.5, 0.5],
    }));

    let player = scene.createEntity(new Circle({
        x: 100,
        y: 100,
        radius: 50,
        color: 'blue',
        angle: 0,
        active: true,
        drawingType: 'stroke',
        data: {
            speed: 10,
        },
        update(time, ticks) {
            if(this.scene.game.events.includes('KeyW')){
                this.y -= this.data.speed;
            }
            if(this.scene.game.events.includes('KeyA')){
                this.x -= this.data.speed;
            }
            if(this.scene.game.events.includes('KeyS')){
                this.y += this.data.speed;
            }
            if(this.scene.game.events.includes('KeyD')){
                this.x += this.data.speed;
            }
            
            // this.angle += 0.01;
        },
    }));

    let camera = scene.createCamera(new Camera({
        ctx: game.ctx,
        x: 0,
        y: 0,
        width: game.width,
        height: game.height,
        active: true,
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
    imageSmooth: false,
    preload: preload,
    create: create,
});

