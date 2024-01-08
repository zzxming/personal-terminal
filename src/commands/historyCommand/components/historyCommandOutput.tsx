import { CommandResultListOutput } from '@/components/commandListOutput';
import { HistoryCommand } from '@/interface/interface';

interface HistoryCommandListOutputProps {
    data: HistoryCommand[];
}
export const HistoryCommandListOutput = (props: HistoryCommandListOutputProps) => {
    const { data } = props;
    return (
        <CommandResultListOutput<HistoryCommand>
            data={data}
            render={(item, index) => (
                <li>
                    {index + 1} {item.txt}
                </li>
            )}
        />
    );
};
