class Player extends Entity {

    static BufferTime = 3;
    static RunSpeed = 6;
    static CoyoteTime = 10;
    static JumpSpeed = -16;
    static JumpHBoost = 4;
    static Gravity = 1.6;
    static LowGravityThreshold = 4;
    static FallSpeed = 10;
    static FastFallMul = 1.5;

    constructor(position, size) {
        super(position, size);
    }
    isOnGround() {
        let hitbox = this.hitbox;
        let hitboxes = game.map.blocks;
        ++hitbox.position.y;
        for (let hit of hitboxes)
            if (hit.hit(hitbox))
                return True;
        return False;
    }

}
