'use client'

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AiApp, Review } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import AllReviews from "@/components/all-reviews";
import { ReviewType, type ReviewWithUser } from "@/app/api/reviews/types";
import type { AiAppWithLLM } from "@/app/api/aiapps/route";
import { ReviewForm } from "@/components/review-form";

interface Props {
  app: AiAppWithLLM;
  reviewStats: { [key: number]: number };
  reviews: ReviewWithUser[];
}

const queryClient = new QueryClient();

export default function AiAppInterface({ app, reviewStats, reviews }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                {app.image && <Image
                  src={app.image}
                  alt={app.name}
                  width={80}
                  height={80}
                  className="rounded-lg bg-white p-2"
                />}
                <div>
                  <h1 className="text-3xl font-bold">{app.name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <Star key={j} className={`w-4 h-4 ${j < Number(app.average_rating || '') ? "fill-yellow-400" : "fill-gray-300"}`} />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{app.average_rating}</span>
                    <span className="text-gray-500">({app.reviews.length} reviews)</span>
                  </div>
                  {app.llms.map((llm) => (
                    <Link href={`/models/${llm?.slug}`} key={llm.id} >
                      <Badge variant={'outline'} >{llm.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </header>

          <main className="grid gap-8 md:grid-cols-3">
            <section className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">About {app.name}</h2>
              <p className="text-gray-600 mb-4">
                {app.description}
              </p>

              <div className="flex gap-4">
                <a href={app.website || ''} target="_blank" rel="noreferrer">
                  <Button>Visit Website</Button>
                </a>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant={'outline'}>
                      Write a review
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-scroll">
                    <SheetHeader className="text-left">
                      <SheetTitle>Write a review</SheetTitle>
                      <ReviewForm id={app.id} type={ReviewType.AIAPP} slug={app.slug} />
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Review Summary</h2>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-4">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Progress value={reviewStats[rating] * 100 / reviews.length} className="flex-grow" />
                  </div>
                ))}
              </div>
            </section>
          </main>
          <AllReviews id={app.id} type={ReviewType.AIAPP} />

        </div>
      </DndProvider>
    </QueryClientProvider>
  )
}
