"use client";

import { create } from "zustand";

interface UseBlockProps{
    blockType: number,
    setBlockType: (type: number) => void,
    setBlockSolana: () => void,
    setBlockEthereum: () => void
}

export const useBlockType = create<UseBlockProps>((set) => ({
    blockType: 0,
    setBlockType: (type) => set({ blockType: type}),
    setBlockSolana: () => set({ blockType: 501}),
    setBlockEthereum: () =>  set({ blockType: 60 })
}));