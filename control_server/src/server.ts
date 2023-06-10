/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-06-10 23:05:13
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: 用于通过http请求控制前后端和obs的交互
 */
import http from 'http';
import ws from 'ws';
import url from 'url';
import Obs from 'obs-ws-client';
import { Event } from 'csgo-integration';

///与前端交互的后端，主要是实现转场
export default class ControlServer extends Event {
    port: number;
    server: http.Server;
    wsServer: ws.WebSocketServer;
    captureObs?: Obs;

    constructor(info: ServerInfo) {
        super();
        this.port = info.port;
        this.server = http.createServer((req, res) => this.onHttpRequest(req, res));
        ///http和ws共用端口
        this.wsServer = new ws.WebSocketServer({ server: this.server });
        ///游戏机obs
        this.captureObs = info.captureObs;
    }

    start() {
        this.wsServer.on('connection', (ws) => {
            ws.on('error', console.error);
            ws.on('message', (data) => {
                ///心跳
                try {
                    let message: any = JSON.parse(data.toString());
                    if (message.type == 'ping') {
                        ws.send('{"type": "pong"}');
                    }
                } catch (e) { console.error(e) }
            });
        });
        this.server.listen(this.port);
        console.log(`control server on: listening to ${this.port} with http and websocket`);
    }

    ///处理请求
    onHttpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "*");
        res.writeHead(200, { "Content-Type": "text/plain" });
        let params = url.parse(req.url, true).query;
        if (params["action"] !== undefined) {
            this.handleAction(params["action"].toString(), params["trigger"] ? params["trigger"].toString() : undefined);
        }
        res.end('');
    }

    ///处理action
    handleAction(action: string, trigger?: string | undefined) {
        switch (action) {
            ///转场
            case "transition": {
                let msg: string = JSON.stringify({ type: 'action', data: 'transition' });
                this.wsServer.clients.forEach((client) => {
                    client.send(msg);
                });
                break;
            }
            ///切换游戏画面
            case "toggleScreen": {
                this.captureObs?.toggleItemEnabled({
                    sceneName: "场景",
                    itemName: "screen",
                });
                break;
            }
            case "vtsTrigger": {
                this.emit("vtsTrigger", trigger);
            }
        }
    }
}

interface ServerInfo {
    port: number,
    captureObs: Obs
}