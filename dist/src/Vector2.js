var Vector2 = (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.fromVector = function (vector) {
        return new Vector2(vector.x, vector.y);
    };
    Vector2.fromArray = function (array) {
        return new Vector2(array[0], array[1]);
    };
    Vector2.prototype.set = function (x, y) {
        if (y === void 0) { y = x; }
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.setToPolar = function (azimuth, radius) {
        if (radius === void 0) { radius = 1; }
        this.x = Math.cos(azimuth) * radius;
        this.y = Math.sin(azimuth) * radius;
        return this;
    };
    Vector2.prototype.equals = function (v) {
        return ((this.x === v.x) && (this.y === v.y));
    };
    Vector2.prototype.angle = function () {
        var angle = Math.atan2(this.y, this.x);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    };
    Vector2.prototype.setAngle = function (angle) {
        return this.setToPolar(angle, this.length());
    };
    Vector2.prototype.add = function (src) {
        this.x += src.x;
        this.y += src.y;
        return this;
    };
    Vector2.prototype.subtract = function (src) {
        this.x -= src.x;
        this.y -= src.y;
        return this;
    };
    Vector2.prototype.multiply = function (src) {
        this.x *= src.x;
        this.y *= src.y;
        return this;
    };
    Vector2.prototype.divide = function (src) {
        this.x /= src.x;
        this.y /= src.y;
        return this;
    };
    Vector2.prototype.scale = function (value) {
        if (isFinite(value)) {
            this.x *= value;
            this.y *= value;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    };
    Vector2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vector2.prototype.distance = function (src) {
        var dx = src.x - this.x;
        var dy = src.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Vector2.prototype.distanceSq = function (src) {
        var dx = src.x - this.x;
        var dy = src.y - this.y;
        return dx * dx + dy * dy;
    };
    Vector2.prototype.length = function () {
        var x = this.x;
        var y = this.y;
        return Math.sqrt(x * x + y * y);
    };
    Vector2.prototype.setLength = function (length) {
        return this.normalize().scale(length);
    };
    Vector2.prototype.lengthSq = function () {
        var x = this.x;
        var y = this.y;
        return x * x + y * y;
    };
    Vector2.prototype.normalize = function () {
        var x = this.x;
        var y = this.y;
        var len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = x * len;
            this.y = y * len;
        }
        return this;
    };
    Vector2.prototype.normalizeRightHand = function () {
        var x = this.x;
        this.x = this.y * -1;
        this.y = x;
        return this;
    };
    Vector2.prototype.normalizeLeftHand = function () {
        var x = this.x;
        this.x = this.y;
        this.y = x * -1;
        return this;
    };
    Vector2.prototype.dot = function (src) {
        return this.x * src.x + this.y * src.y;
    };
    Vector2.prototype.cross = function (src) {
        return this.x * src.y - this.y * src.x;
    };
    Vector2.prototype.lerp = function (src, t) {
        if (t === void 0) { t = 0; }
        var ax = this.x;
        var ay = this.y;
        this.x = ax + t * (src.x - ax);
        this.y = ay + t * (src.y - ay);
        return this;
    };
    Vector2.prototype.reset = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    Vector2.prototype.limit = function (max) {
        var len = this.length();
        if (len && len > max) {
            this.scale(max / len);
        }
        return this;
    };
    Vector2.prototype.reflect = function (normal) {
        normal = Vector2.fromVector(normal).normalize();
        return this.subtract(normal.scale(2 * this.dot(normal)));
    };
    Vector2.prototype.mirror = function (axis) {
        return this.reflect(axis).negate();
    };
    Vector2.prototype.rotate = function (delta) {
        var cos = Math.cos(delta);
        var sin = Math.sin(delta);
        return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    };
    Vector2.prototype.toPolar = function () {
        return {
            p: Math.sqrt(this.x * this.x + this.y * this.y),
            q: Math.atan2(this.y, this.x),
        };
    };
    return Vector2;
}());
export default Vector2;
