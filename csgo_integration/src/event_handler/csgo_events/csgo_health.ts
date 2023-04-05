/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-04 23:08:17
 * @Description: 处理生命值
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import { Data, Map } from "../../data.js";
import { Player } from "./event_list.js";

let playerHealthStatus: string = Player.health.full;
let playerHealth: number = 0;
let inGame: boolean = false;

/**
 * @description: 生命值事件
 * @param {Data} data
 */
export default function healthEvent(data: Data) {
    const hp: number | undefined = data.player.state?.health ?? 0;
    if (playerHealth === hp || data.map === undefined) return;
    ///扣血
    if (playerHealth > hp) {
        ///扣血事件返回hp
        this.emit(Player.health.drop, hp);
    }
    ///判断血量范围设置状态
    if (hp <= 0) {
        setHealth.call(this, Player.health.dead);
    }
    else if (hp <= 20) {
        setHealth.call(this, Player.health.low);
    }
    else if (hp <= 60) {
        setHealth.call(this, Player.health.half);
    }
    else if (hp <= 90) {
        setHealth.call(this, Player.health.high);
    } else {
        setHealth.call(this, Player.health.full);
    }
    playerHealth = hp;
}

function setHealth(health: string) {
    if (playerHealthStatus === health) return;
    playerHealthStatus = health;
    this.emit(playerHealthStatus);
}