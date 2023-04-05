/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-05 23:53:03
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: csgo/vts/obs integration
 */

import CsgoServer, { Events, CsgoEventHandler, CsgoData } from "csgo-integration";
import Obs from "obs-ws-client";
import Vts from "vtube-studio-ws-client";
import { Config } from "../configs/connection_properties.js";
import { callbacks } from "./callback_list.js";

///包装好的csgo事件回调
export default class Csgo {
    port?: number;
    host?: string;
    observeSteamId?: string;
    auth?: CsgoData.Auth;
    server: CsgoServer;
    obs?: Obs;
    vts?: Vts;
    constructor(config: Config, obs?: Obs, vts?: Vts) {
        this.port = config.port;
        this.host = config.host;
        this.observeSteamId = config.steamid;
        this.auth = config.auth;
        this.server = null;
        this.obs = obs;
        this.vts = vts;
    }

    ///启用csgo交互服务器
    start() {
        this.server = new CsgoServer({ port: this.port, observeSteamId: this.observeSteamId, auth: this.auth });
        ///设置csgo的事件，这里设置了生命值、mvp、被雷的事件
        this.server.setHandler([Events.healthEvent, Events.mvpEvent, Events.nadeEvent]);
        let handler: CsgoEventHandler = this.server.handler;
        ///初始化csgo事件回调
        this.initHandlerCallback(handler);
        this.server.start();
    }

    ///初始化csgo事件回调
    initHandlerCallback(handler: CsgoEventHandler) {
        Object.keys(callbacks).forEach((key: string) => {
            handler.on(key, callbacks[key].bind(this));
        });
    }
}