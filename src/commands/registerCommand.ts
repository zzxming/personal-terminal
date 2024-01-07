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

const commandMap: Command[] = [
    baiduCommand,

    // musicCommand,
    // fanyiCommand,
    // backgroundCommand,
    // helpCommand,
    // clearCommand,
    // biliCommand,
    // historyCommand,
    // logCommand,
    // markCommand,
    // gotoCommand,
    // configCommand,
    // timeCommand,
];
const helpIgnoreCommand: Command[] = [helpCommand];

export { commandMap, helpIgnoreCommand };
