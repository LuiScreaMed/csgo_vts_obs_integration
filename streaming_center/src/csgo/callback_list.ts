/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-14 02:37:47
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: register callback list for csgo events
 */
import { Player } from "csgo-integration"
// import { Map } from "csgo-integration/dist/event_handler/csgo_events/event_list.js";
import { onPlayerDie, onPlayerDropHp, onPlayerFullHp, onPlayerHalfHp, onPlayerHighHp, onPlayerLowHp } from "./callbacks/health.js";
// import { onMapUpdate } from "./callbacks/map.js";
import { onPlayerMvpOff, onPlayerMvpOn } from "./callbacks/mvp.js";
import { onPlayerBurningOff, onPlayerBurningOn, onPlayerFlashedOff, onPlayerFlashedOn, onPlayerSmokedOff, onPlayerSmokedOn } from "./callbacks/naded.js";

///各种事件的回调方法列表
const callbacks: CallBackList = {
    [Player.health.drop]: onPlayerDropHp,
    ///添加消除各个状态的操作
    [Player.health.dead]: () => {
        onPlayerDie();
        onPlayerSmokedOff();
        onPlayerFlashedOff();
        onPlayerBurningOff();
    },
    [Player.health.full]: onPlayerFullHp,
    [Player.health.half]: onPlayerHalfHp,
    [Player.health.high]: onPlayerHighHp,
    [Player.health.low]: onPlayerLowHp,
    [Player.naded.smoked_on]: onPlayerSmokedOn,
    [Player.naded.smoked_off]: onPlayerSmokedOff,
    [Player.naded.flashed_on]: onPlayerFlashedOn,
    [Player.naded.flashed_off]: onPlayerFlashedOff,
    [Player.naded.burning_on]: onPlayerBurningOn,
    [Player.naded.burning_off]: onPlayerBurningOff,
    [Player.mvp.on]: onPlayerMvpOn,
    [Player.mvp.off]: onPlayerMvpOff,
    // [Map.update]: onMapUpdate,
}

export interface CallBackList {
    [key: string]: Function
}

export { callbacks };