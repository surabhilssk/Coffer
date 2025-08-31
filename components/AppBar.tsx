"use client";

import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import { motion } from "motion/react";

export const AppBar = () => {
  return (
    <motion.div
      className="flex justify-between sm:px-16 px-6 py-8"
      initial={{
        y: -20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <div className="flex items-center gap-2">
        <Image
          src={"/coffer_logo.webp"}
          alt="coffer_logo"
          height={40}
          width={40}
          className="flex flex-col justify-center"
        />
        <div className="flex flex-col justify-center text-2xl sm:text-3xl font-extrabold">
          Coffer
        </div>
        <div className="flex items-center border border-foreground rounded-full bg-secondary/50 h-fit w-fit px-2 font-semibold text-sm">
          v1.2
        </div>
      </div>
      <div>
        <ModeToggle />
      </div>
    </motion.div>
  );
};
