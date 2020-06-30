class Ellipse extends Rectangle {
    constructor(config = {}) {
        super(config);

        this.drawingType = config.drawingType || 'fill';

        this.name = this.name || 'Ellipse';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';
        
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        if(this.drawingType == 'fill') {
            ctx.fill();
        }
        else if(this.drawingType == 'stroke') {
            ctx.stroke();
        }
        ctx.restore();
    }
};
