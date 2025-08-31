"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useBlockType } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion, stagger } from "motion/react";

export const LandingPage = () => {
  const { setBlockSolana, setBlockEthereum } = useBlockType();
  const router = useRouter();

  useEffect(() => {
    const pathType = localStorage.getItem("pathType");
    if (pathType) {
      if (pathType === "501") {
        setBlockSolana();
      } else if (pathType === "60") {
        setBlockEthereum();
      }
      router.push("/dashboard");
    }
  }, []);

  const handleSolana = () => {
    setBlockSolana();
    localStorage.setItem("pathType", "501");
    router.push("/dashboard");
    toast.success("Wallet selected!");
  };

  const handleEthereum = () => {
    setBlockEthereum();
    localStorage.setItem("pathType", "60");
    router.push("/dashboard");
    toast.success("Wallet selected!");
  };

  const containerVariants = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-svh sm:h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full flex justify-center mb-3"
          variants={itemVariants}
        >
          <Image
            src={"/coffer_logo.webp"}
            alt="coffer_logo"
            width={70}
            height={70}
          />
        </motion.div>
        <motion.div
          className="text-3xl sm:text-4xl font-semibold text-center"
          variants={itemVariants}
        >
          The go-to platform for managing your crypto
        </motion.div>
        <motion.div
          className="text-lg sm:text-xl text-primary/80 text-center mt-4"
          variants={itemVariants}
        >
          Choose blockchain to get started
        </motion.div>
        <motion.div
          className="flex gap-3 mt-3 justify-center"
          variants={itemVariants}
        >
          <Button
            className="px-8 py-6 text-md font-medium cursor-pointer"
            onClick={handleSolana}
          >
            Solana
          </Button>
          <Button
            className="px-7 py-6 text-md font-medium cursor-pointer"
            onClick={handleEthereum}
          >
            Ethereum
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
