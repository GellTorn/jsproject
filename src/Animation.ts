import Scene from "./Scene";
import Entity from "./GameObjects/Entity";

export default class Animation {
  /** ссылка на сцену которой пренадлежит анимация */
  public scene: Scene;
  /** ссылка на сцену которой пренадлежит анимация */
  public entity: Entity;
  /** значение которое будет менять со временем */
  public changingValue: any;
  /** массив значений */
  public values: any[];
  /** номер текущего значения */
  public currentValue: number;
  /** через сколько кадров изменить анимацию */
  public framesPerChange: number;
  /** текущий кадр */
  public currentFrame: number;
  /** флаг обновления */
  public active: boolean;
  /** количество повторений, -1 для беконечного количества */
  public repeat: number;
  /** после завершения возврщается обратно */
  public yoyo: boolean;
  /** Имя объекта */
  public name: string;

  constructor(config: any = {}) {
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

  update(time: number, ticks: number): void {
    this.currentFrame++;
    if(this.currentFrame === this.framesPerChange) {
      this.currentValue++;
      if(this.currentValue >= this.values.length) {
          this.currentValue = 0;
      }
      this.entity[this.changingValue] = this.values[this.currentValue];
      this.currentFrame = 0;
    }
  }

  start(): void {
    this.active = false;
  }

  stop(): void {
    this.active = true;
  }
}
