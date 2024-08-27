class Player extends Entity {

    constructor(position, size) {
        super(position, size);
        this.facing = 1;
    }

    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        this.updateXY(deltaTime,
            () => {
                let moveLeft = window.$game.inputmanager.isKeysDown([ "A", "Left" ]);
                let moveRight = window.$game.inputmanager.isKeysDown([ "D", "Right" ]);
                let move = 0;
                if (moveLeft)
                    this.facing = move = -1;
                if (moveRight)
                    this.facing = move = 1;
                return move;
            },
            () => {
                return window.$game.inputmanager.firstDown("Space", () => {
                    this.jumping.setJumpBuffer();
                });
            },
            true
        );
    }

}
