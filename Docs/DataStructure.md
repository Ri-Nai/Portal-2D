## MapEditor

使用扫描线的方法存储`Blocks`和`Edges` 

`Blocks`以条状模式存储，每层会切成很多片以计算碰撞  
但是渲染的时候仍会以单位块为单位渲染  

`Edges`同样是以条状模式存储的，并且只存储边缘  
`Edge`有成员变量 `facing`  
`facing`值如下图所示  

![facing](imgs/facing.jpeg)  
![facing](imgs/facingImage.png)  
facing值的大小体现在这边的深浅上   
