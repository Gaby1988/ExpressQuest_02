const { body, validationResult } = require("express-validator");

const validateMovie = (req, res, next) => {
	const { title, director, year, color, duration } = req.body;

	let errors = [];
	let errorMessage = "";

	switch (true) {
		case title == null:
			errorMessage = "The field 'title' is required";
			errors.push({ field: "title", message: errorMessage });
			break;
		case title.length >= 255:
			errorMessage = "Should contain less than 255 characters";
			errors.push({ field: "title", message: errorMessage });
		case director == null:
			errorMessage = "The field 'director' is required";
			errors.push({ field: "director", message: errorMessage });
			break;
		case year == null:
			errorMessage = "The field 'year' is required";
			errors.push({ field: "year", message: errorMessage });
			break;
		case color == null:
			errorMessage = "The field 'color' is required";
			errors.push({ field: "color", message: errorMessage });
			break;
		case duration == null:
			errorMessage = "The field 'duration' is required";
			errors.push({ field: "duration", message: errorMessage });
			break;
	}

	if (errors.length) {
		res.status(422).json({ validationErrors: errors });
	} else {
		next();
	}
};

const validateUser = [
	body("firstname").isLength({ max: 255 }),
	body("lastname").isLength({ max: 255 }),
	body("email").isEmail(),
	body("city").isLength({ max: 50 }),
	body("language").isLength({ max: 50 }),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(422).json({ validationErrors: errors.array() });
		} else {
			next();
		}
	},
];

module.exports = {
	validateMovie,
    validateUser,
};
