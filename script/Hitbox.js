class Hitbox {
    constructor(position, size) {
        this.position = position;  // 左下角位置
        this.size = size;          // 宽度和高度作为一个 Vector
    }

    // 获取左下角点的位置（就是 position）
    getBottomLeft() {
        return this.position;
    }

    // 获取右上角点的位置
    getTopRight() {
        return this.position.plus(this.size);
    }

    // 移动 hitbox，更新左下角位置
    move(newPosition) {
        this.position = newPosition;
    }

    // 检查某点是否在 hitbox 内
    contains(point) {
        const bottomLeft = this.getBottomLeft();
        const topRight = this.getTopRight();

        return (
            point.x >= bottomLeft.x && point.x <= topRight.x &&
            point.y >= bottomLeft.y && point.y <= topRight.y
        );
    }

    toString() {
        const bottomLeft = this.getBottomLeft();
        const topRight = this.getTopRight();
        return `Hitbox(BottomLeft: ${bottomLeft}, TopRight: ${topRight})`;
    }
}
