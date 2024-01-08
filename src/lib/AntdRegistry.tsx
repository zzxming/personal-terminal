'use client';

import React from 'react';
import {
    createCache,
    extractStyle,
    StyleProvider,
    px2remTransformer,
    legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';

const px2rem = px2remTransformer({
    rootValue: 16,
});

const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
    const cache = React.useMemo<Entity>(() => createCache(), []);
    const isServerInserted = React.useRef<boolean>(false);
    useServerInsertedHTML(() => {
        // 避免 css 重复插入
        if (isServerInserted.current) {
            return;
        }
        isServerInserted.current = true;
        return (
            <style
                id="antd"
                dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
            />
        );
    });
    return (
        <StyleProvider
            hashPriority="high"
            cache={cache}
            transformers={[px2rem, legacyLogicalPropertiesTransformer]}
        >
            {children}
        </StyleProvider>
    );
};

export default StyledComponentsRegistry;
