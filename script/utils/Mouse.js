class MouseManager {
    /**
     * Control mouse lock and input
     * @param {HTMLElement} container
     */
    constructor(container, canvas) {
        this.canvas = canvas;
        this.container = container;
        this.isCapture = false;
        this.ratio = this.canvas.width / this.container.clientWidth;
        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;

        /**
         * @readonly
         * @type {boolean}
         */
        this.left = false;

        /**
         * @readonly
         * @type {boolean}
         */
        this.right = false;

        this.clickable = false;

        this.container.addEventListener('click', () => this.capture());
        this.container.addEventListener('mousemove', (e) => this.move(e));
        this.container.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.container.addEventListener('mouseup', (e) => this.mouseUp(e));

        document.addEventListener('pointerlockchange', () => this.uncapture());
        document.addEventListener('visibilitychange', () => this.blur());
    }

    async capture() {
        if (!this.isCapture) {
            await this.container.requestPointerLock({
                unadjustedMovement: false,
            });

            this.isCapture = true;
            setTimeout(() => {
                this.clickable = true;
            }, 200);
        }
    }

    blur() {
        if (document.visibilityState === 'hidden') {
            document.exitPointerLock();
            this.uncapture();
        }
    }

    uncapture() {
        console.debug("uncapture: ", document.pointerLockElement, this.container);
        console.debug("uncapture: ", document.pointerLockElement !== this.container);
        if (document.pointerLockElement !== this.container) {
            this.isCapture = false;
            window.$game.pause();
        }
        this.clickable = false;
    }

    /**
     *
     * @param {MouseEvent} e
     */
    mouseDown(e) {
        e.preventDefault();
        if (!this.clickable) return;
        if (e.button === 0) {
            this.left = true;
        }
        if (e.button === 2) {
            this.right = true;
        }
    }

    mouseUp(e) {
        e.preventDefault();
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
        e.preventDefault();
        if (this.isCapture) {
            this.ratio = this.canvas.width / this.container.clientWidth;
            this.x += e.layerX - this.prevX;
            this.y += e.layerY - this.prevY;

            this.prevX = e.layerX;
            this.prevY = e.layerY;

            this.x += e.movementX * this.ratio;
            this.y += e.movementY * this.ratio;
            // console.log(this.x, this.y, this.ratio);
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (this.x > this.canvas.width) {
                this.x = this.canvas.width;
            }
            if (this.y > this.canvas.height) {
                this.y = this.canvas.height;
            }
        }
    }

    draw() {
        window.$game.ctx.drawImage(window.$game.textureManager.getTexture("cursor"), 12, 9, 16, 22, this.x - 4, this.y - 5, 16, 22);
    }

    get position() {
        return new Vector(this.x, this.y);
    }
}
