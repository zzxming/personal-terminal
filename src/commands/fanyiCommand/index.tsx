import { fanyiApi, FanyiRejResult, FanyiResResult } from '@/assets/js/api';
import { Command, CommandOutputStatus } from '@/interface/interface';
import css from '@/app/index.module.css';
import { randomID } from '@/utils/tools';

const lang: {
    [key: string]: string;
} = {
    auto: '自动',
    zh: '中文',
    en: '英语',
    jp: '日语',
    fra: '法语',
    wyw: '文言文',
    spa: '西班牙语',
    mg: '马拉加斯语',
    ru: '俄语',
    it: '意大利语',
    de: '德语',
    nl: '荷兰语',
    pl: '波兰语',
    dan: '丹麦语',
    kas: '克什米尔语',
    cs: '捷克语',
    hu: '匈牙利语',
    vie: '越南语',
    kor: '韩语',
    th: '泰语',
    srp: '塞尔维亚语',
    mlt: '马耳他语',
    pt: '葡萄牙语',
    el: '希腊语',
    bul: '保加利亚语',
    fin: '芬兰语',
    slo: '斯洛文尼亚语',
    cht: '繁体中文',
    ara: '阿拉伯语',
    gle: '爱尔兰语',
    oci: '奥克语',
    alb: '阿尔巴尼亚语',
    arq: '阿尔及利亚阿拉伯语',
    aka: '阿肯语',
    arg: '阿拉贡语',
    amh: '阿姆哈拉语',
    asm: '阿萨姆语',
    aym: '艾马拉语',
    aze: '阿塞拜疆语',
    ast: '阿斯图里亚斯语',
    oss: '奥塞梯语',
    est: '爱沙尼亚语',
    oji: '奥杰布瓦语',
    ori: '奥里亚语',
    orm: '奥罗莫语',
    per: '波斯语',
    bre: '布列塔尼语',
    bak: '巴什基尔语',
    baq: '巴斯克语',
    pot: '巴西葡萄牙语',
    pam: '邦板牙语',
    ber: '柏柏尔语',
    bel: '白俄罗斯语',
    sme: '北方萨米语',
    ped: '北索托语',
    bem: '本巴语',
    bli: '比林语',
    bis: '比斯拉马语',
    tuk: '土库曼语',
    bal: '俾路支语',
    ice: '冰岛语',
    bos: '波斯尼亚语',
    bho: '博杰普尔语',
    chv: '楚瓦什语',
    tso: '聪加语',
    roh: '罗曼什语',
    tat: '鞑靼语',
    sha: '掸语',
    tet: '德顿语',
    div: '迪维希语',
    log: '低地德语',
    fil: '菲律宾语',
    san: '梵语',
    fri: '弗留利语',
    ful: '富拉尼语',
    fao: '法罗语',
    gla: '盖尔语',
    kon: '刚果语',
    ups: '高地索布语',
    kal: '格陵兰语',
    hkm: '高棉语',
    geo: '格鲁吉亚语',
    gra: '古希腊语',
    eno: '古英语',
    guj: '古吉拉特语',
    grn: '瓜拉尼语',
    hup: '胡帕语',
    hak: '哈卡钦语',
    ht: '海地语',
    mot: '黑山语',
    hau: '豪萨语',
    kir: '吉尔吉斯语',
    glg: '加利西亚语',
    frn: '加拿大法语',
    cat: '加泰罗尼亚语',
    kab: '卡拜尔语',
    kan: '卡纳达语',
    kau: '卡努里语',
    kah: '卡舒比语',
    cor: '康瓦尔语',
    xho: '科萨语',
    cos: '科西嘉语',
    cre: '克里克语',
    cri: '克里米亚鞑靼语',
    kli: '克林贡语',
    hrv: '克罗地亚语',
    que: '克丘亚语',
    kok: '孔卡尼语',
    kur: '库尔德语',
    lat: '拉丁语',
    lao: '老挝语',
    rom: '罗马尼亚语',
    lag: '拉特加莱语',
    lav: '拉脱维亚语',
    lim: '林堡语',
    lin: '林加拉语',
    lug: '卢干达语',
    ltz: '卢森堡语',
    ruy: '卢森尼亚语',
    kin: '卢旺达语',
    lit: '立陶宛语',
    ro: '罗姆语',
    loj: '逻辑语',
    may: '马来语',
    bur: '缅甸语',
    mar: '马拉地语',
    mac: '马其顿语',
    mal: '马拉雅拉姆语',
    mah: '马绍尔语',
    mai: '迈蒂利语',
    glv: '曼克斯语',
    mau: '毛里求斯克里奥尔语',
    mao: '毛利语',
    ben: '孟加拉语',
    hmn: '苗语',
    nor: '挪威语',
    nea: '那不勒斯语',
    nbl: '南恩德贝莱语',
    afr: '南非荷兰语',
    sot: '南索托语',
    nep: '尼泊尔语',
    pan: '旁遮普语',
    pap: '帕皮阿门托语',
    pus: '普什图语',
    nya: '齐切瓦语',
    twi: '契维语',
    chr: '切罗基语',
    swe: '瑞典语',
    srd: '萨丁尼亚语',
    sm: '萨摩亚语',
    sec: '塞尔维亚-克罗地亚语',
    sin: '僧伽罗语',
    sk: '斯洛伐克语',
    sol: '桑海语',
    nob: '书面挪威语',
    epo: '世界语',
    swa: '斯瓦希里语',
    src: '塞尔维亚语（西里尔）',
    som: '索马里语',
    tr: '土耳其语',
    tgk: '塔吉克语',
    tam: '泰米尔语',
    tgl: '他加禄语',
    tir: '提格利尼亚语',
    tel: '泰卢固语',
    tua: '突尼斯阿拉伯语',
    ukr: '乌克兰语',
    wln: '瓦隆语',
    wel: '威尔士语',
    ven: '文达语',
    wol: '沃洛夫语',
    urd: '乌尔都语',
    heb: '希伯来语',
    sil: '西里西亚语',
    fry: '西弗里斯语',
    hil: '希利盖农语',
    los: '下索布语',
    haw: '夏威夷语',
    nno: '新挪威语',
    nqo: '西非书面语',
    snd: '信德语',
    syr: '叙利亚语',
    ceb: '宿务语',
    sna: '修纳语',
    sun: '巽他语',
    hi: '印地语',
    id: '印尼语',
    yid: '意第绪语',
    ina: '因特语',
    ach: '亚齐语',
    ing: '印古什语',
    yor: '约鲁巴语',
    ibo: '伊博语',
    ido: '伊多语',
    arm: '亚美尼亚语',
    iku: '伊努克提图特语',
    ir: '伊朗语',
    yue: '粤语',
    zaz: '扎扎其语',
    frm: '中古法语',
    zul: '祖鲁语',
    jav: '爪哇语',
};

