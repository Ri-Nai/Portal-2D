## MapEditor

使用扫描线的方法存储Blocks和Edges<br>

Blocks以条状模式存储，每层会切成很多片以计算碰撞<br>

Edges同样是以条状模式存储的，并且只存储边缘<br>
对Edge的type存储写法是$(x + 4) \times 4 + facing$<br>
x是在excel里填的数字的值<br>
取出$facing$值的方法就是$type \% 4$<br>
取出$x$值的方法就是$\lfloor{\frac{type}{4} - 4}\rfloor$<br>

facing值如下图所示<br>

![facing](imgs/facing.jpeg)
![facing](imgs/facingImage.png)
facing值的大小体现在这边的深浅上<br>
