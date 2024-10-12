import { prisma } from "../libs/db"

export const cartService = {
    async existingCart(userId: string) {
        const existingCart = await prisma.cart.findFirst({
            where: { user_id: userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        })

        if (!existingCart) {
            const newCart = await prisma.cart.create({
                data: { user_id: userId },
                include: { items: { include: { product: true } } },
            })
            return newCart
        }

        return existingCart
    },

    async addItem(userId: string, productId: string, quantity: number) {
        const existingCart = await this.existingCart(userId)

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: existingCart.id,
                productId: productId,
            },
        })

        if (existingItem) {
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: {
                        increment: quantity,
                    },
                },
            })
            return updatedItem
        } else {
            const newItem = await prisma.cartItem.create({
                data: {
                    productId: productId,
                    quantity: quantity,
                    cartId: existingCart.id,
                },
            })
            return newItem
        }
    },

    async updateCart(itemId: string, quantity: number) {
        const existingItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true },
        })

        if (!existingItem) {
            throw new Error(`Cart item with ID ${itemId} does not exist.`)
        }

        if (!existingItem.product) {
            throw new Error(`Product associated with cart item ${itemId} does not exist.`)
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: quantity },
        })

        return updatedItem
    },

    async removeCartItem(itemId: string) {
        const existingItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
        })

        if (!existingItem) {
            throw new Error(`Cart item with ID ${itemId} does not exist.`)
        }

        await prisma.cartItem.delete({
            where: { id: itemId },
        })

        return { message: `Success remove item.` }
    },
}
