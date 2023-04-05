/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-03-30 21:48:07
 * @Description: 处理护甲
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import { Data } from "../../data.js";
import { Player } from "./event_list.js";

///头盔
let helmet: boolean = false;
///防弹衣
let armor: boolean = false;

/**
 * @description: 护甲事件
 * @param {Data} data
 */
export default function armorEvent(data: Data) {
    handleArmor.call(this, data.player.state?.armor ?? 0);
    handleHelmet.call(this, data.player.state?.helmet ?? false);
}

///防弹衣
function handleArmor(amount: number) {
    if (amount == 0 && armor) {
        armor = false;
        this.emit(Player.armor.armor_off);
    } else if (amount != 0 && !armor) {
        armor = true;
        this.emit(Player.armor.armor_on);
    }
}

///头盔
function handleHelmet(flag: boolean) {
    if (flag && !helmet) {
        helmet = true;
        this.emit(Player.armor.helmet_on);
    } else if (!flag && helmet) {
        helmet = false;
        this.emit(Player.armor.helmet_off);
    }
}