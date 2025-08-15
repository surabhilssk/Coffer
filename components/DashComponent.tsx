"use client";

import { AppBar } from "./AppBar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";

interface blockWallet {
  publicKey: string;
  privateKey: string;
}

const StorageKeys = {
  wallets: "crypto_wallets",
  mnemonics: "crypto_mnemonics",
  account_index: "crypto_account_index",
  visible_keys: "crypto_visible_private_keys",
};

export const DashComponent = () => {
  const router = useRouter();
  const [blockWallet, setBlockWallet] = useState<blockWallet[]>([]);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [accountIndex, setAccountIndex] = useState<number>(0);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const { blockType, setBlockType } = useBlockType();

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(StorageKeys.wallets, JSON.stringify(blockWallet));
      localStorage.setItem(StorageKeys.mnemonics, mnemonic);
      localStorage.setItem(StorageKeys.account_index, accountIndex.toString());
      localStorage.setItem(
        StorageKeys.visible_keys,
        JSON.stringify(visiblePrivateKeys)
      );
    } catch (error) {
      console.error("Error saving to local storage: ", error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedWallets = localStorage.getItem(StorageKeys.wallets);
      const savedMnemonic = localStorage.getItem(StorageKeys.mnemonics);
      const savedAccountIndex = localStorage.getItem(StorageKeys.account_index);
      const savedVisibleKeys = localStorage.getItem(StorageKeys.visible_keys);

      if (savedWallets) {
        setBlockWallet(JSON.parse(savedWallets));
      }
      if (savedMnemonic) {
        setMnemonic(savedMnemonic);
      }
      if (savedAccountIndex) {
        setAccountIndex(parseInt(savedAccountIndex, 10));
      }
      if (savedVisibleKeys) {
        setVisiblePrivateKeys(JSON.parse(savedVisibleKeys));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  const clearLocalStorage = () => {
    try {
      Object.values(StorageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  useEffect(() => {
    const pathType = localStorage.getItem("pathType");
    if (pathType) {
      const pathTypeInt = parseInt(pathType, 10);
      if (!isNaN(pathTypeInt)) {
        setBlockType(pathTypeInt);
      }
    }

    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (blockWallet.length > 0 || mnemonic) {
      saveToLocalStorage();
    }
  }, [blockWallet, mnemonic, accountIndex, visiblePrivateKeys]);

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

  const deleteWallet = (index: number) => {
    const newWallet = blockWallet.filter((_, i) => i !== index);
    const newVisibility = visiblePrivateKeys.filter((_, i) => i !== index);

    setBlockWallet(newWallet);
    setVisiblePrivateKeys(newVisibility);

    if (newWallet.length === 0) {
      clearWallets();
    }
    toast.success("Wallet deleted successfully!");
  };

  const clearWallets = () => {
    setBlockWallet([]);
    setVisiblePrivateKeys([]);
    setMnemonic("");
    setAccountIndex(0);
    clearLocalStorage();
    localStorage.removeItem("pathType");
    router.replace("/");
    toast.success("Wallets cleared successfully!");
  };

  return (
    <div>
      <AppBar />
      {!mnemonic && (
        <div className="mt-10 px-3 sm:px-16">
          <div className="text-4xl sm:text-5xl font-semibold">
            Secret Recovery Phrase
          </div>
          <div className="mt-3 text-primary/80 text-lg sm:text-xl">
            Save these words in a safe place.
          </div>
          <div className="mt-2 sm:flex sm:gap-2">
            <Input
              type="password"
              placeholder="Enter your secret phrase(or leave blank to generate)"
              onChange={(e) => {
                setMnemonicInput(e.target.value);
              }}
            />
            <Button
              className="px-5 py-6 text-sm font-medium cursor-pointer w-full mt-3 sm:mt-0 sm:w-auto"
              onClick={() => {
                generateWallet(accountIndex);
                setVisiblePrivateKeys([...visiblePrivateKeys, false]);
                setAccountIndex(accountIndex + 1);
                toast.success("Wallet generated successfully!");
              }}
            >
              {mnemonicInput ? "Add Wallet" : "Generate Wallet"}
            </Button>
          </div>
        </div>
      )}
      {(blockType === 501 || blockType === 60) && mnemonic && (
        <div className="mt-5 sm:px-16 px-3 pb-10">
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
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <div className="flex justify-center mt-7">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 font-light text-sm sm:text-lg">
                      {mnemonicArray.map((word, index) => {
                        return (
                          <div
                            key={index}
                            className="bg-secondary/40 w-36 sm:w-72 py-4 text-center rounded-sm hover:bg-ring/20"
                          >
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
          <div className="mt-10 sm:flex justify-between items-center">
            <div className="text-3xl sm:text-4xl font-semibold">
              {blockType === 501 ? "Solana Wallet" : "Ethereum Wallet"}
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <Button
                className="font-normal px-4 py-5 hover:cursor-pointer"
                onClick={() => {
                  generateWallet(accountIndex);
                  setVisiblePrivateKeys([...visiblePrivateKeys, false]);
                  setAccountIndex(accountIndex + 1);
                  toast.success("Wallet generated successfully!");
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
                      You&apos;re going to delete all wallets?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your wallet and keys from localstorage.
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
                  deleteWallet(index);
                }}
                copyPublicKey={() => {
                  navigator.clipboard.writeText(wallet.publicKey);
                  toast.success("Public key copied to clipboard!");
                }}
                copyPrivateKey={() => {
                  navigator.clipboard.writeText(wallet.privateKey);
                  toast.success("Private key copied to clipboard!");
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
