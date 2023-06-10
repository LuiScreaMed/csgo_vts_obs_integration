/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-06-10 23:14:42
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: main entry
 */
import Csgo from "./csgo/csgo.js";
import Obs from "obs-ws-client";
import Vts from "vtube-studio-ws-client";
// import http from "http";
import { Config, Configs } from "./configs/connection_properties.js";
import ControlServer from "control-server";


export default class StreamingCenter {
    configs: Configs;
    /* csgo数据通讯 */
    csgo?: Csgo;
    /* 游戏机obs */
    captureObs?: Obs;
    /* 推流机obs */
    streamObs?: Obs;
    /* vts */
    vts?: Vts;
    /* 交互服务器 */
    controlServer?: ControlServer;

    constructor(configs: Configs) {
        this.configs = configs;
        this.csgo = null;
        this.streamObs = null;
        this.captureObs = null;
        this.vts = null;
        this.controlServer = null;
    }

    start() {
        this.streamObs = this.initObs(this.configs.streamObs);
        this.captureObs = this.initObs(this.configs.captureObs);
        this.vts = this.initVts(this.configs.vts);
        this.csgo = this.initCsgo(this.configs.csgo, this.streamObs, this.vts);
        this.controlServer = this.initControlServer(this.configs.controlServer, this.captureObs);
    }

    ///初始化obs连接
    initObs(config: Config): Obs {
        if (config.url === undefined) {
            throw "obs url cannot be empty";
        }
        let obs = new Obs({ url: config.url, password: config.password });
        obs.connect();
        return obs;
    }

    ///初始化VTS连接
    initVts(config: Config): Vts {
        if (config.url === undefined) {
            throw "vts url cannot be empty";
        }
        let vts = new Vts({ url: config.url });
        vts.connect();
        return vts;
    }

    ///初始化csgo数据通讯
    initCsgo(config: Config, obs?: Obs, vts?: any): Csgo {
        let csgo = new Csgo(config, obs, vts);
        csgo.start();
        return csgo;
    }

    ///初始化交互服务器
    initControlServer(config: Config, captureObs?: Obs): ControlServer {
        let controlServer = new ControlServer({ port: config.port, captureObs: captureObs });
        controlServer.start();
        controlServer.on("vtsTrigger", this.onVtsTrigger);
        return controlServer;
    }

    onVtsTrigger(triggerName: string | undefined) {
        if (!triggerName) return;
        this.vts?.triggerHotkey({ triggerName });
    }
}