import { CommandResultListOutput } from '@/components/commandListOutput';
import { HistoryCommand } from '@/interface/interface';

interface HistoryListProps {
    data: HistoryCommand[];
}
export const HistoryList = (props: HistoryListProps) => {
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
