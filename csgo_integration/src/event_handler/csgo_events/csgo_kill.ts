/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-03-30 21:49:10
 * @Description: 处理击杀
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import { Data } from "../../data.js";
import { Player } from "./event_list.js";

let killsTotal: number = 0; //该局总杀敌
let killsRound: number = 0; //该回合杀敌
let killsRoundHead: number = 0; //该回合爆头杀敌

/**
 * @description: 击杀事件
 * @param {Data} data
 */
export default function killEvent(data: Data) {
    let matchKills: number = data.player.match_stats.kills ?? 0;
    let roundKills: number = data.player.state?.round_kills ?? 0;
    let roundKillsHs: number = data.player.state?.round_killhs ?? 0;
    if (matchKills === killsTotal) return;
    killsTotal = matchKills;
    killsRound = roundKills;
    killsRoundHead = roundKillsHs;
    this.emit(Player.kill, { total: killsTotal, round: killsRound, roundHead: killsRoundHead })
}