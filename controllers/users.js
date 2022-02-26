const { User } = require("../models/User");
const bcrypt = require("bcrypt");

// @Description => logged-in user can view his/her own profile
exports.VisitProfile = async (req, res, next) => {
	try {
		// req.user contains the current logged-in user
		const user = await User.findById(req.user.id);
		// check if this user is existed in our DB
		if (!user) {
			return res.status(400).json({
				error: "user is not found",
			});
		}
		// return required user info
		return res.status(200).json({
			email: user.email,
			username: user.username,
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}

	// exports.VisitUserProfile = async (req, res, next) => {
	// 	try {
	// 		const user = await User.findById(req.params.id);
	// 		if (!user) {
	// 			return res.status(400).json({
	// 				error: "user is not found",
	// 			});
	// 		}
	// 		return res.status(200).json({
	// 			email: user.email,
	// 			username: user.username,
	// 		});
	// 	} catch (error) {
	// 		return res.status(500).json({
	// 			error: "server error, we are working on it",
	// 			message: error.message,
	// 		});
	// 	}
	// };

	// try {
	// 	if (req.body.userID === req.params.id || req.user.isAdmin) {
	// 		// if user is trying to update his profile
	// 		if (req.body.password) {
	// 			try {
	// 				const salt = await bcrypt.genSalt(10);
	// 				req.body.password = await bcrypt.hash(req.body.password, salt);
	// 			} catch (error) {
	// 				return res.status(500).json({
	// 					error: "server error, we are working on it",
	// 					message: "error while updating a password" + error.message,
	// 				});
	// 			}
	// 		}
	// 		// update all other fields
	// 		const user = await User.findByIdAndUpdate(req.params.id, {
	// 			$set: req.body,
	// 		});
	// 		return res.status(200).json({
	// 			data: "updated successfully",
	// 		});
	// 	} else {
	// 		return res.status(403).json({
	// 			error: "Not Authoraized",
	// 		});
	// 	}
	// } catch (error) {
	// 	return res.status(500).json({
	// 		error: "server error, we are working on it",
	// 		message: error.message,
	// 	});
	// }
};

// @Description => User can update his/her own profile only
exports.UpdateProfile = async (req, res, next) => {
	try {
		if (req.params.id !== req.user.id) {
			return res.status(500).json({
				error: "Not Authoraized",
			});
		}
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (error) {
				return res.status(500).json({
					message: error.message,
				});
			}
		}
		const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
			new: true,
		});
		return res.status(200).json({
			data: updatedUser,
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}
};

// exports.DeleteProfile = async (req, res, next) => {
// 	try {
// 	} catch (error) {
// 		return res.status(500).json({
// 			error: "server error, we are working on it",
// 			message: error.message,
// 		});
// 	}
// };
