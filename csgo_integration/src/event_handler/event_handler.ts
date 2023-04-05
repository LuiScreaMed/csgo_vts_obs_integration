/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-03-31 00:38:42
 * @Description: csgo事件处理
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import Event from "./event.js"
import { Data } from "../data.js"
import { healthEvent, nadeEvent } from "./events_export.js"
import { CsgoEvent } from "./csgo_events/event_type.js";

export class CsgoEventHandler extends Event {
    observingSteamid?: string;
    ///需要判断的事件数组
    events: CsgoEvent[] = [healthEvent, nadeEvent];

    /**
     * @constructor
     * @param {string | undefined} observingSteamid 所监听用户的steamid，为undefined时都监听
     */
    constructor(observingSteamid: string | undefined) {
        super();
        this.observingSteamid = observingSteamid;
    }

    ///处理csgo数据
    handleData(data: Data) {
        ///判断监听用户id
        if (this.observingSteamid != undefined && this.observingSteamid != data.player.steamid) return;
        ///遍历处理需要判断的事件
        this.events.forEach((event) => {
            event.call(this, data);
        })
    }

    ///设置需要判断的事件
    setEvents(events: CsgoEvent[]) {
        this.events = events;
    }

}