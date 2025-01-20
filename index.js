const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Database = require("better-sqlite3");

const app = new Koa();
const router = new Router();
const db = new Database("./database.db");

const PORT = 3000;

// middleware to parse JSON
app.use(bodyParser());

// routes
// get all movies
router.get("/movies", async (ctx) => {
    const movies = db.prepare("SELECT * FROM movies").all();
    ctx.body = movies;
});

// get a single movie by id
router.get("/movies/:id", async (ctx) => {
    const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(ctx.params.id);
    if (movie) {
        ctx.body = movie;
    } else {
        ctx.status = 400;
        ctx.body = { error: "Movie not found" };
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

    // convert JavaScript boolean to integer for SQLite
    const seenInt = seen ? 1 : 0;

    // prepare and run the SQL-statement
    const stmt = db.prepare("INSERT INTO movies (name, year, seen) VALUES (?, ?, ?)");
    const result = stmt.run(name, year, seenInt);

    ctx.status = 201;
    ctx.body = { id: result.lastInsertRowid, name, year, seen };
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

    // convert JavaScript boolean to integer for SQLite
    const seenInt = seen ? 1 : 0;

    const stmt = db.prepare("UPDATE movies SET name = ?, year = ?, seen = ? WHERE id = ?");
    const result = stmt.run(name, year, seenInt, ctx.params.id);

    if (result.changes === 0) {
        ctx.status = 404;
        ctx.body = { error: "Movie not found or no changes made" };
    } else {
        ctx.status = 200;
        ctx.body = { message: "Movie updated successfully" } ;
    }
});

// delete a movie
router.delete("/movies/:id", async (ctx) => {
    const stmt = db.prepare("DELETE FROM movies WHERE id = ?");
    const result = stmt.run(ctx.params.id);

    if (result.changes === 0) {
        ctx.status = 404;
        ctx.body = { error: "Movie not found" };
    } else {
        ctx.status = 200;
        ctx.body = { message: "Movie deleted successfully" };
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