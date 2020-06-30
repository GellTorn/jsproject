class Rectangle extends Entity {
    constructor(config = {}) {
        super(config);

        // размеры
        this.width = config.width || 0;
        this.height = config.height || 0;

        this.drawingType = config.drawingType || 'fill';

        this.name = this.name || 'Rectangle';
        // любой объект цвета или текстуры
        this.color = config.color || '#000';
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        if(this.drawingType == 'fill') {
            ctx.fill();
        }
        else if(this.drawingType == 'stroke') {
            ctx.stroke();
        }
        ctx.restore();
    }

    intersectPoint(point) {
        const hw = this.width / 2;
        const hh = this.height / 2;
        
		const dist = this.distance(point);

		const res = {
			x: Math.cos(this.angle) * dist,
			y: Math.sin(this.angle) * dist,
		};

		if(res.x > hw || res.x < -hw ||
			res.y > hh || res.y < -hh) {
			return false;
		}
		return true;
    }

    intersectAABB(rect) {
        if(Math.abs(this.x - rect.x) > this.hw + rect.hw)
            return false;
        if(Math.abs(this.y - rect.y) > this.hh + rect.hh)
            return false;
    return true;
    }
};
