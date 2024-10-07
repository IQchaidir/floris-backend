import { z } from "zod"

export const productRequestSchema = z.object({
    slug: z.string().min(1).openapi({ example: "example-product" }),
    name: z.string().min(1).openapi({ example: "Contoh Produk" }),
    imageURL: z.string().url().openapi({ example: "https://example.com/image.jpg" }),
    price: z.number().int().min(0).openapi({ example: 1000 }),
    description: z.string().openapi({ example: "Deskripsi produk" }),
    sku: z.string().min(1).openapi({ example: "SKU12345" }),
})

export const productIdSchema = z.object({
    id: z.coerce.string().openapi({ example: "cuid-example-id" }),
})

export const productSlugSchema = z.object({
    slug: z.string().min(1, "Slug is required"),
})
