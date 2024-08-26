class Player extends Entity {

    constructor(position, size) {
        super(position, size);
        this.facing = 1;
        this.isSpaceHeld = false;
    }

    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        this.updateXY(deltaTime,
            () => {
                let moveLeft = window.$game.keyboard.isKeysDown([ "A", "Left" ]);
                let moveRight = window.$game.keyboard.isKeysDown([ "D", "Right" ]);
                let move = 0;
                if (moveLeft)
                    this.facing = move = -1;
                if (moveRight)
                    this.facing = move = 1;
                return move;
            },
            () => {
                if (window.$game.keyboard.isKeyDown("Space")) {
                    if (!this.isSpaceHeld)
                        this.jumping.setJumpBuffer();
                    this.isSpaceHeld = true;
                }
                else
                    this.isSpaceHeld = false;
                return this.isSpaceHeld;
            });
    }

}
