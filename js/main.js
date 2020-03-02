'use strict';

class Game {
    constructor(config) {
        // холст
        this.canvas = config.canvas || null;
        // запоминаем высоту холста и ширину
        this.width = config.width || 600;
        this.height = config.height || 400;
        // устанавливаем
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        // контекст рендера
        this.ctx = this.canvas.getContext('2d', {alpha: config.alpha});
        // сглаживание изображения, нужно отключить для пиксельных игр
        this.ctx.imageSmoothingEnabled = config.imageSmooth || true;
        // словарь сцен
        this.scenes = config.scenes || {};
        // словарь изображений
        this.images = {};
        // функция презагрузки изображений
        this.preload = config.preload || function() {};
        // функция которая вызывается после загрузки всех изображений
        this.create = config.create || function() {};
        // указатель на текущую сцену
        // только для чтения
        this.scene = null;
        // флаг дебага, для пользовательского использования
        this.debug = config.debug || false;
        // количество кадров
        this.frameAmount = 0;
        // количество кадров в секунду
        this.fps = null;
        // координаты мыши
        this.mouse = {
            x: 0,
            y: 0,
        };
        // событие мыши при клике
        this.events = [];
        // обекты на которые указывает мышь
        this.mouseObjects = [];
        // запускаем события на мышь
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('contextmenu', this.onContextMenu.bind(this));
        // запускаем события на клавиатуру
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        // событие на колесико
        window.addEventListener('wheel', this.onWheel.bind(this));
        // запускаем предзагрузку
        this.preload();
        // запускаем интервал проверки на готовность
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
        if(index == -1) {
            return;
        }
        this.events.splice(index, 1);
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        event.preventDefault();
    }

    onKeyDown(event) {
        if(event.repeat){
            return;
        }
        this.events.push(event.code);
        this.checkEventCode(event, this.events);
        // event.preventDefault();
    }

    onKeyUp(event) {
        while(this.events.indexOf(event.code) != -1) {
            let index = this.events.indexOf(event.code);
            this.events.splice(index, 1);
        }
        this.checkEventCode(event, this.events);
        event.preventDefault();
    }

    onWheel(event) {
        if(event.deltaY < 0) {
            this.events.push('up');
        }
        else if(event.deltaY > 0) {
            this.events.push('down');
        }
    }

    checkEventCode(event, events) {
        // events.push(event.code);
        // if(event.shiftKey) {
        //     events.push('Shift');
        // }
        // if(event.altKey) {
        //     events.push('Alt');
        // }
        // if(event.ctrlKey) {
        //     events.push('Control');
        // }
    }

    setScene(sceneId) {
        this.scene = this.scenes[sceneId];
        return this;
    }

    createScene(sceneId, config) {
        let scene = new Scene(config);
        scene.game = this;
        this.scenes[sceneId] = scene;
        return scene;
    }

    check() {
        this.fps = this.frameAmount;
        this.frameAmount = 0;
    }

    loadImage(imageId, source) {
        let image = new Image()
        this.images[imageId] = image;
        image.src = source;
        image.loaded = false;
        image.onload = function(){
            image.loaded = true;
        };
        image.onload.bind(this);

        return this;
    }

    getImage(imageId) {
        return this.images[imageId];
    }

    _preloadDone() {
        for(let image in this.images) {
            if(image.false) {
                console.log('not ready');
                return false;
            }
        }
        clearInterval(this._preloadDoneInterval);
        // 
        this.create();
        // запускаем отрисовку
        window.requestAnimationFrame(this.update.bind(this));
        // отсчет фпс, нужно переделать
        this._setFps = setInterval(this.check.bind(this), 1000);
    }

