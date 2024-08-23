## MapEditor

使用扫描线的方法存储Blocks和Edges 

Blocks以条状模式存储，每层会切成很多片以计算碰撞  

Edges同样是以条状模式存储的，并且只存储边缘  
对Edge的type存储写法是$(id + 4) \times 4 + facing$  
id是在excel里填的数字的值 
取出$facing$值的方法就是$type \% 4$ 
取出$id$值的方法就是$\lfloor{\frac{type}{4} - 4}\rfloor$ 

facing值如下图所示  

![facing](imgs/facing.jpeg)  
![facing](imgs/facingImage.png)  
facing值的大小体现在这边的深浅上   
