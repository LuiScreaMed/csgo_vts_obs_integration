# csgo_vts_obs_integration
一个集成了与csgo、vts、obs和其他直播前端交互的项目，是一个个人直播的中控中心。

---

### 项目介绍
1. 使用和修改了 [Sonic853 的 CSGO 交互项目](https://github.com/853Lab/CSGO_Gamestate_Live2dViewerEX_demo)，整合了不同的事件回调
2. 包装了一个 [VTubeStudioJS](https://github.com/Hawkbat/VTubeStudioJS) 客户端，用于和Vtube Studio进行Websocket交互，实现对表情或者热键进行调整和触发
3. 包装了一个 [obs-websocket-js](https://github.com/obs-websocket-community-projects/obs-websocket-js) 客户端，用于和Obs Studio进行Websocket交互，实现对Obs的源可见等进行调整
4. 架设了一个主要用于 [直播前端](https://github.com/LuiScreaMed/luis-beefweb-streaming-frontend) 转场的交互后端

---

### 各依赖的文档参考
- [Counter-Strike:_Global_Offensive_Game_State_Integration](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration)
- [VTubeStudio](https://github.com/DenchiSoft/VTubeStudio)
- [obs-websocket protocal](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md)

---

### 使用教程
1. 在 `streaming_center/src/configs/connection_properties.ts` 中配置csgo、vts、obs和交互后端的配置信息：
    - csgo的配置信息需要包含：
        - `port: number` ***服务端的端口**
        - `steamid: string` 需要监听的steamid（当该steam用户为第一人称时监听，该项为空时则不论谁的第一人称视角都有事件回调）
        - `auth.token: string` 用于和检查csgo发来请求的auth.token，为空时则不检查
    - vts的配置信息需要包含：
        - `url: string` ***连接VTS websocket的url（带端口）**（如: 127.0.0.1:8001）
    - 推流obs的配置信息需要包含：
        - `url: string` ***连接OBS websocket的url（带端口）**（如: 127.0.0.1:4455）
    - 交互后端的配置信息需要包含：
        - `port: number` ***服务端的端口**
1. 将 `csgo_integration/gamestate_integration_luis.cfg` 文件复制到 `CSGO根目录/csgo/cfg/` 中，如需要修改，请参考 [CSGO Integration文档](#各依赖的文档参)，其中的 `port` 对应 [使用教程](#使用教程) 中 csgo 配置项的端口 `port`
1. 根目录中依次运行以下命令编译代码（需要提前安装tsc）：
    ```
    npm install
    npm run build
    ```
1. 运行
    ```
    npm run start
    ```

---

### 主要交互流程
- **CSGO与VTS、OBS的交互**
    1. 通过 `csgo_integration` 获取当前第一人称玩家的信息，并发出事件，如 `生命值` `mvp` 等事件
    2. 通过包装好的 `csgo` 实例对事件进行回调，通过回调操控OBS和VTS实现不同效果
- **直播界面前后端**
    1. 通过 http 请求通知后端转场（比如我的情况是使用 [TouchPortal](https://www.touch-portal.com/) 点击实现obs转场的同时通知后端）
    2. 后端通过 Websocket 广播在直播界面中的前端web，进行转场动画

---

有任何的问题和建议欢迎提出