    update() {
        // назначена ли сцена
        if(this.scene == null){
            return;
        }
        // обновления счетчиков времени
        if(!this.scene.paused){

            this.scene.time = Date.now() - this.scene.lastTimePaused;
            this.scene.timeTick++;
            
            // создаем лист объектов на обновление
            this.scene.createUpdateList();
            
            // обновляем все игровые объекты
            for(let obj of this.scene.updateList){
                obj.update(this.scene.time, this.scene.timeTick);
            }

            // потом сцену
            this.scene.update(this.scene.time, this.scene.timeTick);
        }
        // очищаем холст
        this.ctx.clearRect(0, 0, this.width, this.height);
        // отрисовываем
        for(let camera of this.scene.cameras){
            camera.render();
        }
        // информация для дебага
        if(this.debug) {
            this.ctx.textAlign = 'left';
            this.ctx.font = '8px';
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(`${this.fps} fps`, 2, 10);
            this.ctx.fillText(`camera(${this.scene.cameras[0].x},${this.scene.cameras[0].y},${this.scene.cameras[0].zoom})`, 2, 30);
            this.ctx.fillText(`mouse(${this.mouse.x},${this.mouse.y}) Event(${this.events})`, 2, 40);
            this.ctx.fillText(`mouseObjects(${ this.mouseObjects.map( (item) => item.name ) })`, 2, 50);
            this.ctx.fillText(`time:${(this.scene.time / 1000).toFixed(1)} s`, 2, 20);
            let x = 60;
            for(let obj of this.scene.objects){
                this.ctx.fillText(`${obj.name}(${obj.x},${obj.y},${obj.angle})`, 2, x);
                x += 10;
            }
        }
        // добавляем кадр к счетчику
        this.frameAmount++;
        // обновляем события
        let delEvents = ['up', 'down'];
        for(let x of delEvents) {
            while(this.events.indexOf(x) != -1) {
                let ind = this.events.indexOf(x);
                this.events.splice(ind, 1);
            }
        }
        // и по новой
        window.requestAnimationFrame(this.update.bind(this));
    }
}

class Scene {
    constructor(config){
        // ссылка на объект игры
        this.game = config.game || null;

        // лист камер
        this.cameras = config.cameras || [];

        // присваиваем каждой камере указатель на сцену
        for(let camera of this.cameras) {
            camera.scene = this;
        }

        // лист объектов сцены
        this.objects = config.objects || [];

        // присваиваем каждой объекту указатель на сцену
        for(let obj of this.objects) {
            obj.scene = this;
        }

        // лист объектов которые будут обновленны при каждом тике игры
        this.updateList = [];

        // время создания сцены
        this.createTime = Date.now();

        // время когда сцену в последний раз поставили на паузу
        this.lastTimePaused = this.createTime;

        // активное время сцены
        this.time = 0;

        // время прошедшее с момента создания сцены в тиках
        this.timeTick = 0;

        // обновлять ли сцену
        this._paused = config.paused || false;

        // функция обновления, вызывется после обновления объектов
        this.update = config.update || function(){};
    }

    createCamera(config) {
        let camera = new Camera(config);
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
        for(let obj of this.objects) {
            if(obj.active){
                this.updateList.push(obj);
            }
        }
        for(let camera of this.cameras) {
            if(camera.active){
                this.updateList.push(camera);
            }
        }
    }

    set paused(value) {
        if(value){
            this.lastTimePaused = Date.now();
        }
        this._paused = value;
        return this;
    }

    get paused() {
        return this._paused;
    }
}

class Camera{
    constructor(config) {
        // ссылка на сцену которой пренадлежит сущность
        this.scene = config.scene || null;

        this.x = config.x || 0;
        this.y = config.y || 0;
        // скорость
        // this.vX = config.vX || 0;
        // this.vY = config.vY || 0;
        // // ускорение
        // this.aX = config.aX || 0;
        // this.aY = config.aY || 0;
        // размеры
        this.width = config.width || 0;
        this.height = config.height || 0;

        // функция обновления объекта
        this.update = config.update || function(){};

        this.name = 'Camera';
		// контекст рендера
		if(config.ctx){
			this.ctx = config.ctx;
		}
		else {
			this.image = document.createElement('canvas');
			this.image.width = this.width;
			this.image.height = this.height;
			this.ctx = this.image.getContext('2d');
		}

        // координаты камеры на холсте
        // this.canvasX = config.canvasX || 0;
        // this.canvasY = config.canvasY || 0;
        // // размеры камеры на холсте
        // this.canvasWidth = config.canvasWidth || 0;
        // this.canvasHeight = config.canvasHeight || 0;

        // обновлять ли объект
        this.active = config.active || false;
        // объект за которым следует камера
        this.follow = config.follow || null;
        // зум, больше - крупнее
		this.zoom = config.zoom || 1;
        this.dz = 0;
        // изменение высоты и ширины
		this.dw = 0;
		this.dh = 0;
        // список объектов на рендер
        this.displayList = [];
	}

    viewportPointToWorld(point) {
		const res = {
			x: this.x + point.x,
			y: this.x + point.y,
		};
		return res;
    }

	pointInRect(point, rect) {
		const hw = rect.width / 2;
		const hh = rect.height / 2;
		const cx = rect._x + hw;
		const cy = rect._y + hh;
		const dx = cx - point._x;
		const dy = cy - point._y;

		const dist = Math.sqrt(dx * dx + dy * dy);

		const res = {
			x: Math.cos(rect.angle) * dist,
			y: Math.sin(rect.angle) * dist,
		};

		if(res.x > hw || res.x < -hw ||
			res.y > hh || res.y < -hh) {
			return false;
		}
		return true;
	}

