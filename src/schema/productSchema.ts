import { z } from "zod"

// Skema untuk permintaan pembuatan produk
export const productRequestSchema = z.object({
    slug: z.string().min(1).openapi({ example: "example-product" }),
    name: z.string().min(1).openapi({ example: "Contoh Produk" }),
    imageURL: z.string().url().openapi({ example: "https://example.com/image.jpg" }),
    price: z.number().int().min(0).openapi({ example: 1000 }),
    description: z.string().openapi({ example: "Deskripsi produk" }),
    sku: z.string().min(1).openapi({ example: "SKU12345" }),
})

// Skema untuk parameter ID produk
export const productIdSchema = z.object({
    id: z.coerce.string().openapi({ example: "cuid-example-id" }), // Menggunakan string karena id adalah String di model
})
