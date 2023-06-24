// mapEntity.js

class MapEntity {
    constructor(options = {}) {
        this.x = options.x;
        this.y = options.y;
        this.type = options.type;
        this.direction = options.direction;
        this.hasMoved = false;
        this.owner = options.owner;
    }
}

module.exports = MapEntity;