import { z } from "zod"

export const registerSchema = z.object({
    username: z.string().min(4).max(100).openapi({ example: "new_user" }),
    email: z.string().email().openapi({ example: "user@example.com" }),
    password: z.string().min(8).openapi({ example: "password123" }),
})

export const loginSchema = z.object({
    username: z.string().min(4).max(100).openapi({ example: "new_user" }),
    password: z.string().min(8).openapi({ example: "password123" }),
})
