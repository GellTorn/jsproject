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

    distance(entity) {
        const dx = this._x - entity._x;
        const dy = this._y - entity._y;
        const res = Math.sqrt(dx * dx + dy * dy);
        return res;
    }
}
