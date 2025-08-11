import Image from "next/image";
import { ModeToggle } from "./ModeToggle";

export const AppBar = () => {
  return (
    <div className="fixed top-0 right-0 left-0 flex justify-between px-10 py-8">
      <div className="flex gap-2">
        <Image
          src={"/coffer_logo.webp"}
          alt="coffer_logo"
          height={40}
          width={40}
          className="flex flex-col justify-center"
        />
        <div className="flex flex-col justify-center text-3xl font-extrabold">
          Coffer
        </div>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
};
