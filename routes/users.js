const router = require("express").Router();
const { protect } = require("../middlewares/authority");

/* --------------------------- import controllers --------------------------- */
const {
	VisitUserProfile,
	VisitProfile,
	UpdateProfile,
	DeleteProfile,
} = require("../controllers/users");
/* -------------------------------------------------------------------------- */

// router.route("/:id").get(VisitUserProfile).put(protect, UpdateProfile).delete();
router.route("/profile").get(protect, VisitProfile);
router
	.route("/:id")
	.put(protect, UpdateProfile)
	.delete(protect, DeleteProfile)
	.get(VisitUserProfile);
module.exports = router;
