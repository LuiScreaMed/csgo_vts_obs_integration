/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-10 23:58:27
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: obs client
 */

import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";
import { OBSRequestTypes, OBSResponseTypes } from "obs-websocket-js/dist/types";
import { timeout } from "utils";

export interface ObsInfo {
    url: string,
    password?: string,
}

///包装好的obs客户端
export default class Obs {
    url: string;
    password?: string;
    obs: OBSWebSocket;
    sceneItems: SceneItems;

    constructor(info: ObsInfo) {
        this.url = info.url;
        this.password = info.password;
        this.obs = this.initObs();
        this.sceneItems = {};
    }

    ///初始化obs客户端
    initObs(): OBSWebSocket {
        let obs = new OBSWebSocket();
        ///连接后获取所有场景源
        obs.on("ConnectionOpened", () => {
            console.log(`OBS connected: ${this.url}`);
            timeout(() => this.getAllItems(), 1000);
        });
        ///断开重连
        obs.on("ConnectionClosed", (item: OBSWebSocketError) => {
            if (item.code !== 1006) {
                console.log(`OBS disconnected: ${this.url}`);
                // console.log(`OBS reconnect in 5s...:  ${this.url}`);
            };
            this.reconnect();
        });
        ///源更改
        obs.on("SceneItemCreated", this.onItemCreated);
        obs.on("SceneItemRemoved", this.onItemRemoved);
        return obs;
    }

    ///连接
    async connect() {
        if (!this.url) throw ('OBS ERROR: ip or port cannot be empty');
        if (!this.url.startsWith('ws://')) this.url = `ws://${this.url}`;
        try {
            await this.obs.connect(this.url, this.password);
        } catch (e) {
            // console.error(e);
        }
    }

    ///重新连接
    async reconnect() {
        await this.disconnect();
        timeout(() => this.connect(), 5000);
    }

    ///发送请求
    async send<Type extends keyof OBSRequestTypes>(requestType: Type, requestData?: OBSRequestTypes[Type]): Promise<OBSResponseTypes[Type] | boolean> {
        if (!this.obs.identified) return false;
        if (requestType === undefined) return false;
        try {
            let res = await this.obs.call(requestType, requestData);
            return res;
        } catch (e) {
            console.error(e)
            return false;
        }
    }

    ///断开连接
    async disconnect() {
        try {
            await this.obs.disconnect();
        } catch (e) { console.error(e); }
    }

    ///连接建立后获取所有源，免去每次对源进行操作时获取id的操作
    async getAllItems() {
        if (JSON.stringify(this.sceneItems) !== "{}") return;
        try {
            ///获取场景列表
            let scenes = (await this.obs.call("GetSceneList")).scenes;
            for (let sceneInfo of scenes as { sceneName: string, sceneIndex: number }[]) {
                let scene: ItemIndex = {};
                ///获取场景内的源，该请求只获取场景内的第一层源（不包括组内的），很狗血
                let items = (await this.obs.call("GetSceneItemList", { sceneName: sceneInfo.sceneName })).sceneItems;
                for (let itemInfo of items as { sourceName: string, sceneItemId: number, [key: string]: any }[]) {
                    scene[itemInfo.sourceName] = itemInfo.sceneItemId;
                    // console.log(scene);
                }
                ///插入缓存
                this.sceneItems[sceneInfo.sceneName] = scene;
            }
            console.log(this.sceneItems);
        } catch (e) {
            console.error(e)
        }
    }

    ///切换源可见
    async toggleItemEnabled(data: {
        sceneName: string,
        itemName: string,
    }) {
        let scene = this.sceneItems[data.sceneName];
        if (scene === undefined || scene[data.itemName] === undefined) return;
        console.log(`OBS: toggle item enabled: sceneName: ${data.sceneName}, itemName: ${data.itemName}, itemId: ${this.sceneItems[data.sceneName][data.itemName]}`);
        ///查询源当前的可见状态
        this.send("GetSceneItemEnabled", { sceneName: data.sceneName, sceneItemId: scene[data.itemName] }).then((res) => {
            if (res === true || res === false) return;
            let enabled = res.sceneItemEnabled;
            this.send("SetSceneItemEnabled", { sceneItemEnabled: !enabled, sceneItemId: scene[data.itemName], sceneName: data.sceneName });
        }).catch(console.log);
    }

    ///设置源是否可见
    async setItemEnabled(data: {
        sceneName: string,  //场景名
        itemName: string,   //源名
        enabled: boolean    //是否可见
    }) {
        let scene = this.sceneItems[data.sceneName];
        if (scene === undefined || scene[data.itemName] === undefined) return;
        console.log(`OBS: setting item enabled: sceneName: ${data.sceneName}, itemName: ${data.itemName}, itemId: ${this.sceneItems[data.sceneName][data.itemName]}, enabled: ${data.enabled}`);
        await this.send("SetSceneItemEnabled", { sceneItemEnabled: data.enabled, sceneItemId: scene[data.itemName], sceneName: data.sceneName });
    }

    ///当OBS中添加源时，更新缓存的场景源列表
    onItemCreated(item: {
        sceneName: string;  //场景名
        sourceName: string;   //源名
        sceneItemId: number;   //源id
        sceneItemIndex: number;   //源图层
    }) {
        this.sceneItems[item.sceneName] = {
            ...this.sceneItems[item.sceneName],
            [item.sourceName]: item.sceneItemId,
        }
    }

    ///当OBS中移除源时，更新缓存的场景源列表
    onItemRemoved(item: {
        sceneName: string;  //场景名
        sourceName: string;   //源名
        sceneItemId: number;   //源id
    }) {
        if (this.sceneItems[item.sceneName][item.sourceName] !== undefined) {
            delete this.sceneItems[item.sceneName][item.sourceName];
        }
    }
}

interface ItemIndex {
    [key: string]: number
}

interface SceneItems {
    [key: string]: ItemIndex
}