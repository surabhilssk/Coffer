import Image from "next/image";
import { ModeToggle } from "./ModeToggle";

export const AppBar = () => {
  return (
    <div className="flex justify-between sm:px-16 px-6 py-8">
      <div className="flex gap-2">
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
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
};
