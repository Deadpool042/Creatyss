import { z } from "zod";

export const wooImageSchema = z.object({
  id: z.number().int(),
  src: z.url(),
  name: z.string().optional(),
  alt: z.string().optional(),
});

export const wooCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  description: z.string().default(""),
  parent: z.number().int(),
  menu_order: z.number().int(),
  image: wooImageSchema.nullish(),
});

export const wooProductCategoryRefSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
});

export const wooProductAttributeSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().optional(),
  position: z.number().int().optional(),
  visible: z.boolean().optional(),
  variation: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

export const wooProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  status: z.string(),
  featured: z.boolean(),
  description: z.string().default(""),
  short_description: z.string().default(""),
  sku: z.string().default(""),
  price: z.string().default(""),
  regular_price: z.string().default(""),
  sale_price: z.string().default(""),
  stock_quantity: z.number().int().nullable(),
  manage_stock: z.boolean(),
  images: z.array(wooImageSchema),
  categories: z.array(wooProductCategoryRefSchema),
  attributes: z.array(wooProductAttributeSchema).optional(),
});

export const wooVariationAttributeSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  option: z.string(),
});

export const wooVariationSchema = z.object({
  id: z.number().int(),
  sku: z.string().default(""),
  price: z.string().default(""),
  regular_price: z.string().default(""),
  sale_price: z.string().default(""),
  status: z.string().optional(),
  image: wooImageSchema.optional(),
  attributes: z.array(wooVariationAttributeSchema).optional(),
});

export type WooImage = z.infer<typeof wooImageSchema>;
export type WooCategory = z.infer<typeof wooCategorySchema>;
export type WooProductCategoryRef = z.infer<typeof wooProductCategoryRefSchema>;
export type WooProductAttribute = z.infer<typeof wooProductAttributeSchema>;
export type WooProduct = z.infer<typeof wooProductSchema>;
export type WooVariationAttribute = z.infer<typeof wooVariationAttributeSchema>;
export type WooVariation = z.infer<typeof wooVariationSchema>;

export type PreparedWooProduct = {
  product: WooProduct;
  variations: WooVariation[];
};

export const wordPressRenderedTextSchema = z.object({
  rendered: z.string().default(""),
});

export const wordPressPostSchema = z.object({
  id: z.number().int(),
  date: z.string().nullable().optional(),
  slug: z.string(),
  status: z.string(),
  title: wordPressRenderedTextSchema,
  excerpt: wordPressRenderedTextSchema,
  content: wordPressRenderedTextSchema,
  featured_media: z.number().int().optional().default(0),
});

export const wordPressMediaSchema = z.object({
  id: z.number().int(),
  source_url: z.url(),
  alt_text: z.string().optional().default(""),
});

export type WordPressPost = z.infer<typeof wordPressPostSchema>;
export type WordPressMedia = z.infer<typeof wordPressMediaSchema>;
