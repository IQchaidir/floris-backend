import { prisma } from "../libs/db"

export const userService = {
    async getAllUserIds() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
            },
        })
        return users
    },
}
