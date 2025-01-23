require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { Pool } = require("pg");

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// middleware to parse JSON
app.use(bodyParser());

// routes
// get all movies
router.get("/movies", async (ctx) => {
    try {
        const result = await pool.query("SELECT * FROM movies");
        ctx.body = result.rows;
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    }
});

// get a single movie by id
router.get("/movies/:id", async (ctx) => {
    try {
        const movie = await pool.query(
            "SELECT * FROM movies WHERE id = $1", [ctx.params.id]
        );

        if (movie.rows.length > 0) {
            ctx.status = 200;
            ctx.body = movie.rows[0];
        } else {
            ctx.status = 404 ;
            ctx.body = { error: "Movie not found" };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    }
}); 

// create new movie
router.post("/movies", async (ctx) => {
    const { name, year, seen } = ctx.request.body;
    
    // validate input
    const validationError = validateInput(name, year, seen);
    if (validationError) {
        ctx.status = 400;
        ctx.body = validationError;
        return;
    }

    try {
        const result = await pool.query(
            "INSERT INTO movies (name, year, seen) VALUES ($1, $2, $3) RETURNING *",
            [name, year, seen]
        );
        ctx.status = 201;
        ctx.body = result.rows[0];
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    }
});

// update a movie
router.put("/movies/:id", async (ctx) => {
    const { name, year, seen } = ctx.request.body;

    //validate input
    const validationError = validateInput(name, year, seen);
    if (validationError) {
        ctx.status = 400;
        ctx.body = validationError;
        return;
    }

    try {
        const result = await pool.query(
            "UPDATE movies SET name = $1, year = $2, seen = $3 WHERE id = $4",
            [name, year, seen, ctx.params.id]
        );
    
        if (result.rowCount === 0) {
            ctx.status = 404;
            ctx.body = { error: "Movie not found or no changes made" };
        } else {
            ctx.status = 200;
            ctx.body = { message: "Movie updated successfully" };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    }
});

// delete a movie
router.delete("/movies/:id", async (ctx) => {
    try {
        const result = await pool.query(
            "DELETE FROM movies WHERE id = $1", [ctx.params.id]
        );
    
        if (result.rowCount === 0) {
            ctx.status = 404;
            ctx.body = { error: "Movie not found" };
        } else {
            ctx.status = 200;
            ctx.body = { message: "Movie deleted successfully" };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    }
});

// register routes & start server
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
    console.log("Server is running...");
});

// function to validate input
function validateInput(name, year, seen) {
    if (!name || typeof name !== "string") {
        return { error: "Invalid name, a string is required." };
    }

    if (!Number.isInteger(year)) {
        return { error: "Invalid year, an integer is required." };
    }

    if (typeof seen !== "boolean") {
        return { error: "Invalid seen, a boolean is required." };
    }

    return null;
}