import { OpenAPIHono } from "@hono/zod-openapi"
import { productIdSchema, productRequestSchema } from "../schema/productSchema"
import { productService } from "../services/productService"

const API_TAG = ["Products"]

export const productRoute = new OpenAPIHono()
    .openapi(
        {
            method: "get",
            path: "/",
            description: "Get all products",
            responses: {
                200: {
                    description: "List of products",
                },
            },
            tags: API_TAG,
        },
        async (c) => {
            try {
                const products = await productService.getAll()
                return c.json({
                    message: "Success",
                    data: products,
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
            path: "/{id}",
            description: "Get product by id",
            request: {
                params: productIdSchema, // Pastikan Anda telah mendefinisikan skema validasi untuk ID produk
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
                const id = c.req.param("id") // Mengambil ID dari parameter
                if (!id) {
                    return c.json({ message: "Product ID is required" }, 400) // Respons jika ID tidak ada
                }

                const product = await productService.getById(id) // Memanggil service dengan ID

                if (!product) {
                    return c.json({ message: "Product not found" }, 404) // Respons jika produk tidak ditemukan
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
                const id = c.req.param("id") // Mengambil ID dari parameter
                if (!id) {
                    return c.json({ message: "Product ID is required" }, 400) // Respons jika ID tidak ada
                }

                const exists = await productService.isExists(id) // Memeriksa apakah produk ada

                if (!exists) {
                    return c.json({ message: "Product not found" }, 404) // Respons jika produk tidak ditemukan
                }

                await productService.deleteById(id) // Menghapus produk berdasarkan ID
                return c.json({ message: "Success" }) // Respons sukses
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500) // Respons kesalahan internal server
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
                const body = c.req.valid("json") // Validasi dan ambil body dari permintaan
                const id = c.req.param("id") // Mengambil ID dari parameter

                if (!id) {
                    return c.json({ message: "Product ID is required" }, 400) // Respons jika ID tidak ada
                }

                const exists = await productService.isExists(id) // Memeriksa apakah produk ada

                if (!exists) {
                    return c.json({ message: "Product not found" }, 404) // Respons jika produk tidak ditemukan
                }

                const currentProduct = await productService.getById(id)
                if (currentProduct) {
                    if (
                        (currentProduct.name !== body.name &&
                            (await productService.isNameExists(body.name))) ||
                        (currentProduct.sku !== body.sku && (await productService.isSkuExists(body.sku)))
                    ) {
                        return c.json({ message: "Product with this name or SKU already exists" }, 409) // Respons jika nama atau SKU sudah ada
                    }
                }

                await productService.update(id, body) // Memperbarui produk dengan data baru
                const updatedProduct = await productService.getById(id) // Mendapatkan produk yang telah diperbarui

                return c.json({
                    message: "Success",
                    data: updatedProduct,
                }) // Respons sukses
            } catch (error) {
                console.error("Internal server error:", error)
                return c.json({ message: "Internal Server Error" }, 500) // Respons kesalahan internal server
            }
        }
    )