    render() {
        // если следуем за каким-то объектом, определяем координаты камеры
        if(this.follow) {
            this.x = Math.round(this.follow.x - this.follow.width * this.follow.anchor[0]);
            this.y = Math.round(this.follow.y - this.follow.height * this.follow.anchor[1]);
        }
        // создаем лист отрисовки
        this.displayList = [];
        for(let obj of this.scene.objects) {
            if(obj.name == 'Camera') {
                continue;
            }
            if(obj.offscreen(this)) {
                this.displayList.push(obj);
            }
        }
        // отрисовываем объекты
        for(let obj of this.displayList) {
            if(obj.redraw) {
                obj.draw();
            }

            let x = obj._x;
            let y = obj._y;
            let w = obj.width;
            let h = obj.height;
            let anc = obj.anchor;
            let ang = obj.angle;
			let img = obj.image;
            let z = this.zoom;

            this.ctx.save();
            
            this.ctx.translate(this.width / 2, this.height / 2);

            this.ctx.scale(z, z);

            this.ctx.translate(x - this.x, y - this.y);

            this.ctx.rotate(ang);

            this.ctx.drawImage(img, 0, 0, img.width, img.height, -w * anc[0], -h * anc[1], w, h);

            if(this.scene.game.debug) {
                this.ctx.strokeStyle = 'red';
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(50, 0);
                this.ctx.stroke();

                // this.ctx.beginPath();
                // this.ctx.moveTo(0, -25);
                // this.ctx.lineTo(0, 25);
                // this.ctx.stroke();
            }

            this.ctx.restore();
        }

        if(this.scene.game.debug) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            this.ctx.fillRect(this.width / 2 - 1, this.height / 2 - 1, 2, 2);
        }
    }
}

class Entity {
    constructor(config) {
        // ссылка на сцену которой пренадлежит сущность
        this.scene = config.scene || null;
        // координаты
        this._x = config.x || 0;
        this._y = config.y || 0;
        // скорость
        // this.vX = config.vX || 0;
        // this.vY = config.vY || 0;
        // // ускорение
        // this.aX = config.aX || 0;
        // this.aY = config.aY || 0;
        // размеры
        this.width = config.width || 0;
        this.height = config.height || 0;
        // обновлять ли объект
        this.active = config.active || false;
        // применять ли физику к объекту
        this.physics = config.physics || false;
        // угол поворота
        this._angle = config.angle || 0;
        // якорь, влияет на истинные координаты объекта
        // вектор, значения от 0 до 1 включая
        this.anchor = config.anchor || [0.5, 0.5];
        // имя объекта
        this.name = config.name || null;
        // для пользовательских переменных
        this.data = config.data || {};
        // функция обновления объекта
        this.update = config.update || function(){};
        // нужно ли перерисовать
        this.redraw = false;
    }

    set x(value) {
        this._x = value - this.width * this.anchor[0];
        return this;
    }

    get x() {
        let res = Math.round(this._x + this.width * this.anchor[0]);
        return res;
    }

    set y(value) {
        this._y = value - this.height * this.anchor[1];
        return this;
    }

    get y() {
        let res = Math.round(this._y + this.height * this.anchor[1]);
        return res;
    }

    set angle(value) {
        const max = Math.PI * 2;
        if(value > max){
            value -= max;
        }
        else if(value < -max){
            value += max;
        }
        this._angle = Math.round(value * 1000) / 1000;
        return this;
    }

    get angle() {
        return this._angle;
    }
    // функции для создания: draw, update, offscreen
    offscreen() {
        return true;
    }
}

class Rectangle extends Entity {
    constructor(config) {
        super(config);

        this.drawingType = config.drawingType || 'fill';

        this.name = this.name || 'Rectangle';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';

        // изображение объекта
        this.image = document.createElement('canvas');
        this.image.width = this.width;
        this.image.height = this.height;
        this.ctx = this.image.getContext('2d');
        // ставим флаг на отрисовку
        this.redraw = true;
    }

    draw() {
        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.rect(0, 0, this.width, this.height);
        if(this.drawingType == 'fill') {
            this.ctx.fill();
        }
        else if(this.drawingType == 'stroke') {
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.redraw = false;
    }
};

class Sprite extends Entity {
    constructor(config) {
        super(config);

        this.imageId = config.imageId || '';

        this.image = this.scene.game.getImage(this.imageId);

        this.width = this.image.width;
        this.height = this.image.height;

        this.name = this.name || 'Sprite';
    }
};

class Circle extends Entity {
    constructor(config) {
        super(config);

        this._radius = config.radius || 0;
        this.width = this._radius * 2;
        this.height = this._radius * 2;

        this.drawingType = config.drawingType || 'fill';

        this.name = this.name || 'Circle';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';

        // изображение объекта
        this.image = document.createElement('canvas');
        this.image.width = this.width;
        this.image.height = this.height;
        this.ctx = this.image.getContext('2d');
        // ставим флаг на отрисовку
        this.redraw = true;
    }

