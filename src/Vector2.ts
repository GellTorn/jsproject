
export default class Vector2 {

  public x: number;

  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  toPolar() {
    return {
      p: Math.sqrt(this.x * this.x + this.y * this.y),
      q: Math.atan2(this.y, this.x),
    };
  }
}