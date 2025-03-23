import {
  Star, Terminal, Calendar
} from "lucide-react"

import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { LLM } from "@/db/schema"

interface LLMCardProps {
  llm: LLM
}

export default function LLMCard({ llm }: LLMCardProps) {
  return (
    <Link href={`/models/${llm.slug}`} className="block">
      <Card key={llm.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {llm.name}
              {llm.api_access && <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant={'outline'}><Terminal className="w-4 h-4" /></Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This model provides API access for integration</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
            </div>
            <div>
              <Badge>{llm.provider}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground mb-4">{llm?.description?.slice(0, 155)}...</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {llm.average_rating &&
                <>
                  <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{llm.average_rating}</span>
                </>
              }
            </div>
            {llm.created_date && <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">
                {new Date(llm.created_date).toLocaleDateString()}
              </span>
            </div>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
