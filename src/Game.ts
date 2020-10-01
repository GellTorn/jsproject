import Camera from "./Camera";
import Scene from "./Scene";
import Entity from "./Entity";
import Rectangle from "./Rectangle";
import Physics from "./Physics";
import Ellipse from "./Ellipse";
import Sprite from "./Sprite";
import Text from "./Text";
import Circle from "./Circle";
import Vector2 from "./Vector2";

export default class Game {
  /** холст */
  public canvas;
  /** версия продукта */
  public version: string;
  /** ширина холста */
  public width: number;
  /** высота холста */
  public height: number;
  /** 2D контекст рендера */
  public ctx: CanvasRenderingContext2D;
  /** цвет фона */
  public backgroudColor: string;
  /** словарь сцен */
  public scenes: Scene[];
  /** словарь ресуров (изображения, аудио, видео) */
  public resources;
  /** функция презагрузки изображений */
  public preload;
  /** функция которая вызывается после инициализации и загрузке ресурсов */
  public create;
  /** указатель на текущую сцену, только для чтения */
  public scene: Scene;
  /** физический движок */
  public physics: Physics;
  /** флаг дебага */
  public debug: boolean;
  /** количество кадров */
  public frameAmount: number;
  /** количество кадров в секунду */
  public fps: number;
  /** координаты мыши */
  public mouse: Vector2;
  /** событие мыши при клике */
  public events;
  /** объекты на которые указывает мышь */
  public mouseObjects: Entity[];

  /** интервал проверки предзагурзки */
  protected _preloadDoneInterval;
  /** отсчет фпс */
  protected _setFps;

