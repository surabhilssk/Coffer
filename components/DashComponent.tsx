"use client";

import { AppBar } from "./AppBar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { useBlockType } from "@/lib/store";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { WalletComponent } from "./WalletComponent";
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
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

interface blockWallet {
  publicKey: string;
  privateKey: string;
}

export const DashComponent = () => {
  const router = useRouter();
  const [blockWallet, setBlockWallet] = useState<blockWallet[]>([]);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [accountIndex, setAccountIndex] = useState<number>(0);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const { blockType } = useBlockType();

  const mnemonicArray = mnemonic.split(" ");

  const generateWallet = (accountIndex: number) => {
    const mnemonicValue =
      mnemonic || mnemonicInput.trim() || generateMnemonic();
    try {
      const seed = mnemonicToSeedSync(mnemonicValue);
      const path = `m/44'/${blockType}'/0'/${accountIndex}'`;
      console.log(path);
      const derivedSeed = derivePath(path, seed.toString("hex")).key;

      let publicKeyEncoded: string;
      let privateKeyEncoded: string;

      if (blockType === 501) {
        //Solana
        const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const publicKey = Keypair.fromSecretKey(secretKey).publicKey;
        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = publicKey.toBase58();
      } else if (blockType === 60) {
        //Ethereum
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        privateKeyEncoded = privateKey;
        const wallet = new ethers.Wallet(privateKey);
        publicKeyEncoded = wallet.address;
      } else {
        return null;
      }
      setBlockWallet([
        ...blockWallet,
        {
          publicKey: publicKeyEncoded,
          privateKey: privateKeyEncoded,
        },
      ]);
      setMnemonic(mnemonicValue);
      setMnemonicInput("");
      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
      };
    } catch (e) {
      console.error("Invalid mnemonic phrase", e);
      return null;
    }
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setVisiblePrivateKeys((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const clearWallets = () => {
    setBlockWallet([]);
    setVisiblePrivateKeys([]);
    setMnemonic("");
    setAccountIndex(0);
    router.replace("/");
  };

  return (
    <div>
      <AppBar />
      {!mnemonic && (
        <div className="mt-10 px-16">
          <div className="text-5xl font-semibold">Secret Recovery Phrase</div>
          <div className="mt-3 text-primary/80 text-xl">
            Save these words in a safe place.
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              type="password"
              placeholder="Enter your secret phrase(or leave blank to generate)"
              onChange={(e) => {
                setMnemonicInput(e.target.value);
              }}
            />
            <Button
              className="px-5 py-6 text-sm font-light cursor-pointer"
              onClick={() => {
                generateWallet(accountIndex);
                setVisiblePrivateKeys([...visiblePrivateKeys, false]);
                setAccountIndex(accountIndex + 1);
              }}
            >
              {mnemonicInput ? "Add Wallet" : "Generate Wallet"}
            </Button>
          </div>
        </div>
      )}
      {(blockType === 501 || blockType === 60) && mnemonic && (
        <div className="mt-5 px-16 pb-10">
          <div>
            <Accordion
              type="single"
              collapsible
              className="border px-7 py-5 rounded-xl"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-3xl font-semibold">
                  Your Secret Phrase
                </AccordionTrigger>
                <AccordionContent
                  asChild
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(mnemonic);
                  }}
                >
                  <div className="flex justify-center mt-7">
                    <div className="grid grid-cols-4 gap-2 font-light text-lg">
                      {mnemonicArray.map((word) => {
                        return (
                          <div className="bg-secondary/40 w-72 py-4 text-center rounded-sm hover:bg-ring/20">
                            {word}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-7 text-muted-foreground hover:text-ring">
                    <Copy size={18} />
                    <div>Click anywhere to copy</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="mt-10 flex justify-between items-center">
            <div className="text-4xl font-semibold">
              {blockType === 501 ? "Solana Wallet" : "Ethereum Wallet"}
            </div>
            <div className="flex gap-3">
              <Button
                className="font-normal px-4 py-5 hover:cursor-pointer"
                onClick={() => {
                  generateWallet(accountIndex);
                  setVisiblePrivateKeys([...visiblePrivateKeys, false]);
                  setAccountIndex(accountIndex + 1);
                }}
              >
                Add Wallet
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="font-normal px-4 py-5 self-end hover:cursor-pointer"
                    variant={"destructive"}
                  >
                    Clear Wallets
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      You're going to delete this wallet?
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
                      onClick={clearWallets}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div>
            {blockWallet.map((wallet, index) => (
              <WalletComponent
                key={wallet.publicKey}
                index={index + 1}
                privateKey={wallet.privateKey}
                publicKey={wallet.publicKey}
                isPrivateKeyVisible={visiblePrivateKeys[index]}
                onTogglePrivateKey={() => togglePrivateKeyVisibility(index)}
                onDeleteWallet={() => {
                  const newWallet = blockWallet.filter((_, i) => i !== index);
                  const newVisibility = visiblePrivateKeys.filter(
                    (_, i) => i !== index
                  );
                  setBlockWallet(newWallet);
                  setVisiblePrivateKeys(newVisibility);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
