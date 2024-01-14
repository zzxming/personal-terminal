/** 格式化显示数字 */
export const formatNumberToDisplay = (num: number) => {
    if (num > 10 ** 4) {
        return `${(num / 10 ** 4).toFixed(1)}万`;
    } else if (num >= 10 ** 8) {
        return `${(num / 10 ** 8).toFixed(1)}亿}`;
    }
    return num;
};
