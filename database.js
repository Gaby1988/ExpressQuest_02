const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
});

async function getMovies(req, res) {
	try {
		const movies = await pool.query("SELECT * FROM movies");
		if (movies) {
			return res.status(200).json(movies);
		} else {
			return res.status(404).json({ message: "No movies" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error" });
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
  try {
    const users = await pool.query("SELECT * FROM users");
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).send("Not user found");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error !!");
  }
}

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
}

module.exports = { getMovies, getMoviesById, getUsers, getUsersById };
