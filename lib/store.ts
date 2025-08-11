"use client";

import { create } from "zustand";

interface UseBlockProps{
    blockType: string,
    setBlockSolana: () => void,
    setBlockEthereum: () => void
}

export const useBlockType = create<UseBlockProps>((set) => ({
    blockType: "",
    setBlockSolana: () => set((state) => ({ blockType: "solana "})),
    setBlockEthereum: () =>  set((state) => ({ blockType: "ethereum" }))
}))
