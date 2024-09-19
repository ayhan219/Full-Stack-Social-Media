const express = require("express");
const router = express.Router();
const {login,signup,getCurrentUser, logoutUser,profile,getProfileInformation,getSearchedUser,getUserProfile,followUser,unfollowUser,updateProfile,forgotPassword,forgotPasswordToken,getFollowers} = require("../controller/UserController")
const authMiddleware = require("../controller/AuthMiddleware")
const profilMiddleware = require("../controller/profilMiddleware")


router.post("/login",login);
router.post("/signup",signup)
router.get("/current",authMiddleware,getCurrentUser)
router.post("/logout",logoutUser)
router.put("/profile",profilMiddleware.single("profilePicture"),profile)
router.get("/profile",getProfileInformation)
router.get("/getsearcheduser",getSearchedUser)
router.get("/getuserprofile",getUserProfile)
router.put("/follow/:followedUserId",followUser)
router.put("/unfollow/:unfollowedUserId",unfollowUser)
router.put("/updateprofile",updateProfile)
router.post("/forgotpassword",forgotPassword)
router.post("/resetpassword/:token" ,forgotPasswordToken)
router.get("/getfollowers",getFollowers)


module.exports = router