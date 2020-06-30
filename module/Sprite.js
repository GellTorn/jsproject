class Sprite extends Rectangle {
    constructor(config = {}) {
        super(config);

        this.imageId = config.imageId || '';

        this.image = this.scene.game.getResource(this.imageId);

        this.name = this.name || 'Sprite';
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
             -this.width / 2, -this.height / 2, this.width, this.height);
    }
};
