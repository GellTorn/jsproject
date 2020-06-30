class Circle extends Entity {
    constructor(config = {}) {
        super(config);

        this.radius = config.radius || 0;

        this.drawingType = config.drawingType || 'stroke';

        this.name = this.name || 'Circle';

        // любой объект цвета или текстуры
        this.color = config.color || '#000';
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        if(this.drawingType == 'fill') {
            ctx.fill();
        }
        else if(this.drawingType == 'stroke') {
            ctx.stroke();
        }
        ctx.restore();
    }

    intersectCircle(circle) {
        // non optimized
        return this.distance(circle) < this.radius + circle.radius;
    }

    intersectPoint(point) {
        return this.distance(point) < this.radius;
    }
};
