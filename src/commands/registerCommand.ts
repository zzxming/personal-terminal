import { musicCommand } from '@/commands/musicCommand';
import { fanyiCommand } from '@/commands/fanyiCommand';
import { backgroundCommand } from '@/commands/backgroundCommand';
import { helpCommand } from '@/commands/helpCommand';
import { clearCommand } from '@/commands/clearCommand';
import { biliCommand } from '@/commands/biliCommand';
import { historyCommand } from '@/commands/historyCommand';
import { logCommand } from '@/commands/logCommand';
import { Command } from '../interface/interface';
import { markCommand } from '@/commands/markCommand';
import { gotoCommand } from '@/commands/gotoCommand';
import { baiduCommand } from '@/commands/baiduCommand';
import { configCommand } from '@/commands/configCommand';
import { timeCommand } from '@/commands/timeCommand';
import { calculatorCommand } from './calculateCommand';

import { initValLocalStorageConfig } from '@/commands/configCommand';
import { initValLocalStorageLog } from '@/commands/logCommand';
import { initValLocalStorageMark } from '@/commands/markCommand';
import { initValLocalStorageWeather } from '@/commands/weatherCommand/subCommand/setCommand';
import { localStorageInitValueMap } from '@/utils/localStorage';
import { LOCALSTORAGECONFIG, LOCALSTORAGELOG, LOCALSTORAGEMARK, LOCALSTORAGWEATHER } from '@/assets/js/const';
import { weatherCommand } from './weatherCommand';

localStorageInitValueMap[LOCALSTORAGEMARK] = initValLocalStorageMark;
localStorageInitValueMap[LOCALSTORAGECONFIG] = initValLocalStorageConfig;
localStorageInitValueMap[LOCALSTORAGELOG] = initValLocalStorageLog;
localStorageInitValueMap[LOCALSTORAGWEATHER] = initValLocalStorageWeather;

const commandMap: Command[] = [
    baiduCommand,
    helpCommand,
    backgroundCommand,
    clearCommand,
    configCommand,
    timeCommand,
    gotoCommand,
    historyCommand,
    fanyiCommand,
    markCommand,
    musicCommand,
    logCommand,
    biliCommand,
    calculatorCommand,

    weatherCommand,
];
const helpIgnoreCommand: Command[] = [helpCommand];

export { commandMap, helpIgnoreCommand };
