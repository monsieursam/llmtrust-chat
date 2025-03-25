import type { Review } from "@/db/schema";


export interface ReviewWithUser extends Partial<Review> {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatarUrl: string | null;
  } | null;
}
