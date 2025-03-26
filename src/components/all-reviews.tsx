import type { ReviewType } from "@/app/api/reviews/types";
import ItemReview from "./item-review"
import { fetchAllReviews } from "@/actions/reviews";

interface Props {
  slug: string;
  type: ReviewType;
}

export default async function AllReviews({ slug, type }: Props) {
  const reviews = await fetchAllReviews({ slug, type });

  return (
    <div className="space-y-6 grid gap-8 md:grid-cols-3 p-4">
      <section className="md:col-span-2">
        <div className="">
          {reviews?.map((review, i) => (
            <ItemReview review={review} key={review.id} slug={slug} type={type} />
          ))}
        </div>
      </section>
    </div>
  )
}
