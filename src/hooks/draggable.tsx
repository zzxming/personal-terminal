import { Position } from '@/interface';
import { MutableRefObject, useEffect } from 'react';

interface DraggableOptions {
    callback: (value: Position) => boolean | void;
}
const useDraggable = <T extends HTMLElement>(target: MutableRefObject<T | null>, { callback }: DraggableOptions) => {
    useEffect(() => {
        if (!target.current) return;
        if (!['absolute', 'fixed'].includes(target.current.style.position)) {
            target.current.style.position = 'fixed';
        }
        target.current.style.cursor = 'move';
        target.current.style.userSelect = 'none';

        let offsetPosition: [number, number] = [0, 0];
        const handleDown = (e: MouseEvent) => {
            const { x, y } = target.current!.getBoundingClientRect();
            offsetPosition = [e.clientX - x, e.clientY - y];
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleUp);
        };
        const handleMove = (e: MouseEvent) => {
            if (!target.current) return;
            const resultX = e.clientX - offsetPosition[0];
            const resultY = e.clientY - offsetPosition[1];
            const result = callback({ x: resultX, y: resultY });
            if (typeof result === 'undefined' || result) {
                Object.assign(target.current.style, {
                    left: `${resultX}px`,
                    top: `${resultY}px`,
                    right: 'auto',
                    bottom: 'auto',
                });
            }
        };
        const handleUp = () => {
            offsetPosition = [0, 0];
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
        };
        target.current.addEventListener('mousedown', handleDown);
        return () => {
            target.current?.removeEventListener('mousedown', handleDown);
        };
    }, [target.current]);
};

export { useDraggable };
