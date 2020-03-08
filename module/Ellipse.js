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
