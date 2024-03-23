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
export interface WeatherConfig extends Position {
    city: string;
    adcode: string;
}
export interface Position {
    x: number;
    y: number;
}

export interface PlaylistConfig {
    id: string;
}
