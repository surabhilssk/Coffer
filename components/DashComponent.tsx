"use client";

import { useBlockType } from "@/lib/store";

export const DashComponent = () => {
  const { blockType } = useBlockType();
  return <div>{blockType}</div>;
};
