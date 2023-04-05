/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-03-31 15:46:47
 * @Description: 处理投掷物影响
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 */

import { Data } from "../../data.js";
import { Player } from "./event_list.js";

interface NadeData {
    flag: boolean,
    amount: number
}

///被闪
let flashed: NadeData = {
    flag: false,
    amount: 0
};
///被雷
// let grenaded: NadeData = {
//     flag: false,
//     amount: 0
// };
///被烟
let smoked: NadeData = {
    flag: false,
    amount: 0
};
///被烧
let burning: NadeData = {
    flag: false,
    amount: 0
};


/**
 * @description: 被投掷物影响事件
 * @param {Data} data
 */
//被投掷物影响事件
export default function nadeEvent(data: Data) {
    ///闪光
    handleFlashed.call(this, data.player.state?.flashed ?? 0);
    ///烟雾
    handleSmoked.call(this, data.player.state?.smoked ?? 0);
    ///燃烧弹
    handleBurning.call(this, data.player.state?.burning ?? 0);
}

///闪光
function handleFlashed(amount: number) {
    if (amount >= 64 && amount > flashed.amount) {
        if (!flashed.flag) {
            flashed.flag = true;
            this.emit(Player.naded.flashed_on);
        }
    } else if (amount < flashed.amount || amount < 64) {
        if (flashed.flag) {
            flashed.flag = false;
            this.emit(Player.naded.flashed_off);
        }
    }
    flashed.amount = amount;
}

///烟雾
function handleSmoked(amount: number) {
    if (amount >= 64 && amount > smoked.amount) {
        if (!smoked.flag) {
            smoked.flag = true;
            this.emit(Player.naded.smoked_on);
        }
    } else if (amount < smoked.amount || amount < 64) {
        if (smoked.flag) {
            smoked.flag = false;
            this.emit(Player.naded.smoked_off);
        }
    }
    smoked.amount = amount;
}

///燃烧弹
function handleBurning(amount: number) {
    if (amount == 0) {
        if (burning.flag) {
            burning.flag = false;
            this.emit(Player.naded.burning_off);
        }
    } else {
        if (!burning.flag) {
            burning.flag = true;
            this.emit(Player.naded.burning_on);
        }
    }
}