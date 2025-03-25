'use client'

import type { ReviewType } from "@/actions/reviews"

import ItemReview from "./item-review"
import { useReviews } from "@/hooks/use-reviews"

interface Props {
  id: string;
  type: ReviewType;
}

export default function AllReviews({ id, type }: Props) {
  const { data: reviews, isLoading } = useReviews({ typeId: id, type });

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!reviews) {
    return <div>No reviews yet</div>
  }

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
