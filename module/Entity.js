class Entity {
    constructor(config = {}) {
        // ссылка на сцену которой пренадлежит сущность
        this.scene = config.scene || null;

        /** body */
        this.body = config.body || {};

        // координаты
        this._x = config.x || 0;
        this._y = config.y || 0;

        this._z = config.z || 0;

        // скорость
        this.vX = config.vX || 0;
        this.vY = config.vY || 0;
        this.vA = config.vA || 0;

        // ускорение
        this.aX = config.aX || 0;
        this.aY = config.aY || 0;
        this.aA = config.aA || 0;

        // масса
        this.mass = config.mass || 1;

        // обновлять ли объект
        this.active = config.active || false;

        // применять ли физику к объекту
        this.physics = config.physics || false;

        // угол поворота
        this._angle = config.angle || 0;

        // якорь, влияет на истинные координаты объекта
        // вектор, значения от 0 до 1 включая
        // this.anchor = config.anchor || [0.5, 0.5];

        // флаг на удаление
        this.delete = false;

        // имя объекта
        this.name = config.name || null;

        // для пользовательских переменных
        this.data = config.data || {};

        // функция обновления объекта
        this.update = config.update || function() {};
    }

    set x(value) {
        this._x = value;
        return this;
    }

    get x() {
        let res = Math.round(this._x);
        return res;
    }

    set y(value) {
        this._y = value;
        return this;
    }

    get y() {
        let res = Math.round(this._y);
        return res;
    }

    set z(value) {
        this._y = value;
        return this;
    }

    get z() {
        let res = Math.round(this._z);
        return res;
    }

    get hw() {
        return this.width / 2;
    }

    get hh() {
        return this.height / 2;
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

    toPolar() {
        return {
            p: Math.sqrt(this.x * this.x + this.y * this.y),
            q: Math.atan2(this.y, this.x),
        };
    }

    // функции для создания: draw, update, offscreen
    offscreen(camera) {
        if(this.distance(camera) > 2000) {
            return false;
        }
        return true;
    }

    distance(entity) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const res = Math.sqrt(dx * dx + dy * dy);
        return res;
    }

    applyForce(x, y) {
        this.aX += x / this.mass;
        this.aY += y / this.mass;

        return this;
    }
}
