import type { Value } from "@udecode/plate";
import { Plate, usePlateEditor, type PlateEditor as PlateEditorType } from "@udecode/plate/react";
import { Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { EditorContainer } from "@/components/plate-ui/editor";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { PlateEditor } from "@/components/editor/plate-editor";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { ReviewType, ReviewWithUser } from "@/app/api/reviews/types";

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
          {review?.user?.image_url &&
            (
              <Image
                src={review.user.image_url}
                alt={`User ${review.user.first_name} ${review.user.last_name}`}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          <div>
            <p className="font-semibold">{review?.user?.first_name} {review?.user?.last_name}</p>
            <p className="text-sm text-gray-500">{new Date(review.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div className="flex">
              {[...Array(5)].map((_, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Star key={j} className={`w-4 h-4 ${j < (review.rating ?? 0) ? "fill-yellow-400" : "fill-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        {user?.id === review?.user?.id && (
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {!!review?.content &&
        <PlateEditor editor={editor} readOnly variant='review' />
      }
    </div>
  )
}
