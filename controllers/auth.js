const { User } = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
	try {
		// unpack the body of the request to get the data
		let { username, email, password } = req.body;
		// validate that all data are filled
		if (!username || !email || !password) {
			return res.status(400).json({
				error: "missing credentials",
			});
		}
		// hash the password
		if (password) {
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);
		}
		// create user record inside database using User model
		const user = await User.create({ ...req.body, password });
		// return a response cotnains user info and the token
		return res.status(201).json({
			username,
			email,
			token: generateToken(user._id),
		});
	} catch (error) {
		// server error
		res.status(500).json({
			error: "server error, we are working on it!",
			message: error.message,
		});
	}
};

exports.login = async (req, res, next) => {
	try {
		let { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				error: "missing credentials",
			});
		}
		const user = await User.findOne({
			email: email,
		});
		if (!user) {
			return res.status(400).json({
				error: "Wrong Credentials",
			});
		}
		const passFromDB = user.password;
		const passwordsMatch = await bcrypt.compare(password, passFromDB);
		if (!passwordsMatch) {
			return res.status(400).json({
				error: "wrong credentials",
			});
		}
		return res.status(200).json({
			email,
			token: generateToken(user._id),
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}
};

//TODO method to generate token for registeration and sign-in
const generateToken = (id) => {
	// the payload of the token is the id
	// So, the token will hold the id encrypted into it
	const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
	// return the created token
	return jwtToken;
};
