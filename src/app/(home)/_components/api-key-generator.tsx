'use client';

import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useApiKeys } from "@/hooks/use-apikeys";
import { useAuth } from "@clerk/nextjs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export function ApiKeyGenerator() {
  const { createApiKey, isCreating, apiKeys } = useApiKeys();
  const { isSignedIn } = useAuth();

  const generateApiKey = async () => {
    await createApiKey();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKeys?.[0]?.key || '');
    toast("API key has been copied to your clipboard");
  };

  return (
    <div className="space-y-3">
      <p className="text-gray-600 mb-2">
        Generate an API key to authenticate your requests. Keep your API keys secure - anyone with your key can make requests on your behalf.
      </p>

      {apiKeys?.length ? (
        <div className="flex items-center space-x-2">
          <pre className="bg-muted p-3 rounded-lg flex-grow overflow-x-auto">
            <code className="text-sm">{apiKeys?.[0]?.key}</code>
          </pre>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">No API keys generated yet</p>
      )}

      {!apiKeys?.length && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={generateApiKey}
                  disabled={isCreating || !isSignedIn}
                  className="mt-2"
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate API Key
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {!isSignedIn && (
              <TooltipContent>
                <p>Please sign in to generate an API key</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
