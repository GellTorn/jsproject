class Text extends Entity {
    constructor(config) {
        super(config);

        this.name = this.name || 'Text';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';
        
        this._text = config.text || '';
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

    set text(value) {
        this._text = value;
        this.redraw = true;
        return this;
    }

    get text() {
        return this._text;
    }

    draw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = 'left';
        this.ctx.font = this.font;
        this.ctx.fillText(this.text, 0, this.height);
        this.ctx.restore();
        this.redraw = false;
    }
};
