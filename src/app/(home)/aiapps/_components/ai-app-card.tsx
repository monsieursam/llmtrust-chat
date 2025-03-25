import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AiAppWithLLM } from "@/app/api/aiapps/route"

interface Props {
  app: AiAppWithLLM
}

export default function AIAppCard({ app }: Props) {
  return (
    <Link href={`/aiapps/${app.slug}`} className="block h-full">
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          {app.image &&
            <Image src={app.image} alt={app.name} width={60} height={60} className="rounded-lg" />
          }
          <div>
            <h3 className="font-semibold text-lg">{app.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {app.llms.map((llm) => <Badge variant="outline" key={llm.id}>{llm.name}</Badge>)}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{app?.description?.slice(0, 155)}</p>
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center">
            {app.average_rating &&
              <>
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="ml-1 text-sm font-semibold">{app.average_rating}</span>
              </>
            }
          </div>
          {/* <span className="text-sm text-gray-500">({app.reviewCount} reviews)</span> */}
        </div>
      </div>
    </Link>
  )
}
