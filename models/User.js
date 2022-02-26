const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "username is required"],
			min: [3, "minimum length of username is 3"],
			max: [20, "maximum length of username is 20"],
		},
		email: {
			type: String,
			required: [true, "email is required"],
			max: [50, "maximum length of email is required"],
			unique: [true, "this email is taken by someone else"],
		},
		password: {
			type: String,
			min: [8, "min length of password is 8"],
			required: [true, "password is required"],
		},
		profilePicture: {
			type: String,
			default: "",
		},
		coverPicture: {
			type: String,
			default: "",
		},
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		bio: {
			type: String,
			max: 200,
		},
		city: {
			type: String,
			max: 50,
		},
		from: {
			type: String,
			max: 50,
		},
		relationship: {
			type: Number,
			enum: [1, 2, 3],
		},
	},
	{
		timestamps: true,
	}
);

const User = new mongoose.model("User", userSchema);
module.exports = User;
