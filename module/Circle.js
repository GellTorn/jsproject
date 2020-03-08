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
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
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
