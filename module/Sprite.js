class Sprite extends Entity {
    constructor(config) {
        super(config);

        this.imageId = config.imageId || '';

        this.image = this.scene.game.getImage(this.imageId);

        this.width = this.image.width;
        this.height = this.image.height;

        this.name = this.name || 'Sprite';
    }
};
