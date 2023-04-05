/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-04 23:04:02
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description: 处理地图更新
 */

import { Data, Map } from "../../data.js";
import { Map as MapEvents } from "./event_list.js";

let lastMap: Map | undefined = undefined;

export default function mapEvent(data: Data) {
    let map = data.map;
    if (map === lastMap) return;
    lastMap = map;
    this.emit(MapEvents.update, lastMap);
}