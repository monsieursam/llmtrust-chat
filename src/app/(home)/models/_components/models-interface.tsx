'use client'

import Image from "next/image";
import { Star, Copy, Check, CalendarIcon, Terminal } from "lucide-react";
// import AllReviews from "./all-reviews";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import { ReviewForm } from "./review-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ApiDocumentation } from "./api-documentation";
// import { Chat } from "./chat";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LLMWithAiApps } from "@/app/api/models/route";
import type { ReviewWithUser } from "@/app/api/reviews/types";

interface Props {
  llm: LLMWithAiApps;
  reviews: ReviewWithUser[];
  reviewStats: { [key: number]: number };
}

const queryClient = new QueryClient();

export default function ModelInterface({ llm, reviews, reviewStats }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 px-4 py-8">
          <div className="flex mb-4">
            <div className="flex-grow items-center">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-3xl font-semibold flex items-center">
                    <div>
                      {llm.name}
                    </div>
                    {llm.api_access && <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-2">
                          <Badge variant={'outline'}><Terminal className="w-4 h-4" /></Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This model provides API access for integration</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>}
                  </div>

                </div>

                <div className="flex gap-2 items-center">
                  <Badge variant="default" className="ml-2 text-sm">
                    {llm.provider}
                  </Badge>
                  {llm.created_date && <div className="flex items-center text-muted-foreground text-sm gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(llm.created_date).toLocaleDateString()}
                  </div>}
                </div>

              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="mb-2">
                    <Badge variant='secondary' onClick={() => {
                      navigator.clipboard.writeText(llm.slug);
                      setCopied(true);
                      toast("Model slug copied to clipboard");
                      setTimeout(() => setCopied(false), 2000);
                    }} className="cursor-pointer">
                      {llm.slug}
                      {copied ? <Check className="ml-2 h-3 w-3" /> : <Copy className="ml-2 h-3 w-3" />}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is the model identifier to use in API requests</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center mb-4 gap-2">
                <div className="flex mr-2">
                  {llm.average_rating && [1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Number(llm?.average_rating) ? "fill-yellow-400" : ""}`} />
                  ))}
                </div>
                <span className="text-lg font-semibold">{llm.average_rating}</span>
                <span className="text-gray-600">{reviews?.length || 0} reviews</span>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <section className="md:col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">About {llm.name}</h2>
                  <p className="text-gray-600 mb-4">{llm.description}</p>
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
              </div>
            </div>
          </div>
          <Tabs defaultValue="about" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              {llm.api_access && <TabsTrigger value="api">API</TabsTrigger>}
              {llm.api_access && <TabsTrigger value="chat">Chat</TabsTrigger>}
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              {/* <AllReviews id={llm.id} type={ReviewType.MODEL} /> */}
              <div className="my-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant={'outline'}>
                      Write a review
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-scroll">
                    <SheetHeader className="text-left">
                      <SheetTitle>Write a review</SheetTitle>
                      {/* <ReviewForm id={llm.id} type={ReviewType.MODEL} slug={llm.slug} /> */}
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </TabsContent>

            {llm.api_access && (
              <TabsContent value="api">
                {/* <ApiDocumentation llm={llm} /> */}
              </TabsContent>
            )}
            {llm.api_access && (
              <TabsContent value="chat">
                {/* <Chat llm={llm} /> */}
              </TabsContent>
            )}

            <TabsContent value="about">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <section className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Pricing Model</h3>
                    <div className="space-y-3">

                      <div className="flex justify-between">
                        <span className="text-gray-600">Input Token Cost:</span>
                        <span>{llm.pricing_input}$</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Output Token Cost:</span>
                        <span>{llm.pricing_output}$</span>
                      </div>
                    </div>
                  </section>
                </div>

                {/* <div className="space-y-6">
                  <section className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Parameters</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Context Length:</span>
                        <span>{llm.parameters.context_length || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model Size:</span>
                        <span>{llm.parameters.model_size || 'N/A'}</span>
                      </div>
                    </div>
                  </section>
                </div> */}
              </div>

              {llm.aiApps && llm.aiApps.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Top Applications Using This Model</h3>
                  <div className="space-y-4">
                    {llm.aiApps
                      .sort((a, b) => Number(b.average_rating) - Number(a.average_rating))
                      .map((app, index) => (
                        <Link href={`/aiapps/${app.slug}`} key={app.id}>
                          <div className="border rounded-lg p-4 my-4 hover:shadow-md transition-shadow bg-gradient-to-r from-background to-muted">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 text-2xl font-bold text-muted-foreground w-8">
                                {index === 0 && "🥇"}
                                {index === 1 && "🥈"}
                                {index === 2 && "🥉"}
                                {index > 2 && `#${index + 1}`}
                              </div>
                              {app.image && (
                                <div className="flex-shrink-0">
                                  <Image src={app.image} alt={app.name} width={50} height={50} className="rounded" />
                                </div>
                              )}
                              <div className="flex-grow">
                                <h4 className="font-medium text-lg">{app.name}</h4>
                                <div className="flex items-center text-sm text-gray-500">
                                  {/* <span className="mr-2">{app.category}</span> */}
                                  {Number(app.average_rating) > 0 && (
                                    <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                                      <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                                      <span className="font-semibold text-primary">{app.average_rating}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </section>
              )}
            </TabsContent>
          </Tabs>

        </div>
      </DndProvider>
    </QueryClientProvider>
  )
}
