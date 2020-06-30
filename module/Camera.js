class Camera{
    constructor(config = {}) {
        // ссылка на сцену которой пренадлежит сущность
        this.scene = config.scene || null;

        this.x = config.x || 0;
        this.y = config.y || 0;

        // скорость
        this.vX = config.vX || 0;
        this.vY = config.vY || 0;

        this.vA = config.vA || 0;

        // ускорение
        this.aX = config.aX || 0;
        this.aY = config.aY || 0;

        // размеры
        this.width = config.width || 0;
        this.height = config.height || 0;

        // угол поворота
        this._angle = config.angle || 0;

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

        // применять ли физику к объекту
        this.physics = config.physics || false;
        
        // объект за которым следует камера
        this.follow = config.follow || null;

        // зум, больше - крупнее
		this.zoom = config.zoom || 1;
   
        // список объектов на рендер
        this.displayList = [];
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
    
    getMouseCoordinates() {
        return {
            x: -(this.scene.game.mouse.x - this.x - this.width / 2),
            y: -(this.scene.game.mouse.y - this.y - this.height / 2),
        };
    }

    render() {
        // если следуем за каким-то объектом, определяем координаты камеры
        if(this.follow) {
            this.x = this.follow.x;
            this.y = this.follow.y;
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
        // сортируем по z индексу
        this.displayList.sort((a, b) => {
            return a.z - b.z;
        });

        // отрисовываем объекты
        for(let obj of this.displayList) {
            let x = obj._x;
            let y = obj._y;
            let w = obj.width;
            let h = obj.height;
            let ang = obj.angle;
            let img = obj.image;
            
            let z = this.zoom;

            this.ctx.save();
            
            this.ctx.translate(this.width / 2, this.height / 2);

            this.ctx.rotate(-this.angle);

            this.ctx.scale(z, z);

            this.ctx.translate(x - this.x, y - this.y);

            this.ctx.rotate(ang);

            obj.draw(this.ctx);

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
            this.ctx.fillRect(2, this.height / 4, 2, this.height / 4 * 3);
        }
    }
}
