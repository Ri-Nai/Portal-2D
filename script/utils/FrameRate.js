class FrameRate {
    /**
     * @type {DOMHighResTimeStamp}
     */
    startTime

    /**
     * @type {number}
     */
    frame = 0

    /**
     * @type {HTMLSpanElement}
     */
    fps

    constructor () {
        this.startTime = performance.now()
        this.fps = document.querySelector("#fps")
    }

    /**
     *
     * @param {number} timestamp
     */
    display(timestamp) {
        this.frame ++;
        let interval = timestamp - this.startTime

        this.fps.innerText = Math.ceil(this.frame / (interval / 1000))

        if (interval / 1000 > 5) {
            this.frame = 0
            this.startTime = performance.now()
        }
    }
}
