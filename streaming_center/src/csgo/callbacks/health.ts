/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-04 22:59:17
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: csgo hp event callbacks
 * 生命值回调
 */
import { timeout } from "utils"

///掉血
export function onPlayerDropHp(hp: number) {
    // console.log(`掉血了，当前血量${hp}`);
    ///显示掉血效果
    let option = { sceneName: "Game", itemName: "l2d_hp_drop" };
    this.obs.setItemEnabled({ ...option, enabled: true });
    ///0.1秒后取消显示
    timeout(() => this.obs?.setItemEnabled({ ...option, enabled: false }), 100);
}

///死亡
export function onPlayerDie() {
    // console.log('死了');
    ///判断并显示头顶的光环
    this.vts?.triggerHotkeyWhenExpressionState({ triggerName: "ring", expressionName: "光环", flag: false });
    ///设置当前无受伤的l2d状态
    this.vts?.triggerHotkey({ triggerName: "harmed_state_0" });
}

///满血
export function onPlayerFullHp() {
    // console.log('满血复活 ');
    ///判断并隐藏头顶的光环
    this.vts?.triggerHotkeyWhenExpressionState({ triggerName: "ring", expressionName: "光环", flag: true });
    ///设置当前无受伤的l2d状态
    this.vts?.triggerHotkey({ triggerName: "harmed_state_0" });
}

///小残
export function onPlayerHighHp() {
    // console.log('小残');
    ///设置当前受伤的l2d状态
    this.vts?.triggerHotkey({ triggerName: "harmed_state_1" });
}

///半血
export function onPlayerHalfHp() {
    // console.log('半血');
    ///设置当前受伤的l2d状态
    this.vts?.triggerHotkey({ triggerName: "harmed_state_2" });
}

///大残
export function onPlayerLowHp() {
    // console.log('大残');
    ///设置当前受伤的l2d状态
    this.vts?.triggerHotkey({ triggerName: "harmed_state_3" });
}