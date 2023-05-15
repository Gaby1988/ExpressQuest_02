const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
});

async function getMovies(req, res) {
	let initialSql = "SELECT * FROM movies";
	let where = [];
	try {
		if (req.query.color != null) {
			where.push({
				column: "color",
				value: req.query.color,
				operator: "=",
			});
		}
		if (req.query.max_duration != null) {
			where.push({
				column: "duration",
				value: req.query.max_duration,
				operator: "<=",
			});
		}
		const [movies] = await pool.query(
			where.reduce(
				(sql, { column, operator }, index) =>
					`${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
				initialSql
			),
			where.map(({ value }) => value)
		);
		if (movies) {
			return res.status(200).json(movies);
		} else {
			return res.status(404).send("No movies");
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server Error");
	}
}

async function getMoviesById(req, res) {
	const id = parseInt(req.params.id);
	try {
		const moviesId = await pool.query("SELECT *  FROM movies where id = ?", [
			id,
		]);
		if (moviesId.length === 0) {
			return res.status(404).json({ message: "Movies not found" });
		}
		return res.json(moviesId[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error" });
	}
}

const getUsers = async (req, res) => {
  let initialSql = "SELECT * FROM users";
  let where = [];
	try {
    if (req.query.language != null) {
      where.push({
        column: "language",
        value: req.query.language,
        operator: "=",
      });
    }
    if (req.query.city != null) {
      where.push({
        column: "city",
        value: req.query.city,
        operator: "=",
      });
    }
		const [users] = await pool.query(where.reduce(
      (sql, { column, operator }, index) => 
      `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
      initialSql
    ),
    where.map(({ value }) => value)
    );
		if (users) {
			return res.status(200).json(users);
		} else {
			return res.status(404).send("Not user found");
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server error !!");
	}
};

const getUsersById = async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const usersId = await pool.query("SELECT * FROM users where id = ?", [id]);
		if (usersId.length === 0) {
			return res.status(404).send("Not users here");
		} else {
			return res.status(200).json(usersId[0]);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server lost, not your fault");
	}
};

const postMovie = (req, res) => {
	const { title, director, year, color, duration } = req.body;

	pool.query(
		"INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
		[title, director, year, color, duration],
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send("Error saving the movie");
			} else {
				res.location(`/api/movies/${result.insertId}`).sendStatus(201);
			}
		}
	);
};

const postUser = (req, res) => {
	const { firstname, lastname, email, city, language } = req.body;

	pool.query(
		"INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
		[firstname, lastname, email, city, language],
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send("Try again 😂🤣");
			} else {
				res.location(`/api/users/${result.insertId}`).sendStatus(201);
			}
		}
	);
};

const putMovie = (req, res) => {
	const id = parseInt(req.params.id);
	const { title, director, year, color, duration } = req.body;

	pool.query(
		"UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
		[title, director, year, color, duration, id],
		(err, [result]) => {
			if (err) {
				console.error(err);
				res.status(500).send("Error editing the movie");
			} else if (result.affectedRows === 0) {
				res.status(404).send("Oups not found !!");
			} else {
				res.sendStatus(204);
			}
		}
	);
};

function putUser(req, res) {
	const id = parseInt(req.params.id);
	const { firstname, lastname, email, city, language } = req.body;

	pool.query(
		"UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
		[firstname, lastname, email, city, language, id],
		(err, [result]) => {
			if (err) {
				console.error(err);
				res.status(500).send("ERRORRRRRRRRRRRRRRR");
			} else if (result.affectedRows === 0) {
				res.status(404).send("Unkown path");
			} else {
				res.sendStatus(204);
			}
		}
	);
}

const deleteMovie = (req, res) => {
	const id = parseInt(req.params.id);

	pool.query("DELETE FROM movies WHERE id = ?", [id], (err, [result]) => {
		if (err) {
			console.error(err);
			res.status(500).send("Error not delete");
		} else if (result.affectedRows === 0) {
			res.status(404).send("No no found");
		} else {
			res.sendStatus(204);
		}
	});
};

function deleteUser(req, res) {
	const id = parseInt(req.params.id);
	pool.query("DELETE FROM users WHERE id = ?", [id], (err, [result]) => {
		if (err) {
			console.error(err);
			res.status(500).send("Error not delete");
		} else if (result.affectedRows === 0) {
			res.status(404).send("No no found");
		} else {
			res.sendStatus(204);
		}
	});
}

module.exports = {
	getMovies,
	getMoviesById,
	getUsers,
	getUsersById,
	postMovie,
	postUser,
	putMovie,
	putUser,
	deleteMovie,
	deleteUser,
};
