import type { Review, User } from "@/db/schema";

export type ReviewWithUser = Partial<Review> & {
  user: Partial<User> | null
}

export enum ReviewType {
  AIAPP = "aiapps",
  MODEL = "models",
}
