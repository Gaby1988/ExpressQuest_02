const express = require("express");
const database = require("./database");
const app = express();

const port = process.env.APP_PORT || 5000;

app.get("/", (req, res) => {
    res.send("Welcome to my favourite movie list");
});

app.get("/api/movies", database.getMovies);
app.get("/api/movies/:id", database.getMoviesById);

app.get("/api/users", database.getUsers);
app.get("/api/users/:id", database.getUsersById);

app.listen(port, (err) => {
    if (err) {
        console.error("Something bad happened");
    } else {
        console.log(`Server is listening on ${port}`);
    }
});
