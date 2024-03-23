/** 上传歌曲信息 */
export interface MusicInfo {
    id: number;
    name: string;
    path: string;
    duration: number;
}
/** 网易云音乐歌曲信息 */
export interface CloudMusic {
    id: number;
    name: string;
    /** 别名(灰字) */
    alia: string[];
    ar: CloudSingerShort[];
    al: CloudAlbumShort;
    /** 时长 */
    dt: number;
    /** 值为 1 时是vip歌曲, 只能播放部分 */
    fee: number;
    noCopyrightRcmd: {
        type: number;
        typeDesc: string;
    };
    /** -200 表示歌曲下架不能听 */
    st: number;
    publishTime: number;
}
/** 网易云音乐歌手部分信息 */
export interface CloudSingerShort {
    id: number;
    name: string;
}
/** 网易云音乐专辑部分信息 */
export interface CloudAlbumShort {
    id: number;
    name: string;
    picUrl: string;
}
