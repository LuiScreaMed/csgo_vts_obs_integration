/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-04 22:59:40
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: csgo map event callbacks
 * 地图变化事件的回调
 */
import { Map } from "csgo-integration/dist/data.js";

///地图信息更新
export function onMapUpdate(map: Map) {
    // console.log('地图更新了');
    console.log(map);
}