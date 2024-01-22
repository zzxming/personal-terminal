import { Command } from '../interface/interface';

import { musicCommand } from '@/commands/musicCommand';
import { fanyiCommand } from '@/commands/fanyiCommand';
import { backgroundCommand } from '@/commands/backgroundCommand';
import { helpCommand } from '@/commands/helpCommand';
import { clearCommand } from '@/commands/clearCommand';
import { biliCommand } from '@/commands/biliCommand';
import { historyCommand } from '@/commands/historyCommand';
import { logCommand, initValLocalStorageLog } from '@/commands/logCommand';
import { markCommand, initValLocalStorageMark } from '@/commands/markCommand';
import { gotoCommand } from '@/commands/gotoCommand';
import { baiduCommand } from '@/commands/baiduCommand';
import { configCommand, initValLocalStorageConfig } from '@/commands/configCommand';
import { initValLocalStorageTime, timeCommand } from '@/commands/timeCommand';
import { calculatorCommand } from '@/commands/calculateCommand';
import { weatherCommand, initValLocalStorageWeather } from '@/commands/weatherCommand';

import { localStorageInitValueMap } from '@/utils/localStorage';
import {
    LOCALSTORAGECONFIG,
    LOCALSTORAGELOG,
    LOCALSTORAGEMARK,
    LOCALSTORAGETIME,
    LOCALSTORAGWEATHER,
} from '@/assets/js/const';

localStorageInitValueMap[LOCALSTORAGEMARK] = initValLocalStorageMark;
localStorageInitValueMap[LOCALSTORAGECONFIG] = initValLocalStorageConfig;
localStorageInitValueMap[LOCALSTORAGELOG] = initValLocalStorageLog;
localStorageInitValueMap[LOCALSTORAGWEATHER] = initValLocalStorageWeather;
localStorageInitValueMap[LOCALSTORAGETIME] = initValLocalStorageTime;

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
