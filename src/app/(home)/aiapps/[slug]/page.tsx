import Script from 'next/script'

import { fetchOneAIApp } from "@/actions/aiapps"

import type { Metadata } from 'next';
import AiAppInterface from '../_components/aiapps-interface';
import { fetchAllReviews, fetchReviewsStatsByTypeById, ReviewType } from '@/actions/reviews';


export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const app = await fetchOneAIApp(slug);

  return {
    title: `${app.name} - AI Application Reviews & Ratings | LLMTrust`,
    description: `${app?.description?.slice(0, 155)}...`,
    openGraph: {
      title: `${app.name} - AI Application Reviews & Ratings`,
      // description: app.description,
      images: app.image ? [{ url: app.image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${app.name} - AI Application Reviews & Ratings`,
      // description: app.description,
      images: app.image ? [app.image] : [],
    }
  }
}

export default async function AIAppProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const app = await fetchOneAIApp(slug);
  const reviews = await fetchAllReviews({ id: app.id, type: ReviewType.AIAPP });
  const reviewStats = await fetchReviewsStatsByTypeById({ id: app.id, type: ReviewType.AIAPP });

  return (
    <>
      <Script id="review-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": app.name,
          "description": app.description,
          "applicationCategory": "AIApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/OnlineOnly",
            "category": "AI Software"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": app.average_rating,
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
      <AiAppInterface
        app={app}
        reviews={reviews}
        reviewStats={reviewStats}
      />
    </>
  )
}
