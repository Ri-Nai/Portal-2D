class Hitbox {
    /**
     *
     * @param {Vector} position
     * @param {Vector} size
     */
    constructor(position, size) {
        this.position = position;  // 左下角位置
        this.size = size;          // 宽度和高度作为一个 Vector
    }

    // 获取左上角点的位置（就是 position）
    getTopLeft() {
        return this.position;
    }

    // 获取右下角点的位置
    getBottomRight() {
        return this.position.addVector(this.size);
    }

    // 检查某点是否在 hitbox 内
    contains(point) {
        const topLeft = this.getTopLeft();
        const bottomRight = this.getBottomRight();

        return (
            point.x >= topLeft.x && point.x <= bottomRight.x &&
            point.y >= topLeft.y && point.y <= bottomRight.y
        );
    }

    hit(other) {
        const thisLeft = this.getTopLeft().x;
        const thisRight = this.getBottomRight().x;
        const thisTop = this.getTopLeft().y;
        const thisBottom = this.getBottomRight().y;

        const otherLeft = other.getTopLeft().x;
        const otherRight = other.getBottomRight().x;
        const otherTop = other.getTopLeft().y;
        const otherBottom = other.getBottomRight().y;

        // 检查是否不相交
        if (
            thisRight <= otherLeft ||  // this 在 other 的左边
            thisLeft >= otherRight ||  // this 在 other 的右边
            thisTop >= otherBottom ||  // this 在 other 的下面
            thisBottom <= otherTop     // this 在 other 的上面
        ) {
            return false;  // 没有碰撞
        }

        return true;  // 有碰撞
    }
}
