class Physics {
    constructor(config = {}) {
        /** ссылка на объект игры */
        this.game = config.game || null;

        /** массив объектов коллизий, проверяются в каждом обновлении физики */
        this.collisions = [];
    }

    setCollision(obj1, obj2, callback){
        this.collisions = push({
            obj1,
            obj2,
            callback
        });
    }

    update(time, ticks) {
        for(let obj of this.game.scene.objects) {
            if(!obj.physics) {
                continue;
            }

            let friction = 0.95;

            obj.vX *= friction;
            obj.vY *= friction;
            obj.vA *= friction;

            obj.vX += obj.aX;
            obj.vY += obj.aY;
            obj.vA += obj.aA;

            obj.x += obj.vX;
            obj.y += obj.vY;
            obj.angle += obj.vA;
            
            obj.aX = 0;
            obj.aY = 0;
            obj.aA = 0;
        }
    }
}