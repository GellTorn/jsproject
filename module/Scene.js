class Scene {
    constructor(config = {}){
        // ссылка на объект игры
        this.game = config.game || null;

        // лист камер
        this.cameras = config.cameras || [];

        // присваиваем каждой камере указатель на сцену
        for(let camera of this.cameras) {
            camera.scene = this;
        }

        // лист объектов сцены
        this.objects = config.objects || [];

        // присваиваем каждой объекту указатель на сцену
        for(let obj of this.objects) {
            obj.scene = this;
        }

        // лист объектов которые будут обновленны при каждом тике игры
        this.updateList = [];

        // время создания сцены
        this.createTime = Date.now();

        // время когда сцену в последний раз поставили на паузу
        this.lastTimePaused = this.createTime;

        // активное время сцены
        this.time = 0;

        // время прошедшее с момента создания сцены в тиках
        this.timeTick = 0;

        // обновлять ли сцену
        this._paused = config.paused || false;

        // функция обновления, вызывется после обновления объектов
        this.update = config.update || function(){};
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
        for(let obj of this.objects) {
            if(obj.active){
                this.updateList.push(obj);
            }
        }
        for(let camera of this.cameras) {
            if(camera.active){
                this.updateList.push(camera);
            }
        }
        
        return this;
    }

    set paused(value) {
        if(value){
            this.lastTimePaused = Date.now();
        }
        this._paused = value;
        return this;
    }

    get paused() {
        return this._paused;
    }
}
