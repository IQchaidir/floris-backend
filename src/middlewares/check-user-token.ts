import { createMiddleware } from "hono/factory"
import { prisma } from "../libs/db"
import { validateToken } from "../libs/token"

export const checkUserToken = () => {
    return createMiddleware(async (c, next) => {
        const authHeader = c.req.header("Authorization")
        if (!authHeader) {
            return c.json(
                {
                    status: "error",
                    message: "Unauthorized. Authorization header is required",
                },
                401
            )
        }

        const token = authHeader.split(" ")[1]
        if (!token) {
            return c.json(
                {
                    status: "error",
                    message: "Unauthorized. Token is required",
                },
                401
            )
        }

        const decodedToken = await validateToken(token)
        if (!decodedToken) {
            return c.json(
                {
                    status: "error",
                    message: "Unauthorized. Token is invalid",
                },
                401
            )
        }

        const userId = decodedToken.subject
        if (!userId) {
            return c.json(
                {
                    status: "error",
                    message: "Unauthorized. User ID doen't exist",
                },
                401
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        })

        if (!user) {
            return c.json(
                {
                    status: "error",
                    message: "User not found",
                },
                404
            )
        }

        c.set("user", user)

        await next()
    })
}
