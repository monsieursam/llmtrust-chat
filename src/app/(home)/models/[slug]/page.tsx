


import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, Calendar, ThumbsUp, SquareArrowUpRight, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";

import { fetchAllReviews, fetchReviewsStatsByTypeById, ReviewType } from "@/actions/reviews";
// import ModelInterface from "@/components/client/models-interface";
import Script from "next/script";
import type { Metadata } from 'next';
import { fetchOneLLM } from "@/actions/models";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const llm = await fetchOneLLM(slug);

  return {
    title: `${llm.name} - Language Model Reviews & Ratings | LLMTrust`,
    description: `${llm?.description?.slice(0, 155)}...`,
    openGraph: {
      title: `${llm.name} - Language Model Reviews & Ratings`,
      description: llm.description || '',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${llm.name} - Language Model Reviews & Ratings`,
      description: llm.description || '',
    }
  }
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const llm = await fetchOneLLM(slug);
  const reviews = await fetchAllReviews({ id: llm.id, type: ReviewType.MODEL });
  const reviewStats = await fetchReviewsStatsByTypeById({ id: llm.id, type: ReviewType.MODEL });

  if (!llm) {
    return (
      <div className="p-4">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Model Not Found</h2>
          <p className="text-gray-600">The model you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Script id="review-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": llm.name,
          "description": llm.description,
          "applicationCategory": "AIApplication",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": llm.average_rating,
            "reviewCount": reviews.length,
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": reviews.map(review => ({
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": review.rating,
              "bestRating": "5",
              "worstRating": "1"
            },
            "author": {
              "@type": "Person",
              "name": `${review.user.first_name} ${review.user.last_name}`
            },
            "datePublished": review.createdAt
          }))
        })}
      </Script>

      {/* <ModelInterface llm={llm} reviews={reviews} reviewStats={reviewStats} /> */}
    </>
  );
}
