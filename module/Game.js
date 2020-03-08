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

    createScene(sceneId, config = {}) {
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
