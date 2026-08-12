export type DietaryTag = "vegan" | "dairy-free" | "gluten-free" | "decaf";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  basePriceMinor: number;
  images: string[];
  isActive: boolean;
  dietaryTags: DietaryTag[];
};
