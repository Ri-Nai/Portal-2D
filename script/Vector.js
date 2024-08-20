class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // 向量加法
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    // 向量减法
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
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

}
