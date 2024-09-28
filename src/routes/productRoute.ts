import { OpenAPIHono } from "@hono/zod-openapi"
import { productIdSchema, productRequestSchema, productSlugSchema } from "../schema/productSchema"
import { productService } from "../services/productService"

const API_TAG = ["Products"]

export const productRoute = new OpenAPIHono()
    .openapi(
        {
            method: "get",
            path: "/",
            description: "Get all products or filter by name and sort",
            parameters: [
                {
                    name: "search",
                    in: "query",
                    required: false,
                    description: "Product name to search",
                    schema: { type: "string" },
                },
                {
                    name: "sort",
                    in: "query",
                    required: false,
                    description: "Sort by name or price",
                    schema: { type: "string", enum: ["name_asc", "name_desc", "price_asc", "price_desc"] },
                },
                {
                    name: "page",
                    in: "query",
                    required: false,
                    description: "Page number for pagination",
                    schema: { type: "integer", default: 1 },
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    description: "Number of products per page",
                    schema: { type: "integer", default: 10 },
                },
            ],
            responses: {
                200: {
                    description: "List of filtered, sorted, and paginated products",
                },
                404: {
                    description: "No products found",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const searchQuery = c.req.query("search")
                const sortQuery = c.req.query("sort")
                const page = parseInt(c.req.query("page") || "1")
                const limit = parseInt(c.req.query("limit") || "10")

                const products = await productService.getAll({
                    search: searchQuery,
                    sort: sortQuery,
                    page,
                    limit,
                })

                if (products.items.length === 0) {
                    return c.json(
                        {
                            message: "No products found",
                        },
                        404
                    )
                }

                return c.json({
                    message: "Success",
                    data: products.items,
                    totalItems: products.totalItems,
                    totalPages: products.totalPages,
                    currentPage: products.currentPage,
                })
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500)
            }
        }
    )
    .openapi(
        {
            method: "get",
            path: "/{slug}",
            description: "Get product by slug",
            request: {
                params: productSlugSchema,
            },
            responses: {
                200: {
                    description: "Product details",
                },
                404: {
                    description: "Product not found",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const slug = c.req.param("slug")
                if (!slug) {
                    return c.json({ message: "Product slug is required" }, 400)
                }

                const product = await productService.getBySlug(slug)

                if (!product) {
                    return c.json({ message: "Product not found" }, 404)
                }

                return c.json({
                    message: "Success",
                    data: product,
                })
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500)
            }
        }
    )
    .openapi(
        {
            method: "post",
            path: "/",
            description: "Create a new product",
            request: {
                body: {
                    content: {
                        "application/json": {
                            schema: productRequestSchema,
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Product created",
                },
                409: {
                    description: "Product with this name or SKU already exists",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const body = c.req.valid("json")

                if (
                    (await productService.isNameExists(body.name)) ||
                    (await productService.isSkuExists(body.sku))
                ) {
                    return c.json({ message: "Product with this name or SKU already exists" }, 409)
                }

                const productId = await productService.create(body)
                const product = await productService.getById(productId)

                return c.json(
                    {
                        message: "Success",
                        data: product,
                    },
                    201
                )
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500)
            }
        }
    )
    .openapi(
        {
            method: "delete",
            path: "/",
            description: "Delete all products",
            responses: {
                200: {
                    description: "Products deleted",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                await productService.deleteAll()
                return c.json({ message: "Success" })
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500)
            }
        }
    )
    .openapi(
        {
            method: "delete",
            path: "/{id}",
            description: "Delete product by id",
            request: {
                params: productIdSchema,
            },
            responses: {
                200: {
                    description: "Product deleted",
                },
                404: {
                    description: "Product not found",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const id = c.req.param("id")
                if (!id) {
                    return c.json({ message: "Product ID is required" }, 400)
                }

                const exists = await productService.isExists(id)

                if (!exists) {
                    return c.json({ message: "Product not found" }, 404)
                }

                await productService.deleteById(id)
                return c.json({ message: "Success" })
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500)
            }
        }
    )
    .openapi(
        {
            method: "put",
            path: "/{id}",
            description: "Update product by id",
            request: {
                params: productIdSchema,
                body: {
                    content: {
                        "application/json": {
                            schema: productRequestSchema,
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Product updated",
                },
                404: {
                    description: "Product not found",
                },
                409: {
                    description: "Product with this name or SKU already exists",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const body = c.req.valid("json")
                const id = c.req.param("id")

                if (!id) {
                    return c.json({ message: "Product ID is required" }, 400)
                }

                const exists = await productService.isExists(id)

                if (!exists) {
                    return c.json({ message: "Product not found" }, 404)
                }

                const currentProduct = await productService.getById(id)
                if (currentProduct) {
                    if (
                        (currentProduct.name !== body.name &&
                            (await productService.isNameExists(body.name))) ||
                        (currentProduct.sku !== body.sku && (await productService.isSkuExists(body.sku)))
                    ) {
                        return c.json({ message: "Product with this name or SKU already exists" }, 409)
                    }
                }

                await productService.update(id, body)
                const updatedProduct = await productService.getById(id)

                return c.json({
                    message: "Success",
                    data: updatedProduct,
                })
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500)
            }
        }
    )
