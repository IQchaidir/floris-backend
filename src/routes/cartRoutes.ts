import { OpenAPIHono } from "@hono/zod-openapi"
import { cartService } from "../services/cartService"
import { checkUserToken } from "../middlewares/check-user-token"
import { Hono } from "../libs/type"

const API_TAG = ["Cart"]

export const cartRoute = new OpenAPIHono<Hono>().openapi(
    {
        method: "get",
        path: "/",
        description: "Get user's cart",
        security: [{ BearerAuth: [] }],
        middleware: [checkUserToken()],
        responses: {
            200: {
                description: "Cart retrieved successfully",
            },
            404: {
                description: "Get Cart Failed",
            },
        },
        tags: API_TAG,
    },
    async (c) => {
        try {
            const user = c.get("user") as { id: string }
            const cart = await cartService.existingCart(user.id)

            return c.json({ cart }, 200)
        } catch (error: Error | any) {
            return c.json({ message: "Get Cart Failed", error: error.message }, 404)
        }
    }
)