const fanyiCommand: Command = {
    name: 'fanyi',
    desc: '百度翻译',
    params: [
        {
            key: 'keywords',
            desc: '要翻译的内容',
            required: true,
        },
    ],
    options: [
        {
            key: 'from',
            alias: 'f',
            desc: '翻译源语言',
            defaultValue: 'auto',
            valueNeeded: true,
            legalValue: lang,
        },
        {
            key: 'to',
            alias: 't',
            desc: '翻译至目标语言',
            defaultValue: 'auto',
            valueNeeded: true,
            legalValue: lang,
        },
    ],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args)
        let { _, to: toArg, from: fromArg } = args as { _: string[]; to: string; from: string };
        const keywords = _.join(' ');

        commandHandle.pushCommands(
            {
                constructor: '等待加载...',
                status: CommandOutputStatus.warn,
            },
            true
        );

        // console.log(param, to, from)
        const [err, result] = await fanyiApi({ keywords, to: toArg, from: fromArg });
        if (err) {
            // console.log(err)
            return {
                constructor: err.response?.statusText || err.message,
                status: CommandOutputStatus.error,
            };
        }
        // console.log(result)
        if (result.data.code !== 0) {
            // console.log(result.data?.message)
            return {
                constructor: '网络错误',
                status: CommandOutputStatus.error,
            };
        }

        const rejData = result.data.data as FanyiRejResult;
        if (rejData.error_code) {
            const { error_code, error_message } = rejData;
            // console.log(data.error_msg);
            return {
                constructor: (
                    <div
                        key={`translate result ${error_code} ${randomID()}`}
                        className={css.command_txt}
                    >
                        error code: {error_code}, {error_message}, detail see{' '}
                        <a
                            href="https://api.fanyi.baidu.com/doc/21"
                            style={{ color: '#1890ff' }}
                        >
                            接入文档
                        </a>
                    </div>
                ),
                status: CommandOutputStatus.error,
            };
        } else {
            const resData = result.data.data as FanyiResResult;
            const { trans_result, to, from } = resData;
            return {
                constructor: (
                    <div
                        key={`translate result ${trans_result[0].src}-${trans_result[0].dst} ${randomID()}`}
                        className={css.command_txt}
                    >
                        从{lang[from]}: {trans_result[0].src}，翻译成{lang[to]}: {trans_result[0].dst}
                    </div>
                ),
                status: CommandOutputStatus.success,
            };
        }
    },
};

export { fanyiCommand };
