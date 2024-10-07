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
        const product = await prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) {
            throw new Error(`Product with ID ${productId} does not exist.`)
        }

        // if (quantity > product.stock) {
        //     throw new Error(`Insufficient stock for product ID ${productId}. Available stock: ${product.stock}`);
        // }

        const existingCart = await this.existingCart(userId)

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: existingCart.id,
                productId: productId,
            },
        })

        if (existingItem) {
            // const newQuantity = existingItem.quantity + quantity;
            // if (newQuantity > product.stock) {
            //     throw new Error(`Adding ${quantity} exceeds available stock for product ID ${productId}. Available stock: ${product.stock}`);
            // }

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
}
