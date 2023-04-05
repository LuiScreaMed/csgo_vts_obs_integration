/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-06 00:51:25
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: csgo naded event callbacks
 * 被雷的事件回调
 */

import { timeout } from "utils";

///type直接拿obs中的源名称了
function getRequestOption(type: "smoke" | "l2d_flashed" | "fire", enabled: boolean) {
    return { sceneName: "Game", itemName: type, enabled };
}

///混烟
export async function onPlayerSmokedOn() {
    // console.log('混烟了');
    let option = getRequestOption("smoke", true);
    this.obs?.setItemEnabled(option);
}

///出烟
export async function onPlayerSmokedOff() {
    // console.log('出烟了');
    let option = getRequestOption("smoke", false);
    this.obs?.setItemEnabled(option);
}

///被闪了
export function onPlayerFlashedOn() {
    // console.log('被闪了');
    let option = getRequestOption("l2d_flashed", true);
    this.obs?.triggerHotkeyWhenExpressionState({
        triggerName: "crying",
        expressionName: "叉叉眼",
        flag: false
    });
    this.obs?.setItemEnabled(option);
}

///闪光结束了
export function onPlayerFlashedOff() {
    // console.log('闪光结束了');
    let option = getRequestOption("l2d_flashed", false);
    timeout(() =>
        this.obs?.triggerHotkeyWhenExpressionState({
            triggerName: "crying",
            expressionName: "叉叉眼",
            flag: true
        }), 500);
    this.obs?.setItemEnabled(option);
}

///踩火
export function onPlayerBurningOn() {
    // console.log('踩火');
    let option = getRequestOption("fire", true);
    this.obs?.setItemEnabled(option);
}

///出火
export function onPlayerBurningOff() {
    // console.log('出火');
    let option = getRequestOption("fire", false);
    this.obs?.setItemEnabled(option);
}