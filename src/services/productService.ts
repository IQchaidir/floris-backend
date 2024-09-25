import { PrismaClient, Product } from "@prisma/client"

const prisma = new PrismaClient()

export const productService = {
    async getAll(): Promise<Product[]> {
        return await prisma.product.findMany()
    },

    async getById(id: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id },
        })
    },

    async isExists(id: string): Promise<boolean> {
        const product = await prisma.product.findUnique({
            where: { id },
        })
        return product != null
    },

    async isNameExists(name: string): Promise<boolean> {
        const product = await prisma.product.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        })
        return product != null
    },

    async isSkuExists(sku: string): Promise<boolean> {
        const product = await prisma.product.findFirst({
            where: {
                sku: {
                    equals: sku,
                    mode: "insensitive",
                },
            },
        })
        return product != null
    },

    async create(data: {
        slug: string
        name: string
        imageURL: string
        price: number
        description: string
        sku: string
    }): Promise<string> {
        const newProduct = await prisma.product.create({
            data,
        })
        return newProduct.id
    },

    async deleteAll(): Promise<void> {
        await prisma.product.deleteMany()
    },

    async deleteById(id: string): Promise<void> {
        await prisma.product.delete({
            where: { id },
        })
    },

    async update(
        id: string,
        data: {
            slug?: string
            name?: string
            imageURL?: string
            price?: number
            description?: string
            sku?: string
        }
    ): Promise<void> {
        await prisma.product.update({
            where: { id },
            data,
        })
    },
}
