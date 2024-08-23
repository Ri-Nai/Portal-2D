class MouseManager {
    /**
     * Control mouse lock and input
     * @param {HTMLCanvasElement} ctx
     */
    constructor(ctx) {
        this.ctx = ctx;
        this.isCapture = false;

        this.x = this.ctx.width / 2;
        this.y = this.ctx.height / 2;

        /**
         * @readonly
         * @type {boolean}
         */
        this.left = false

        /**
         * @readonly
         * @type {boolean}
         */
        this.right = false

        this.clickable = false

        this.ctx.addEventListener('click', () => this.capture());
        this.ctx.addEventListener('mousemove', (e) => this.move(e))
        this.ctx.addEventListener('mousedown', (e) => this.mouseDown(e))
        this.ctx.addEventListener('mouseup', (e) => this.mouseUp(e))

        document.addEventListener('pointerlockchange', () => this.uncapture())
    }

    capture() {
        if (!this.isCapture) {
            this.ctx.requestPointerLock({
                unadjustedMovement: false,
            })

            this.isCapture = true;
            setTimeout(() => {
                this.clickable = true
            }, 200)
        }
    }

    uncapture() {
        console.debug("uncapture: ", document.pointerLockElement, this.ctx);
        console.debug("uncapture: ", document.pointerLockElement !== this.ctx)
        if (document.pointerLockElement !== this.ctx) {
            this.isCapture = false;
        }
        this.clickable = false;
    }

    /**
     *
     * @param {MouseEvent} e
     */
    mouseDown(e) {
        if (!this.clickable) return ;
        if (e.button === 0) {
            this.left = true;
        }
        if (e.button === 2) {
            this.right = true;
        }
    }

    mouseUp(e) {
        if (e.button === 0) {
            this.left = false;
        }
        if (e.button === 2) {
            this.right = false;
        }
    }

    /**
     *
     * @param {MouseEvent} e
     */
    move(e) {
        if (this.isCapture) {
            this.x += e.movementX;
            this.y += e.movementY;

            if (this.x < 0) {
                this.x = 0;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (this.x > this.ctx.width) {
                this.x = this.ctx.width;
            }
            if (this.y > this.ctx.height) {
                this.y = this.ctx.height;
            }
        }
    }

    draw() {
        window.$game.ctx.fillStyle = 'white';
        window.$game.ctx.fillRect(this.x, this.y, 6, 6);
        window.$game.ctx.fillStyle = 'black';
        window.$game.ctx.fillRect(this.x + 1, this.y + 1, 4, 4);
    }

    get position() {
        return new Vector(this.x, this.y);
    }
}
