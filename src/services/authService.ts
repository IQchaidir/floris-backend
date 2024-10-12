import { prisma } from "../libs/db"
import { hashPassword, verifyPassword } from "../libs/password"
import { createToken } from "../libs/token"

export const authService = {
    async register({ username, email, password }: { username: string; email: string; password: string }) {
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        })

        if (existingUser) {
            throw new Error("User already exists")
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: { create: { hash: hashedPassword } },
            },
            select: { id: true, username: true, email: true },
        })

        return user
    },

    async login({ username, password }: { username: string; password: string }) {
        const user = await prisma.user.findUnique({
            where: { username },
            include: { password: { select: { hash: true } } },
        })

        if (!user || !user.password?.hash || !(await verifyPassword(user.password.hash, password))) {
            throw new Error("Invalid username or password")
        }

        const token = await createToken(user.id)
        if (!token) {
            throw new Error("Failed to generate token")
        }

        return {
            token,
            user: { id: user.id, username: user.username, email: user.email },
        }
    },

    async getUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new Error("User not found")
        }

        const totalProductsInCart = await prisma.cartItem.aggregate({
            _sum: {
                quantity: true,
            },
            where: {
                cart: {
                    user_id: userId,
                },
            },
        })

        return {
            ...user,
            totalCart: totalProductsInCart._sum.quantity,
        }
    },
}
