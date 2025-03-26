'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Info, Wallet } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@clerk/nextjs";
import { useCredits } from "@/hooks/use-credits";
import useFetch from "@/hooks/use-fetch";


function WalletButton() {
  const { data: balance } = useCredits();
  const [amount, setAmount] = useState(5);
  const { isSignedIn } = useAuth();
  const authenticateFetch = useFetch();

  const fee = 0.50;
  const total = amount + fee;
  const router = usePathname();

  const handleAddFunds = async () => {
    localStorage.setItem('previousPage', router);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');
    const response = await authenticateFetch('/api/stripe', { method: 'POST', body: JSON.stringify({ total, amount }) });
    const data = await response.json();

    await stripe?.redirectToCheckout({ sessionId: data.data.id });
  };

  return (
    <div className="flex gap-2 items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={!isSignedIn}><Wallet className="w-5 h-5" />
                    <span className="font-medium">${balance}</span></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add Funds to Your Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter the amount you want to add to your account balance. A fee will be added to cover infrastructure costs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">$</span>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Base amount: ${amount.toFixed(2)}</div>
                      <div className="flex items-center gap-1">
                        Fee : ${fee}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This fee covers infrastructure costs (servers, API gateway).</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="font-medium">Total: ${total.toFixed(2)} HT</div>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAddFunds()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TooltipTrigger>
          {!isSignedIn && (
            <TooltipContent>
              <p>Please sign in to add funds to your account</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function WalletButtonContainer() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <WalletButton />
    </QueryClientProvider>
  )
}
