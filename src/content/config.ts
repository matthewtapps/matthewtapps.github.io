import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    isDraft: z.boolean().default(true),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

export const collections = { posts };
