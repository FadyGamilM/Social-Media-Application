const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.protect = async (req, res, next) => {
	try {
		// define the token here to be global scope variable
		let token;
		// ckeck if the incoming request contains something in the headers.authorization
		if (req.headers.authorization) {
			// if there is, check that its a Barear token
			if (req.headers.authorization.startsWith("Bearer")) {
				try {
					// get the token from the header of the request
					token = req.headers.authorization.split(" ")[1];
					// verify the token
					const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
					console.log("Decoded token is " + decodedToken.id);
					// get the user id from the token
					// and we don't need the password to be returned
					// so we perform projection "-password" means execlude the password field
					req.user = await User.findById(decodedToken.id).select("-password");
					// so you added the user to the request as req.user, so you just need to call next()
					// and anyother handler will be protected by checking this req.user
					next();
				} catch (error) {
					// 401 means not authorized
					return res.status(401).json("Not Authoraized");
				}
			}
		} else if (!token) {
			return res.status(401).json("Not Authoraized, No Token Is Provided");
		}
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}
};
