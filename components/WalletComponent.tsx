"use client";

import { EllipsisVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useBlockType } from "@/lib/store";

interface WalletProps {
  publicKey: string;
  privateKey: string;
  index: number;
  isPrivateKeyVisible: boolean;
  solAmount?: string;
  onTogglePrivateKey: () => void;
  onDeleteWallet: () => void;
  copyPublicKey: () => void;
  copyPrivateKey: () => void;
  balanceCheck?: () => void;
  airdrop?: () => void;
}

export const WalletComponent = ({
  publicKey,
  privateKey,
  index,
  isPrivateKeyVisible,
  solAmount,
  balanceCheck,
  airdrop,
  onTogglePrivateKey,
  onDeleteWallet,
  copyPublicKey,
  copyPrivateKey,
}: WalletProps) => {
  const { blockType } = useBlockType();
  const maskPrivateKey = (key: string) => {
    return "•".repeat(key.length);
  };

  return (
    <div className="mt-7 border rounded-2xl">
      <div className="flex justify-between items-center px-9 py-6">
        <div className="text-3xl font-medium">Wallet{index}</div>
        <div className="flex gap-3 sm:gap-2">
          {blockType === 501 && (
            <div className="flex items-center">
              <AlertDialog>
                <AlertDialogTrigger className="hover:bg-secondary p-3 rounded-lg cursor-pointer">
                  <EllipsisVertical size={19} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-3xl text-center">
                      Wallet Balance
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="text-center">
                        <div className="text-xs text-center">
                          Note: These features are only available on the devnet.
                        </div>
                        <div className="flex justify-center gap-1 mt-5">
                          <div className="text-4xl bg-secondary/80 p-1 rounded-md">
                            {solAmount}
                          </div>
                          <div className="flex items-center">SOL</div>
                        </div>
                        <div className="flex gap-2 mt-5 justify-center">
                          <div>
                            <Button
                              size="lg"
                              className="cursor-pointer"
                              onClick={balanceCheck}
                            >
                              Check Balance
                            </Button>
                          </div>
                          <div>
                            <Button
                              size="lg"
                              className="cursor-pointer"
                              onClick={airdrop}
                            >
                              Airdrop 1 SOL
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="w-full cursor-pointer">
                      Go Back
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          <div>
            <AlertDialog>
              <AlertDialogTrigger className="hover:bg-secondary p-3 rounded-lg cursor-pointer">
                <Trash2 size={19} className="text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    You&apos;re going to delete this wallet?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your wallet and keys from local storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive cursor-pointer text-white"
                    onClick={onDeleteWallet}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <div className="bg-secondary/40 px-9 py-5 rounded-xl">
        <div>
          <div className="text-xl font-medium">Public Key</div>
          <div
            className="mt-2 text-muted-foreground font-light sm:w-fit hover:text-primary cursor-pointer truncate"
            onClick={copyPublicKey}
          >
            {publicKey}
          </div>
        </div>
        <div className="mt-8">
          <div className="text-xl font-medium">Private Key</div>
          <div className="flex justify-between items-center mt-2">
            <div
              className="text-muted-foreground font-light sm:w-fit hover:text-primary cursor-pointer truncate"
              onClick={copyPrivateKey}
            >
              {isPrivateKeyVisible ? privateKey : maskPrivateKey(privateKey)}
            </div>
            <div>
              <Button
                variant={"ghost"}
                className="cursor-pointer"
                onClick={onTogglePrivateKey}
              >
                {isPrivateKeyVisible ? (
                  <Eye size={20} className="text-muted-foreground" />
                ) : (
                  <EyeOff size={20} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
