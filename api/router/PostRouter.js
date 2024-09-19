const express = require("express");
const router = express.Router();
const {createPost,getPosts,postComment,getComments,postStatus,getNotifications,deleteNotification,getSinglePost,getUserPosts,updatePost,deletePost} = require("../controller/PostController")
const upload = require("../controller/UploadMiddlware");


router.post("/",upload.single("image"),createPost);
router.get("/",getPosts)
router.put("/postcomment",postComment)
router.get("/getcomments",getComments)
router.put("/poststatus",postStatus)
router.get("/notifications",getNotifications)
router.delete("/deletenotification",deleteNotification)
router.get("/getsinglepost",getSinglePost)
router.get("/getuserposts",getUserPosts)
router.put("/updatepost",updatePost)
router.delete("/deletepost",deletePost)

module.exports = router;