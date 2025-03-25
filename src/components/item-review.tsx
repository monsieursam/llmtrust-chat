import type { Value } from "@udecode/plate";
import { Plate, usePlateEditor, type PlateEditor as PlateEditorType } from "@udecode/plate/react";
import { Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { EditorContainer } from "@/components/plate-ui/editor";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { PlateEditor } from "@/components/editor/plate-editor";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { ReviewType, ReviewWithUser } from "@/actions/reviews";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Review } from "@/db/schema";

interface Props {
  review: ReviewWithUser;
  type: ReviewType;
  id: string;
}

export default function ItemReview({ review, id, type }: Props) {
  const editor = useCreateEditor({
    value: review.content as string | Value | ((editor: PlateEditorType) => Value) | undefined,
  });

  const { user } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const response = await axios.delete(`/api/${type}/${id}/reviews/${review.id}`);
    router.refresh();
  };

  return (
    <div key={review.id} className="border-b py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {review.customer.image_url &&
            (
              <Image
                src={review.customer.image_url}
                alt={`User ${review.customer.first_name} ${review.customer.last_name}`}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          <div>
            <p className="font-semibold">{review.customer.first_name} {review.customer.last_name}</p>
            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div className="flex">
              {[...Array(5)].map((_, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Star key={j} className={`w-4 h-4 ${j < review.rating ? "fill-yellow-400" : "fill-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        {user?.id === review.customer.id && (
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {review.content && <PlateEditor editor={editor} readOnly variant='review' />}
    </div>
  )
}