  constructor(config: any = {}) {
    
    this.canvas = config.canvas || null;

    this.version = '0.0.1';

    this.width = config.width || 600;

    this.height = config.height || 400;
    /** ширина холста */
    this.canvas.width = this.width;
    /** высота холста */
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext('2d', {
      alpha: config.alpha
    });
    /** сглаживание изображения, нужно отключить для пиксельных игр */
    this.ctx.imageSmoothingEnabled = config.imageSmoothingEnabled || false;

    this.backgroudColor = config.backgroudColor || null;

    this.scenes = config.scenes || {};
    
    this.resources = {};
    
    this.preload = config.preload || function () { };
    
    this.create = config.create || function () { };

    this.scene = null;

    this.physics = config.physics || new Physics({
      game: this,
    });

    this.debug = config.debug || false;

    this.frameAmount = 0;

    this.fps = 0;

    this.mouse = new Vector2();

    this.events = [];

    this.mouseObjects = [];

    // запускаем события на мышь
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('click', this.onMouseClick.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('contextmenu', this.onContextMenu.bind(this));

    // запускаем события на клавиатуру
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    // событие на колесико
    window.addEventListener('wheel', this.onWheel.bind(this));

    // событие focus/blur
    // window.addEventListener('focus', this.onFocus.bind(this));
    // window.addEventListener('blur', this.onBlur.bind(this));

    // событие resize
    // window.addEventListener('resize', ()=>{
    //   this.width = window.innerWidth;
    //   this.height = window.innerHeight;
    //   this.canvas.width = this.width;
    //   this.canvas.height = this.height;
    // });

    // запускаем предзагрузку
    this.preload();

    // запускаем интервал проверки на готовность
    this._preloadDoneInterval = setInterval(this._preloadDone.bind(this), 100);

  }

  onMouseMove(event) {
    this.mouse.set(event.offsetX, event.offsetY);
  }

  onMouseClick(event) {
    event.preventDefault();
  }

  onContextMenu(event) {
    event.preventDefault();
  }

  onMouseDown(event) {
    this.events.push('mouse' + event.button);
    this.mouse.set(event.offsetX, event.offsetY);
    event.preventDefault();
  }

  onMouseUp(event) {
    const index = this.events.indexOf('mouse' + event.button);
    if (index == -1) {
      return;
    }
    this.events.splice(index, 1);
    this.mouse.set(event.offsetX, event.offsetY);
    event.preventDefault();
  }

  onKeyDown(event) {
    if (event.repeat) {
      return;
    }
    this.events.push(event.code);
    // this.checkEventCode(event, this.events);
    // event.preventDefault();
  }

  onKeyUp(event) {
    while (this.events.indexOf(event.code) != -1) {
      let index = this.events.indexOf(event.code);
      this.events.splice(index, 1);
    }
    //this.checkEventCode(event, this.events);
    event.preventDefault();
  }

  onWheel(event) {
    if (event.deltaY < 0) {
      this.events.push('up');
    }
    else if (event.deltaY > 0) {
      this.events.push('down');
    }
  }

  onFocus(event) {
    this.scene.paused = false;
  }

  onBlur(event) {
    this.scene.paused = true;
  }

  checkEventCode(event, events) {
    // events.push(event.code);
    // if(event.shiftKey) {
    //     events.push('Shift');
    // }
    // if(event.altKey) {
    //     events.push('Alt');
    // }
    // if(event.ctrlKey) {
    //     events.push('Control');
    // }
  }

  setScene(sceneId) {
    this.scene = this.scenes[sceneId];
    return this;
  }

  createScene(sceneId, config = {}) {
    let scene = new Scene(config);
    scene.game = this;
    this.scenes[sceneId] = scene;
    return scene;
  }

  check() {
    this.fps = this.frameAmount;
    this.frameAmount = 0;
  }

  loadImage(resourceId: string, source: string) {
    let image = new Image();
    this.resources[resourceId] = {
      resource: image,
      loaded: false,
    };
    image.src = source;
    image.onload = () => {
      this.resources[resourceId].loaded = true;
    };
    image.onload.bind(this);

    return this;
  }

  loadVideo(resourceId: string, source: string) {
    let video = document.createElement('video');
    video.muted = true;
    video.loop = true;

    this.resources[resourceId] = {
      resource: video,
      loaded: false,
    };
    video.src = source;
    video.onload = () => {
      this.resources[resourceId].loaded = true;
      video.play();
    };
    video.onload.bind(this);

    return this;
  }

  getResource(resourceId: string) {
    return this.resources[resourceId].resource;
  }

  _preloadDone() {
    for(let resource in this.resources) {
      if (!this.resources[resource].loaded) {
        console.log('not ready');
        return false;
      }
    }
    clearInterval(this._preloadDoneInterval);
    
    this.create();

    console.info(`Game engine v${this.version}`);
    // запускаем отрисовку
    window.requestAnimationFrame(this.update.bind(this));

    this._setFps = setInterval(this.check.bind(this), 1000);
  }

  update() {
    // назначена ли сцена
    if (this.scene == null) {
      return;
    }
    // обновления счетчиков времени
    if (!this.scene.paused) {

      this.scene.time = Date.now() - this.scene.lastTimePaused;
      this.scene.timeTick++;

      // удаляем объекты помеченные на удаление
      this.scene.objects = this.scene.objects.filter((obj) => {
        if (!obj.delete) {
          return true;
        }
        return false;
      });

      // создаем лист объектов на обновление
      this.scene.createUpdateList();

      // обновляем физику
      this.physics.update(this.scene.time, this.scene.timeTick);

      // обновляем все игровые объекты
      for (let obj of this.scene.updateList) {
        obj.update(this.scene.time, this.scene.timeTick);
      }

      // потом сцену
      this.scene.update(this.scene.time, this.scene.timeTick);
    }

    if (!this.backgroudColor) {
      // очищаем холст
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    else {
      // отрисовываем фон
      this.ctx.fillStyle = this.backgroudColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    // отрисовываем
    for (let camera of this.scene.cameras) {
      camera.render();
    }

    // информация для дебага
    if (this.debug) {
      this.ctx.textAlign = 'left';
      this.ctx.font = '8px';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText(`${this.fps} fps`, 2, 10);
      this.ctx.fillText(`camera(${this.scene.cameras[0].position.x}, ${this.scene.cameras[0].position.y}, ${this.scene.cameras[0].zoom})`, 2, 30);
      const mouse = this.scene.cameras[0].getMouseCoordinates();
      this.ctx.fillText(`mouse(${this.mouse.x}, ${this.mouse.y}) (${mouse.x}, ${mouse.y}) Mouse events: ${this.events}`, 2, 40);
      this.ctx.fillText(`mouseObjects: ${this.mouseObjects.map((item) => item.name)}`, 2, 50);
      this.ctx.fillText(`time: ${(this.scene.time / 1000).toFixed(1)} s`, 2, 20);
      let offsetX = 60;
      for (let obj of this.scene.objects) {
        if(!obj.position) {
          continue;
        }
        this.ctx.fillText(`${obj.name}(${obj.position.x}, ${obj.position.y}, ${obj.angle})`, 2, offsetX);
        offsetX += 10;
      }
    }

    // добавляем кадр к счетчику
    this.frameAmount++;

    // обновляем события
    let delEvents = ['up', 'down'];
    for (let x of delEvents) {
      while (this.events.indexOf(x) != -1) {
        let ind = this.events.indexOf(x);
        this.events.splice(ind, 1);
      }
    }
    // и по новой
    window.requestAnimationFrame(this.update.bind(this));
  }
}
