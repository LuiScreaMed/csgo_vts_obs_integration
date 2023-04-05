/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-03-31 00:36:27
 * @Description: MVP事件处理
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import { Data, Phase } from "../../data.js";
import { Player } from "./event_list.js";

let mvpCount: number = 0;
let roundPhase: Phase = 'freezetime';
let isMvp: boolean = false;

export default function mvpEvent(data: Data) {
    let phase: Phase = data.round?.phase ?? 'freezetime';
    let mapPhase: Phase = data.map?.phase ?? 'live';
    let mvps: number = data.player.match_stats?.mvps ?? 0;
    ///当回合阶段改变时
    if (phase === roundPhase || mapPhase === 'over') return;
    roundPhase = phase;
    ///如果已经（上局）是mvp，则取消mvp状态
    if (isMvp) { setMvp.call(this, false); return; }
    ///如果mvp次数变多了
    if (mvps <= mvpCount) return;
    mvpCount = mvps;
    ///设置mvp状态
    setMvp.call(this, true);
}

function setMvp(flag: boolean) {
    isMvp = flag;
    this.emit(isMvp ? Player.mvp.on : Player.mvp.off, { mvps: mvpCount });
}