    set radius(value) {
        this._radius = value;
        this.width = value * 2;
        this.height = value * 2;
        return this;
    }

    get radius() {
        return this._radius;
    }

    draw() {
        console.log('draw');
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.radius * 2, this.radius * 2);
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
        if(this.drawingType == 'fill') {
            this.ctx.fill();
        }
        else if(this.drawingType == 'stroke') {
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.redraw = false;
    }
};

class Ellipse extends Entity {
    constructor(config) {
        super(config);

        this.drawingType = config.drawingType || 'fill';

        this.name = this.name || 'Ellipse';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';
        // изображение объекта
        this.image = document.createElement('canvas');
        this.image.width = this.width;
        this.image.height = this.height;
        this.ctx = this.image.getContext('2d');
        // ставим флаг на отрисовку
        this.redraw = true;
    }
    
    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.ellipse(this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        if(this.drawingType == 'fill') {
            this.ctx.fill();
        }
        else if(this.drawingType == 'stroke') {
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.redraw = false;
    }
};

class Text extends Entity {
    constructor(config) {
        super(config);

        this.name = this.name || 'Text';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';
        
        this.text = config.text || '';
        this.font = config.font || `${this.height}px sans-serif`;
        //this.width = this.ctx.measureText(this.text).width;

        // изображение объекта
        this.image = document.createElement('canvas');
        this.image.width = this.width;
        this.image.height = this.height;
        this.ctx = this.image.getContext('2d');
        // ставим флаг на отрисовку
        this.redraw = true;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = 'left';
        this.ctx.font = this.font;
        this.ctx.fillText(this.text, 0, this.height);
        this.ctx.restore();
        this.redraw = false;
    }
};

// движок вверху
// игра снизу

const preload = function() {
    this.loadImage('rect', './image/rect.png');
    this.loadImage('box', './image/box.png');
    this.loadImage('ball', './image/ball.png');
}

const create = function() {
    let scene = this.createScene('start', {
        objects: [
            new Rectangle({
                x: 0,   
                y: 0,
                width: 500,
                height: 500,
                color: '#ccc',
                anchor: [0, 0],
                active: false,
            }),
            new Rectangle({
                x: 100,
                y: 400,
                width: 100,
                height: 50,
                color: 'violet',
                angle: 0,
                anchor: [0.5, 0.5],
                active: false,
                drawingType: 'fill',
                update(time, ticks){
                    function interpolate(x1, y1, x2, y2, x) {
                        const y = y1 + (y2 - y1) / (x2 - x1) * (x - x1);
                        return y;
                    }
                    const point1 = [100, 400];
                    const point2 = [400, 500];
    
                    let speed = 0.01;
    
                    let vX = (point2[0] - point1[0]) * speed;
                    let vY = (point2[1] - point1[1]) * speed;
                    //const x = (time * 0.4 % (point2[0] - point1[0])) + point1[0];
                    this.x += vX;
                    this.y += vY;
                },
            }),
            new Ellipse({
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
            }),
            new Ellipse({
                x: 0,
                y: 0,
                width: 50,
                height: 50,
                color: 'yellow',
                anchor: [0.5, 0.5],
                active: true,
                update(time, ticks) {
                    let x0 = 400;
                    let y0 = 300;
                    let radius = 100;
                    let startAngle = 0;
                    let angle = time / 200; // aka speed
                    this.x = x0 + Math.sin(angle + startAngle) * radius;
                    this.y = y0 + Math.cos(angle + startAngle) * radius;
                },
            }),
            new Text({
                x: 100,
                y: 200,
                width: 250,
                height: 50,
                color: 'pink',
                angle: 0,
                active: false,
                anchor: [0, 0],
                text: 'TesT 123 !',
            }),
           
        ],
        update(time, ticks){
            if(this.game.mouseEvent == 'mousedown' && this.game.mouseObjects.length) {
                this.cameras[0].follow = this.game.mouseObjects[this.game.mouseObjects.length - 1];
            }
        },
    });

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

    let camera = scene.createCamera({
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
    });

    // запускаем созданную сцену
    this.setScene('start');

    camera.follow = player;
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

