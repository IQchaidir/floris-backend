import { OpenAPIHono } from "@hono/zod-openapi"
import { swaggerUI } from "@hono/swagger-ui"
import { HomePage } from "./home-page"
import { productRoute } from "./routes/productRoute"
import { cors } from "hono/cors"
import { authRoute } from "./routes/authRoutes"
import { userRoute } from "./routes/userRoutes"
import { cartRoute } from "./routes/cartRoutes"

const app = new OpenAPIHono()
app.use(
    "*",
    cors({
        origin: "*",
    })
)

app.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
    type: "http",
    scheme: "bearer",
})

app.route("/api/products", productRoute)
app.route("/api/users", userRoute)
app.route("/api/auth", authRoute)
app.route("/api/cart", cartRoute)
    .doc31("/docs", {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Floris Rest API",
            description:
                "Floris rest API provides access to simple e commerce plantFloris is an API designed for an e-commerce platform that specializes in selling a variety of houseplants. The API allows users to browse, search, filter, and purchase plants while providing features for managing products, orders, and user accounts.",
        },
    })
    .get("/ui", swaggerUI({ url: "/docs" }))
    .get("/", (c) => {
        return c.html(
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>FLORIS REST API</title>
                    <meta name="description" content="Web API about routes" />
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body>
                    <HomePage />
                </body>
            </html>
        )
    })

export default {
    port: 3000,
    fetch: app.fetch,
}
