import Image from "next/image";
import Link from "next/link";
import { Terminal, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { LLM } from "@/db/schema";

interface LatestModelShowcaseProps {
  latestModels: LLM[];
}

export function LatestModelShowcase({ latestModels }: LatestModelShowcaseProps) {
  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold text-center mb-6">Latest Models</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestModels.slice(0, 3).map((model) => (
          <Link href={`/models/${model.slug}`} key={model.id} className="block">
            <Card className="border h-full">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    {model.api_access && (
                      <Badge variant="outline" className="ml-1">
                        <Terminal className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  <Badge>{model.provider}</Badge>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  {model.created_date && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(model.created_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
