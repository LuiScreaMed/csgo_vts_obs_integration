/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-03-30 21:36:45
 * @Description: 处理金钱数
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import { Data } from "../../data.js";
import { Player } from "./event_list.js";

let playerCashStatus: string = Player.cash.empty;

/**
 * @description: 金钱事件
 * @param {Data} data
 */
export default function cashEvent(data: Data) {
    const money: number = data.player.state?.money ?? 0;
    if (money < 2000) {
        setCash.call(this, Player.cash.empty);
    } else if (money < 6000) {
        setCash.call(this, Player.cash.quarter);
    } else if (money < 10000) {
        setCash.call(this, Player.cash.half);
    } else if (money < 14000) {
        setCash.call(this, Player.cash.three_quarters);
    } else {
        setCash.call(this, Player.cash.full);
    }
}

function setCash(cash: string) {
    if (playerCashStatus === cash) return;
    playerCashStatus = cash;
    this.emit(playerCashStatus);
}