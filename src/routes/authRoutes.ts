import { OpenAPIHono } from "@hono/zod-openapi"
import { authService } from "../services/authService"
import { registerSchema, loginSchema } from "../schema/authSchema"
import { checkUserToken } from "../middlewares/check-user-token"
import { Hono } from "../libs/type"

const API_TAG = ["Auth"]

export const authRoute = new OpenAPIHono<Hono>()
    .openapi(
        {
            method: "post",
            path: "/register",
            description: "Register a new user",
            request: {
                body: {
                    content: {
                        "application/json": {
                            schema: registerSchema,
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "User registered successfully",
                },
                400: {
                    description: "Invalid input or registration failed",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const body = c.req.valid("json")
                const user = await authService.register(body)

                return c.json({ message: "User registered", user }, 201)
            } catch (error: Error | any) {
                return c.json({ message: "Registration failed", error: error.message }, 400)
            }
        }
    )
    .openapi(
        {
            method: "post",
            path: "/login",
            description: "Login a user",
            request: {
                body: {
                    content: {
                        "application/json": {
                            schema: loginSchema,
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Login successful",
                },
                401: {
                    description: "Invalid email or password",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const body = c.req.valid("json")
                const { token, user } = await authService.login(body)

                return c.json({ token, user }, 200)
            } catch (error: Error | any) {
                return c.json({ message: "Login failed", error: error.message }, 400)
            }
        }
    )
    .openapi(
        {
            method: "get",
            path: "/me",
            summary: "Get user profile",
            security: [{ BearerAuth: [] }],
            middleware: [checkUserToken()],
            responses: {
                200: {
                    description: "User profile retrieved successfully",
                },
                401: {
                    description: "Unauthorized",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const user = c.get("user") as { id: string }
                const result = await authService.getUser(user.id)

                return c.json({ status: "success", data: result }, 200)
            } catch (error: Error | any) {
                return c.json({ message: error.message || "Failed to get profile" }, 401)
            }
        }
    )
