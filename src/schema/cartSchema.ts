import { z } from "zod"

export const cartItemSchema = z.object({
    productId: z.string().nonempty({ message: "Product ID is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
})

export const cartSchema = z.object({
    items: z.array(cartItemSchema),
    totalQuantity: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
})
