const router = require("express").Router();

/* --------------------------- import controllers --------------------------- */
const { getAllUsers } = require("../controllers/users");
/* -------------------------------------------------------------------------- */

router.route("/").get(getAllUsers);

module.exports = router;
