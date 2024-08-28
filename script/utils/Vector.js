class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    getAxis(axis) {
        return axis === 0 ? this.x : this.y;
    }
    /**
     * 向量加法（传入标量）
     * @param {number} x
     * @param {number} y
     * @returns {Vector}
     */
    add(x, y) {
        return new Vector(this.x + x, this.y + y);
    }

    /**
     * 向量加法（传入向量）
     * @param {Vector} v
     * @returns {Vector}
     */
    addVector(v) {
        return this.add(v.x, v.y);
    }

    /**
     * 向量减法（传入标量）
     * @param {number} x
     * @param {number} y
     * @returns {Vector}
     */
    sub(x, y) {
        return this.add(-x, -y);
    }

    /**
     * 向量减法（传入向量）
     * @param {Vector} v
     * @returns {Vector}
     */
    subVector(v) {
        return this.sub(v.x, v.y);
    }

    // 原地加法（加向量并更新自身值）
    addEqual(v) {
        this.x += v.x;
        this.y += v.y;
        return this;  // 为了链式调用
    }

    // 原地减法（减向量并更新自身值）
    subEqual(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;  // 为了链式调用
    }

    // 标量乘法
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    // 向量的长度（模）
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // 归一化向量（单位向量）
    normalize() {
        const mag = this.magnitude();
        return mag === 0 ? new Vector(0, 0) : new Vector(this.x / mag, this.y / mag);
    }

    // 点积
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    // 旋转向量，参数是旋转角度（弧度）
    rotate(angle) {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);

        const newX = this.x * cosTheta - this.y * sinTheta;
        const newY = this.x * sinTheta + this.y * cosTheta;

        return new Vector(newX, newY);
    }

    // 获取向量的角度（弧度）
    angle() {
        return Math.atan2(this.y, this.x);
    }
    round() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }
}
const copyVector = (vector) => {
    return new Vector(vector.x, vector.y);
}
