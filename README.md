# 乐奈与抹茶奇境：传送
北理大二计院小学期互联网开发应用基础作业  
由：光圈科技爱猫TV制作
### 项目概况

#### 项目名称
《乐奈与抹茶奇境：传送》

#### 项目类型
基于 HTML5、CSS3 和 JavaScript 平台的像素风格平台跳跃游戏。

#### 项目来源
- 《传送门》（Portal）
- 《蔚蓝》(Celeste)
- 《Bang Dream! It’s MyGO!!!!!》

### 项目具体内容

#### 剧情
- **主线剧情**：乐奈的异世界冒险。
- **剧情发展方向**：逐步揭示异世界背后的秘密。

### 项目技术
#### 
使用
#### 代码结构
```
D:.
│  .editorconfig
│  .gitignore
│  game.html
│  index.html
│  LICENSE
│  outro.html
│  README.md
│
├─assets
│  │  dialog.svg
│  │
│  ├─audios
│  │     BGMs.json
│  │     Sounds.json
│  │
│  ├─ico
│  │
│  ├─imgs
│  │  │  Textures.json
│  │  │
│  │  ├─CG
│  │  │
│  │  ├─textures
│  │  │
│  │  └─Tidbits
│  │
│  ├─stages
│  │  │  achievements.json
│  │  │  RunAll.py
│  │  │
│  │  ├─events
│  │  │
│  │  ├─maps
│  │  │  │
│  │  │  └─MapEditor
│  │  │          AddSheet.py
│  │  │          MapCreator.py
│  │  │
│  │  └─viewdatas
│  │
│  └─style
│
├─docs
│  │  DataStructure.md
│  │
│  └─imgs
│
├─pages
│  ├─about-us
│  │  │  index.html
│  │  │  styles.css
│  │  │
│  │  ├─images
│  │  │
│  │  └─members
│  │
│  └─login
│          login.html
│          login.js
│
└─script
    │  Game.js
    │  PortalGun.js
    │  View.js
    │
    ├─Entities
    │      Bullet.js
    │      Cube.js
    │      Entity.js
    │      Gel.js
    │      GLaDOS.js
    │      Player.js
    │
    ├─Events
    │      AchievementEvent.js
    │      Button.js
    │      Camera.js
    │      Door.js
    │      DramaEvent.js
    │      DramaEventList.js
    │      Event.js
    │      EventList.js
    │      Parfait.js
    │      ViewSwitch.js
    │      Wire.js
    │
    ├─Managers
    │      AchievementManager.js
    │      DataManager.js
    │      DialogManager.js
    │      EventManager.js
    │      InputManager.js
    │      MapManager.js
    │      SoundManager.js
    │      TextureManager.js
    │
    ├─Tiles
    │      Edge.js
    │      GelDispenser.js
    │      GelledEdgeList.js
    │      Portal.js
    │      Tile.js
    │
    └─utils
            AchievementDisp.js
            Auth.js
            DeadScreen.js
            Draw.js
            FrameRate.js
            Hitbox.js
            Keyboard.js
            Mouse.js
            Save.js
            Scroll.js
            Splash.js
            Store.js
            Vector.js
```

##### 主要代码讲解
1. `Game.js`：游戏主类，负责游戏状态的更新和渲染。
2. `View.js`：视图类，负责游戏界面的绘制。
3. `Managers`：管理器，负责管理各种游戏资源的加载、更新和交互控制等。
4. `Entities`：实体类，负责管理游戏中的各种实体的物理状态，由`Entity.js`中的`Entity`类继承。
5. `Events`：事件类，负责管理游戏中的各种事件，由`Event.js`中的`Event`类继承。
6. `Tiles`：瓷砖类，负责管理游戏中 various tiles，由`Tile.js`中的`Tile`类继承。
7. `utils`：工具类，负责管理各种工具函数，如存储更新、数学等。
8. `MapEditor`：地图编辑器，负责编辑地图，包括地图的创建、编辑、保存等。从 Excel 表格和 JSON 数据中读取地图数据，并生成对应的地图文件。  
可自定义地图，方法如下:  
> 在`assets/stages/maps/MapEditor`目录下，新建一个 Excel 表格（或者从源代码中复制一个已有的表格）
> 要求拥有和原有的表格相同的 Sheet  
> 在表中的各层写入瓷砖信息编号，正数为入为实块，负数代表背景层，id详见`assets/imgs/Textures.json`  
> 在`assets/stages/events`目录下新建JSON文件，文件名与表格名相同，如`Map.json`，用于存储事件，事件类型详见`scripts/Managers/EventManager.js`  
> 在`assets/stages/viewdatas`目录下新建JSON文件，文件名与表格名相同，如`Map.json`，用于存储实体初始化信息，如位置等。

