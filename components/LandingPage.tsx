"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useBlockType } from "@/lib/store";
import { useRouter } from "next/navigation";

export const LandingPage = () => {
  const { setBlockSolana, setBlockEthereum } = useBlockType();
  const router = useRouter();

  const handleSolana = () => {
    setBlockSolana();
    router.push("/dashboard");
  };

  const handleEthereum = () => {
    setBlockEthereum();
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <div className="w-full flex justify-center mb-3">
          <Image
            src={"/coffer_logo.webp"}
            alt="coffer_logo"
            width={70}
            height={70}
          />
        </div>
        <div className="text-4xl font-semibold">
          The go-to platform for managing your crypto
        </div>
        <div className="text-xl text-primary/80 text-center mt-4">
          Choose blockchain to get started
        </div>
        <div className="flex gap-3 mt-3 justify-center">
          <Button
            className="px-8 py-6 text-md font-light cursor-pointer"
            onClick={handleSolana}
          >
            Solana
          </Button>
          <Button
            className="px-7 py-6 text-md font-light cursor-pointer"
            onClick={handleEthereum}
          >
            Ethereum
          </Button>
        </div>
      </div>
    </div>
  );
};
