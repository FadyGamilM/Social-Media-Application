const router = require("express").Router();
const { protect } = require("../middlewares/authority");

/* --------------------------- import controllers --------------------------- */
const {
	VisitUserProfile,
	VisitProfile,
	UpdateProfile,
	DeleteProfile,
	Follow,
	Unfollow,
} = require("../controllers/users");
/* -------------------------------------------------------------------------- */

// @Description: private route for user to visit his/her own profile
router.route("/profile").get(protect, VisitProfile);

// @Description: private route for user to update, delete his/her own profile
// @Description: public route for user to visit anyone profile (must be authenticated)
router
	.route("/:id")
	.put(protect, UpdateProfile)
	.delete(protect, DeleteProfile)
	.get(VisitUserProfile);

// @Description: private route for user to follow another user
router.route("/:id/follow").put(protect, Follow);

// @Description: private route for user to unfollow another user
router.route("/:id/unfollow").put(protect, Unfollow);

module.exports = router;
