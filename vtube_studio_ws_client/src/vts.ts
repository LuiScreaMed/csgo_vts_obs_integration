/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-06 23:39:33
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: VTS Websocket client
 */
import { ApiClient as VtsWebSocket, IApiClientOptions } from 'vtubestudio';
import properties from './properties.js';

import WebSocket from 'ws';
import fs from 'fs';

export default class Vts {
    ///vts客户端
    vts?: VtsWebSocket;
    ///vts连接选项
    options: IApiClientOptions;
    ///连接超时时间
    timeout: number;

    /**
     * @constructor
     * @description Obs
     * @param {{url: string, port: number}} info
     */
    constructor(info: VtsInfo) {
        this.timeout = 10 * 1000;
        this.options = {
            url: this.checkUrl(info.url),
            pluginName: properties.name,
            pluginDeveloper: properties.author,
            authTokenSetter: this.setToken,
            authTokenGetter: this.getToken,
            webSocketFactory: (url) => new WebSocket(url)   //没有这个会报错所以加上了
        };
        this.vts = null;
    }

    connect() {
        if (this.vts !== null) {
            console.log('theres already a vts client instance.');
            return;
        }
        this.vts = new VtsWebSocket(this.options);
        this.vts.on('connect', () => {
            console.log(`vts connected: ${this.options.url}`);
        });
    }

    checkUrl(url: string) {
        return url.startsWith('ws://') ? url : `ws://${url}`;
    }

    //保存token
    async setToken(token: string): Promise<void> {
        let data = JSON.stringify({ token });
        fs.writeFileSync('./vts_data.json', data);
    }

    //获取token
    getToken(): string | null {
        try {
            let rawData = fs.readFileSync('./vts_data.json').toString();
            return JSON.parse(rawData)['token'];
        }
        catch (e) {
            return null;
        }
    }

    ///设置表情
    setExpression(data: {
        /* 表情名称 */
        expressionName: string,
        /* 开关 */
        flag: boolean
    }) {
        if (!this.vts.isConnected ||
            data.expressionName === undefined ||
            data.flag === undefined) return;
        console.log(`vts: setting expression: ${data.expressionName}, enabled: ${data.flag}`);
        this.vts.expressionActivation({
            expressionFile: this.#getExpressionName(data.expressionName),
            active: data.flag
        }, {
            timeout: this.timeout
        }).then((res) => {
            console.log(`vts: setting expression: success`);
        }).catch((e) => {
            console.log('vts: setting expression: error', e);
        });
    }

    ///触发热键
    triggerHotkey(data: {
        triggerName: string
    }) {
        if (!this.vts.isConnected || data.triggerName === undefined) return;
        console.log(`vts: triggering hotkey: ${data.triggerName}`);
        this.vts.hotkeyTrigger({
            hotkeyID: data.triggerName
        }, { timeout: this.timeout }).then((res) => {
            console.log(`vts: triggering hotkey: success`);
        }).catch((e) => {
            console.error('vts: triggering hotkey error:', e);
        });
    }

    ///判断表情状态并触发热键，当表情状态等于flag时触发
    triggerHotkeyWhenExpressionState(data: {
        triggerName: string,
        expressionName: string,
        flag: boolean
    }) {
        if (!this.vts.isConnected ||
            data.triggerName === undefined ||
            data.flag === undefined ||
            data.expressionName === undefined) return;
        console.log(`vts: triggering hotkey: ${data.triggerName} when expression:
             ${data.expressionName}'s state is: ${data.flag}`);
        ///获取表情状态
        this.vts.expressionState({
            expressionFile: this.#getExpressionName(data.expressionName),
            details: false
        }, { timeout: this.timeout }).then((res) => {
            ///没有找到这个表情或表情状态不符合
            if (res.expressions.length == 0 || res.expressions[0].active !== data.flag) return;
            ///触发热键
            console.log(`vts: triggering hotkey with expression state check: success`);
            this.triggerHotkey({ triggerName: data.triggerName });
        }).catch((e) => {
            console.log('vts: triggering hotkey with expression state check: error', e);
        })
    }

    ///表情文件后缀处理
    #getExpressionName(expressionName: string) {
        return !expressionName.endsWith('.exp3.json') ?
            `${expressionName}.exp3.json` : expressionName;
    }
}

interface VtsInfo {
    url: string
}