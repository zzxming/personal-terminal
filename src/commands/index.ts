import { Command } from '@/interface';
import { commandMap } from './registerCommand';

function searchCommand(command: string, searchMap: Command[] = commandMap) {
    return searchMap.find((existCommand) => command === existCommand.name) || null;
}
// 命令使用提示文字
function commandUseFunc(command: Command): string {
    if (!command) return '';
    /**
     * 必选参数和可选参数的显示方式
     * @param required 是否必选
     * @param desc 描述文字
     * @returns 参数对应显示方式
     */
    function isRequired(required: boolean, desc: string) {
        return required ? `<${desc}>` : `[${desc}]`;
    }

    const name = command.name;
    let paramStr = '';
    command.params.forEach((param) => {
        paramStr += ' ' + isRequired(param.required, param.desc);
    });
    let optionStr = '';
    command.options.forEach((option) => {
        optionStr += ' ' + isRequired(false, `-${option.alias} ${option.desc}`);
    });
    return `${name} ${paramStr} ${optionStr}`;
}

export { commandMap, searchCommand, commandUseFunc };
