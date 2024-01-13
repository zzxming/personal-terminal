import React from 'react';
import { UseCommandHook } from '@/hooks/command';

// command 接口 start
export interface Command {
    name: string;
    desc: string;
    params: CommandParam[];
    options: CommandOption[];
    subCommands: Command[];
    action: (
        args: CommandParamArgs,
        commandHandle: UseCommandHook,
        view: HTMLElement
    ) => CommandActionOutput | Promise<CommandActionOutput> | void;
}
export interface CommandParam {
    key: string; // key值
    desc: string; // param描述
    required: boolean; // 是否必须传入
    legalValue?: {
        // 合法值对象值, key为值, value为描述
        [key: string | number]: string;
    };
}
export interface CommandOption {
    key: string; // 参数key
    alias: string; // 参数输入名
    desc: string; // 参数描述
    valueNeeded: boolean; // 此参数是否需要值
    defaultValue?: string | number | boolean; // 参数默认值
    legalValue?: {
        // 合法值对象值, key为值, value为描述
        [key: string | number]: string;
    };
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
export type BiliVideo = {
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
export interface BiliTypeVideo extends BiliVideo {
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
    /** time是否持续展示 */
    time: boolean;
}
/** 页面打开方式 */
export enum openType {
    self = 'self',
    blank = 'blank',
}
// config end
