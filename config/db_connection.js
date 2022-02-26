const mongoose = require("mongoose");
require("dotenv").config();

exports.connectToDatabase = () => {
	mongoose.connect(process.env.MONGO_URL, {}, () => {
		console.log(`Server is connected to DB`.green.inverse);
	});
};
