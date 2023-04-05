/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-04 22:59:53
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: csgo mvp event callbacks
 * mvp的回调
 */

export function onPlayerMvpOn() {
    // console.log("我成mvp了");
    this.vts?.triggerHotkeyWhenExpressionState({ triggerName: "glasses", expressionName: "墨镜", flag: false });
}

export function onPlayerMvpOff() {
    // console.log("我不是mvp了");
    this.vts?.triggerHotkeyWhenExpressionState({ triggerName: "glasses", expressionName: "墨镜", flag: true });
}