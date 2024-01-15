const log4js = require('log4js');

const LogType = {
    NONE: 'none',
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
};
const LogTypeOrder = {
    [LogType.NONE]: 0,
    [LogType.DEBUG]: 2,
    [LogType.INFO]: 3,
    [LogType.WARN]: 4,
    [LogType.ERROR]: 5,
};

const Kinds = ['log'];

const appenderFull = (filename) => ({
    type: 'dateFile',
    filename,
    alwaysIncludePattern: true,
    pattern: 'yyyy-MM-dd.log',
    encoding: 'utf-8',
    maxLogSize: '1M',
});

const appenders = { default: appenderFull('./log/default/default') };
const categories = { default: { appenders: ['default'], level: log4js.levels.ALL } };

for (const kind of Kinds) {
    for (let logType in LogType) {
        if (LogType.hasOwnProperty(logType)) {
            logType = LogType[logType];
            const key = kind + '_' + logType;
            appenders[key] = appenderFull(`./log/${logType}/${logType}`);
            categories[key] = { appenders: [key], level: logType === LogType.NONE ? log4js.levels.ALL : logType };
        }
    }
}

log4js.configure({
    appenders,
    categories,
});

let KindIndex = 0;

exports.log = function (type) {
    try {
        if (arguments.length === 0) return;
        let more = '';
        for (let i = 1; i < arguments.length; i++) {
            more += more === '' ? arguments[i] : ' ' + arguments[i];
        }
        if (typeof type === 'string' && arguments.length > 1 && LogType[type.toUpperCase()]) {
            type = type.toLowerCase();
            log4js.getLogger(Kinds[KindIndex] + '_' + type)[type === LogType.NONE ? LogType.DEBUG : type](more);
        } else {
            more = type + more;
            log4js.getLogger(Kinds[KindIndex] + '_' + LogType.LOG)[LogType.DEBUG](more);
        }
    } catch (e) {
        console.error(e);
    }
};

function _registerLogFunc(type) {
    return function () {
        if (arguments.length === 0) return;
        let args = [type];
        for (let i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        exports.log.apply(null, args);
    };
}

const DEFAULT_FORMAT = `:remote-addr - - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent" - :response-time ms`;

exports.netLog = function (type) {
    try {
        type = typeof type === 'string' && LogType[type.toUpperCase()] ? type.toLocaleLowerCase() : LogType.NONE;
        return log4js.connectLogger(log4js.getLogger(Kinds[1] + '_' + LogType.NONE), {
            level: 'auto',
            format: function (req, res, callback) {
                try {
                    let level = LogType.INFO;
                    if (res.statusCode) {
                        if (res.statusCode >= 300) level = LogType.WARN;
                        if (res.statusCode >= 400) level = LogType.ERROR;
                    }
                    const record = callback(DEFAULT_FORMAT);
                    let category = type === LogType.NONE ? type : level;
                    KindIndex = 1;
                    LogTypeOrder[category.toUpperCase()] >= LogTypeOrder[type.toUpperCase()] &&
                        exports.log(category, record);
                    KindIndex = 0;
                } catch (e) {
                    console.error(e);
                }
            },
        });
    } catch (e) {
        console.error(e);
    }
};

exports.debug = _registerLogFunc(LogType.DEBUG);
exports.info = _registerLogFunc(LogType.INFO);
exports.warn = _registerLogFunc(LogType.WARN);
exports.error = _registerLogFunc(LogType.ERROR);
