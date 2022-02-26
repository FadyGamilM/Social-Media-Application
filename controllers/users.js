const { User } = require("../models/User");
const bcrypt = require("bcrypt");

// @Description: logged-in user can view his/her own profile
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
};

// @Description: User can view other users profiles
exports.VisitUserProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(400).json({
				error: "User is not found",
			});
		}
		return res.status(200).json({
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: "error.message",
		});
	}
};

// @Description: User can update his/her own profile only
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

// @Description: User can delete his own profile only
exports.DeleteProfile = async (req, res, next) => {
	try {
		if (req.params.id !== req.user.id) {
			return res.status(500).json({
				error: "Not Authoraized",
			});
		}
		const deletedUser = await User.findByIdAndDelete(req.user.id, req.body);
		return res.status(200).json({
			data: deletedUser,
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}
};

// @Description: User can follow another user
exports.Follow = async (req, res, next) => {
	try {
		// if user try to follow him/her-self
		if (req.params.id === req.user.id) {
			return res.status(400).json({
				error: "You can't follow yourself",
			});
		}
		// we need to get the follower and the one who will be followed to relate them together
		let follower = await User.findById(req.user.id);
		let followed = await User.findById(req.params.id);
		if (follower.followings.includes(req.params.id)) {
			return res.status(400).json({
				error: "you already followed this user before",
			});
		}
		await follower.updateOne({
			$push: {
				followings: req.params.id,
			},
		});
		await followed.updateOne({
			$push: {
				followers: req.user.id,
			},
		});
		return res.status(200).json({
			data: "user is followed",
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}
};

// @Description: User can unfollow another user
exports.Unfollow = async (req, res, next) => {
	try {
		// we need to get the unfollower and the one who will be unfollowed to relate them together
		let unfollower = await User.findById(req.user.id);
		let unfollowed = await User.findById(req.params.id);
		if (unfollower.followings.includes(req.params.id)) {
			await unfollower.updateOne({
				$pull: {
					followings: req.params.id,
				},
			});
			await unfollowed.updateOne({
				$pull: {
					followers: req.user.id,
				},
			});
			return res.status(200).json({
				data: "user is unfollowed",
			});
		}
		return res.status(200).json({
			data: "you are not following this user, you can't unfollow him/her",
		});
	} catch (error) {
		return res.status(500).json({
			error: "server error, we are working on it",
			message: error.message,
		});
	}
};
