var Animation = (function () {
    function Animation(config) {
        if (config === void 0) { config = {}; }
        this.scene = config.scene || null;
        this.entity = config.entity || null;
        this.changingValue = config.changingValue || null;
        this.values = config.values || [];
        this.currentValue = config.currentValue || 0;
        this.framesPerChange = config.framesPerChange || 1;
        this.currentFrame = config.currentFrame || 0;
        this.active = config.active || false;
        this.repeat = config.repeat || -1;
        this.yoyo = config.yoyo || false;
        this.name = config.name || 'Animation';
    }
    Animation.prototype.update = function (time, ticks) {
        this.currentFrame++;
        if (this.currentFrame === this.framesPerChange) {
            this.currentValue++;
            if (this.currentValue >= this.values.length) {
                this.currentValue = 0;
            }
            this.entity[this.changingValue] = this.values[this.currentValue];
            this.currentFrame = 0;
        }
    };
    Animation.prototype.run = function () {
        this.active = false;
    };
    Animation.prototype.stop = function () {
        this.active = true;
    };
    return Animation;
}());
export default Animation;
