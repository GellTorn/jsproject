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
