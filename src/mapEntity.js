// mapEntity.js

class MapEntity {
    constructor(x, y, type, direction, owner, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.moveDirection = direction;
        this.shootDirection = -1;
        this.hasMoved = false;
        this.owner = owner;
        this.color = color;
        this.needsToExplode = false;
    }
}

module.exports = MapEntity;