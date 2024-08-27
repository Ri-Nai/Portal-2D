class Player extends Entity {
    static PlayerSize = new Vector(1.2 * basicSize, 1.8 * basicSize);
    constructor(position) {
        super(position, Player.PlayerSize);
        this.facing = 1;
    }

    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        this.updateXY(deltaTime,
            () => {
                let moveLeft = window.$game.inputManager.isKeysDown([ "A", "Left" ]);
                let moveRight = window.$game.inputManager.isKeysDown([ "D", "Right" ]);
                let move = 0;
                if (moveLeft)
                    this.facing = move = -1;
                if (moveRight)
                    this.facing = move = 1;
                return move;
            },
            () => {
                return window.$game.inputManager.firstDown("Space", () => {
                    this.jumping.setJumpBuffer();
                });
            },
            true
        );
    }

}
