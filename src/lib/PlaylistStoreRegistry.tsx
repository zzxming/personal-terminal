'use client';
import React, { createContext } from 'react';
import { PlaylistStore } from '@/stores';

export const PlaylistStoreContext = createContext<PlaylistStore>(new PlaylistStore());

export const PlaylisttoreRegistry = ({ children }: React.PropsWithChildren) => {
    return <PlaylistStoreContext.Provider value={new PlaylistStore()}>{children}</PlaylistStoreContext.Provider>;
};
