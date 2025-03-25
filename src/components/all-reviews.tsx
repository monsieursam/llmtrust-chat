'use client'


import type { ReviewType } from "@/app/api/reviews/types";
import ItemReview from "./item-review"
import { useReviews } from "@/hooks/use-reviews"
import { fetchAllReviews } from "@/actions/reviews";

interface Props {
  id: string;
  type: ReviewType;
}

export default async function AllReviews({ id, type }: Props) {
  const reviews = await fetchAllReviews({ id, type });

  return (
    <div className="space-y-6 grid gap-8 md:grid-cols-3">
      <section className="md:col-span-2">
        <div className="">
          {reviews.map((review, i) => (
            <ItemReview review={review} key={review.id} id={id} type={type} />
          ))}
        </div>
      </section>
    </div>
  )
}
