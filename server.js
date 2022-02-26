/* --------------------------- Essential Libraries -------------------------- */
const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const colors = require("colors");
/* -------------------------------------------------------------------------- */

/* --------------------------- Connect to database -------------------------- */
const { connectToDatabase } = require("./config/db_connection");
connectToDatabase();
/* -------------------------------------------------------------------------- */

/* ------------ import all different routes to server them later ------------ */
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
/* -------------------------------------------------------------------------- */

// initiate the application
const app = express();

/* ----------------------------- use middlewares ---------------------------- */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
/* -------------------------------------------------------------------------- */

/* -------------------------- serve multiple routes ------------------------- */
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
/* -------------------------------------------------------------------------- */

/* --------------------- listening for incoming requests -------------------- */
const port = process.env.PORT || 5000;
app.listen(port, () =>
	console.log(`server is running up on port ${port}!`.magenta.inverse)
);
/* -------------------------------------------------------------------------- */
