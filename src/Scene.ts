import Game from "./Game";
import Camera from "./Camera";
import Entity from "./Entity";

export default class Scene {
  /** ссылка на объект игры */
  public game: Game;
  /** лист камер */
  public cameras: Camera[];
  /** лист объектов сцены */
  public objects: Entity[];
  /** лист объектов которые будут обновленны при каждом тике игры */
  public updateList: Entity[];
  /** время создания сцены */
  public createTime: number;
  /** время когда сцену в последний раз поставили на паузу */
  public lastTimePaused: number;
  /** активное время сцены */
  public time: number;
  /** время прошедшее с момента создания сцены в тиках */
  public timeTick: number;
  /** функция обновления, вызывется после обновления объектов */
  public update;

  /** обновлять ли сцену */
  protected _paused: boolean;

  constructor(config: any = {}) {

    this.game = config.game || null;

    this.cameras = config.cameras || [];

    // присваиваем каждой камере указатель на сцену
    for (let camera of this.cameras) {
      camera.scene = this;
    }

    this.objects = config.objects || [];

    // присваиваем каждой объекту указатель на сцену
    for (let obj of this.objects) {
      obj.scene = this;
    }

    this.updateList = [];

    this.createTime = Date.now();

    this.lastTimePaused = this.createTime;

    this.time = 0;

    this.timeTick = 0;

    this._paused = config.paused || false;

    this.update = config.update || function () { };
  }

  createCamera(camera) {
    camera.scene = this;
    this.cameras.push(camera);
    return camera;
  }

  createEntity(entity) {
    entity.scene = this;
    this.objects.push(entity);
    return entity;
  }

  createUpdateList() {
    this.updateList = [];
    for (let obj of this.objects) {
      if (obj.active) {
        this.updateList.push(obj);
      }
    }
    for (let camera of this.cameras) {
      if (camera.active) {
        this.updateList.push(camera);
      }
    }

    return this;
  }

  set paused(value) {
    if (value) {
      this.lastTimePaused = Date.now();
    }
    this._paused = value;
  }

  get paused() {
    return this._paused;
  }
}
