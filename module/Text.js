class Text extends Rectangle {
    constructor(config = {}) {
        super(config);

        this.name = 'Text';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';

        this.drawingType = config.drawingType || 'stroke';

        this._text = config.text || '';
        this.font = config.font || `${this.height}px sans-serif`;
    }

    set text(value) {
        this._text = value;
        return this;
    }

    get text() {
        return this._text;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.textAlign = 'left';
        ctx.font = this.font;

        let w = ctx.measureText(this.text).width;

        if(this.drawingType == 'fill') {
            ctx.fillText(this.text, -w / 2, this.height / 2);
        }
        else if(this.drawingType == 'stroke') {
            ctx.strokeText(this.text, -w / 2, this.height / 2);
        }
        
        ctx.restore();
    }
};
