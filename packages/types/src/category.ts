export type CategorySlug =
  "coffee" | "tea" | "food" | "bakery" | "beans" | "merch";

export type Category = {
  id: string;
  slug: CategorySlug;
  name: string;
  sortOrder: number;
};
