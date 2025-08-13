import { Trash2 } from "lucide-react";
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

interface WalletProps {
  publicKey: string;
  privateKey: string;
  index: number;
}

export const WalletComponent = ({
  publicKey,
  privateKey,
  index,
}: WalletProps) => {
  return (
    <div className="mt-7 border rounded-2xl">
      <div className="flex justify-between items-center px-9 py-6">
        <div className="text-3xl font-medium">Wallet{index}</div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger className="hover:bg-secondary p-3 rounded-lg cursor-pointer">
              <Trash2 size={19} className="text-destructive" />
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
                <AlertDialogAction className="bg-destructive cursor-pointer text-white">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="bg-secondary/40 px-9 py-5 rounded-xl">
        <div>
          <div className="text-xl font-medium">Public Key</div>
          <div className="mt-2 text-muted-foreground font-light">
            {publicKey}
          </div>
        </div>
        <div className="mt-8">
          <div className="text-xl font-medium">Private Key</div>
          <div className="mt-2 text-muted-foreground font-light">
            {privateKey}
          </div>
        </div>
      </div>
    </div>
  );
};
