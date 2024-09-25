import { OpenAPIHono } from "@hono/zod-openapi"
import { swaggerUI } from "@hono/swagger-ui"
import { HomePage } from "./home-page"
import { productRoute } from "./routes/productRoute"
import { cors } from "hono/cors"

const app = new OpenAPIHono()
app.use(
    "*",
    cors({
        origin: "*",
    })
)

app.route("/api/products", productRoute)
    .doc31("/docs", {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Peak Route Rest Api",
            description:
                "The Mountain API provides access to detailed information about mountains in Indonesia, including their associated climbing routes. This API enables users to retrieve data about each mountain, including its name, height, and geographical location, as well as the different climbing routes available for each mountain.",
        },
    })
    .get("/ui", swaggerUI({ url: "/docs" }))
    .get("/", (c) => {
        return c.html(
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Peak Routes REST API</title>
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
