/*
 * @Author: LuiScreaMed lui5@qq.com
 * @LastEditTime: 2023-04-04 23:07:13
 * Copyright (c) 2023 by LuiScreaMed
 * MIT Licensed
 * @Description:
 */
//被雷状态
const PlayerNaded = Object.freeze({
    flashed_on: 'player_flashed_on',
    flashed_off: 'player_flashed_off',
    smoked_on: 'player_smoked_on',
    smoked_off: 'player_smoked_off',
    burning_on: 'player_burning_on',
    burning_off: 'player_burning_off'
});

//血量
const PlayerHealth = Object.freeze({
    'full': 'player_hp_full',
    'high': 'player_hp_high',
    'half': 'player_hp_half',
    'low': 'player_hp_low',
    'dead': 'player_hp_dead',
    'drop': 'player_hp_drop'
})

//护甲
const PlayerArmor = Object.freeze({
    'armor_on': 'player_armor_on',
    'armor_off': 'player_armor_off',
    'helmet_on': 'player_helmet_on',
    'helmet_off': 'player_helmet_off'
})

//金钱
const PlayerCash = Object.freeze({
    full: 'player_cash_full',
    three_quarters: 'player_cash_three_quarters',
    half: 'player_cash_half',
    quarter: 'player_cash_quarter',
    empty: 'player_cash_empty',
})

//mvp
const PlayerMvp = Object.freeze({
    on: 'player_mvp_on',
    off: 'player_mvp_off'
})

export const Player = Object.freeze({
    health: PlayerHealth,
    naded: PlayerNaded,
    cash: PlayerCash,
    armor: PlayerArmor,
    kill: 'player_kill',
    mvp: PlayerMvp,
})

export const Map = Object.freeze({
    update: 'map_update',
})