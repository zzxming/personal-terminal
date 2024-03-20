import React from 'react';
import { UseCommandHook } from '@/hooks/command';

// command 接口 start
export interface Command {
    name: string;
    desc: string;
    detail?: string;
    params: CommandParam[];
    options: CommandOption[];
    subCommands: Command[];
    action: (
        args: CommandParamArgs,
        commandHandle: UseCommandHook
    ) => CommandActionOutput | Promise<CommandActionOutput> | void;
}
export interface CommandParam {
    key: string; // key值
    desc: string; // param描述
    required: boolean; // 是否必须传入
    legalValueDesc?: string;
    legalValue?:
        | {
              // 合法值对象值, key为值, value为描述
              [key: string | number]: string;
          }
        | ((val: string, i: number) => boolean);
}
export interface CommandOption {
    key: string; // 参数key
    alias: string; // 参数输入名
    desc: string; // 参数描述
    valueNeeded: boolean; // 此参数是否需要值
    defaultValue?: string | number | boolean; // 参数默认值
    legalValueDesc?: string;
    legalValue?:
        | {
              // 合法值对象值, key为值, value为描述
              [key: string | number]: string;
          }
        | ((val: string) => boolean);
}
// 获取对象中某属性的数据类型
export type objectValueType<T extends object, K extends keyof T> = T[K];
// command 接口 end

// command 输出结果接口 start
export interface CommandActionOutput {
    constructor: string | React.ReactElement;
    status?: CommandOutputStatus;
}
export interface CommandOutput {
    key: string;
    construct: React.ReactElement;
    isResult: boolean;
    status: CommandOutputStatus;
}
export enum CommandOutputStatus {
    success = 'success',
    error = 'error',
    warn = 'warn',
}
export interface HistoryCommand {
    txt: string;
}
export interface CommandParamArgs {
    [x: string]: string | boolean | number | string[];
    _: string[];
}
// command 输出结果接口 end

// bili api 接口 start
// 视频信息
export type BiliVideoInfo = {
    pic: string;
    bvid: string;
    play: number;
    id: number;
    danmaku: number;
    title: string;
    author: string;
    senddate: number;
    duration: string;
    arcurl: string;
    mid: number;
};
// 搜索结果分类信息
export interface BiliPageInfo {
    numResults: number;
    total: number;
    pages: number;
}
// 根据类型返回的视频信息
export interface BiliTypeVideo extends BiliVideoInfo {
    type: string;
}
// 搜索页信息
export interface BiliVideoSearchInfo {
    page: number;
    pagesize: number;
    numResults: number;
    numPages: number;
}
// bili api 接口 end

// log start
/**
 * 可修改的输入框类型
 */
export type EditInputType = 'number' | 'text' | 'textarea' | 'date' | 'time' | 'switch';

/**
 * 日志的内结果属性
 */
export interface LogDataDetail {
    key: string;
    date: string;
    content: string;
    status: boolean;
}
/**
 * 日志的数据结构
 */
export interface LogData {
    [key: string]: LogDataDetail[];
}
// log end

// mark start
export interface MarkData {
    data: Mark[];
}
export interface Mark {
    key: React.Key;
    title: string;
    url: string;
    icon: string;
}
// mark end

// config start
export interface ConfigData {
    /** 终端样式 */
    style: React.CSSProperties;
    /** 页面打开方式 */
    open: openType;
    /** mark是否持续展示 */
    mark: boolean;
    /** 背景图片路径 */
    bgurl: string;
    /** 是否显示时间 */
    time: boolean;
    /** 是否显示天气 */
    weather: boolean;
    /** 是否显示音乐播放列表 */
    musicPlaylist: boolean;
}
export interface TimeConfig extends Position {}

/** 页面打开方式 */
export enum openType {
    self = 'self',
    blank = 'blank',
}
// config end

// weather start
export interface WeatherConfig extends Position {
    city: string;
    adcode: string;
}
export interface WeatherLiveInfo {
    address: string;
    /** 省份 */
    province: string;
    /** 城市 */
    city: string;
    /** 区域编码 */
    adcode: string;
    /** 天气现象 */
    weather: string;
    /** 实时温度 */
    temperature: string;
    temperature_float: string;
    /** 风向描述 */
    winddirection: string;
    /** 风力级别 */
    windpower: string;
    /** 空气温度 */
    humidity: string;
    humidity_float: string;
    /** 数据发布的时间 */
    reporttime: string;
}
export interface WeatherForecast {
    adcode: string;
    casts: WeatherForecastInfo[];
    city: string;
    province: string;
    repottime: string;
}
export interface WeatherForecastInfo {
    address: string;
    // 日期 YYYY-MM-DD
    date: string;
    // 星期几, 1-7
    week: string;
    // 白天天气现象
    dayweather: string;
    // 晚上天气现象
    nightweather: string;
    // 白天温度
    daytemp: string;
    daytemp_float: string;
    // 晚上温度
    nighttemp: string;
    nighttemp_float: string;
    // 白天风向
    daywind: string;
    // 晚上风向
    nightwind: string;
    // 白天风力
    daypower: string;
    // 晚上风力
    nightpower: string;
}
// weather end

export interface Position {
    x: number;
    y: number;
}

// music start
export interface MusicInfo {
    id: number;
    name: string;
    path: string;
    duration: number;
}
// music end
