import { Prisma, PrismaClient, Product } from "@prisma/client"

const prisma = new PrismaClient()

interface ProductFilter {
    search?: string
    category?: string
    sort?: string
}

export const productService = {
    async getAll(filters: ProductFilter): Promise<Product[]> {
        const { search, category, sort } = filters

        const whereConditions: Prisma.ProductWhereInput = {}

        if (search) {
            whereConditions.name = {
                contains: search,
                mode: "insensitive",
            }
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput[] = []
        if (sort) {
            if (sort === "name_asc") {
                orderBy.push({ name: "asc" })
            } else if (sort === "name_desc") {
                orderBy.push({ name: "desc" })
            } else if (sort === "price_asc") {
                orderBy.push({ price: "asc" })
            } else if (sort === "price_desc") {
                orderBy.push({ price: "desc" })
            }
        }

        return await prisma.product.findMany({
            where: whereConditions,
            orderBy: orderBy,
        })
    },

    async getById(id: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id },
        })
    },

    async getBySlug(slug: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { slug },
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
