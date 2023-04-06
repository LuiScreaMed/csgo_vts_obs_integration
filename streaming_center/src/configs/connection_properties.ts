/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-06 13:46:33
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: configs for servers / clients
 */

import { Auth } from "csgo-integration/dist/data.js";

export interface Config {
    url?: string,
    password?: string,
    port?: number,
    steamid?: string,
    auth?: Auth,
    host?: string,
}

export interface Configs {
    [key: string]: Config
}

///游戏机obs相关参数
const captureObs: Config = {
    url: "192.168.100.100:4444",
}

///推流机obs相关参数
const streamObs: Config = {
    url: "192.168.100.101:4444",
};

///vts相关参数
const vts: Config = {
    url: "ws://192.168.100.101:8001",
};

///csgo相关参数
const csgo: Config = {
    port: 3003,
    steamid: "76561198109826393",
    // steamid: undefined,
    auth: {
        token: "luiscreamedathetoilet",
    }
}

const controlServer: Config = {
    port: 3001,
}

const configs: Configs = {
    captureObs,
    streamObs,
    vts,
    csgo,
    controlServer
}

export default configs;