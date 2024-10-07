import { OpenAPIHono } from "@hono/zod-openapi"
import { userService } from "../services/userService" // Pastikan path ini sesuai

const API_TAG = ["Users"]

export const userRoute = new OpenAPIHono().openapi(
    {
        method: "get",
        path: "/",
        description: "Get all user IDs",
        responses: {
            200: {
                description: "Success get user IDs",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
            404: {
                description: "No users found",
            },
        },
        tags: API_TAG,
    },
    async (c) => {
        try {
            const users = await userService.getAllUserIds()

            if (users.length === 0) {
                return c.json(
                    {
                        message: "No users found",
                        data: [],
                    },
                    404
                )
            }

            return c.json({
                message: "Success",
                data: users,
            })
        } catch (error) {
            console.error("Internal server error:", error)
            return c.json({ message: "Internal Server Error" }, 500)
        }
    }
)
