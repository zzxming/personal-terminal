'use client';
import React, { createContext, useContext } from 'react';
import { AudioStore, PlaylistStore } from '@/stores';
import { PlaylistStoreContext } from './PlaylistStoreRegistry';

export const AudioStoreContext = createContext<AudioStore>(new AudioStore(new PlaylistStore()));

export const AudioStoreRegistry = ({ children }: React.PropsWithChildren) => {
    const playlistStore = useContext(PlaylistStoreContext);
    return <AudioStoreContext.Provider value={new AudioStore(playlistStore)}>{children}</AudioStoreContext.Provider>;
};
