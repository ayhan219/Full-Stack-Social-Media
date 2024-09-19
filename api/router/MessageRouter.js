const express = require("express");
const router = express.Router();

const {postMessage,getMessages} = require("../controller/MessageController");

router.post("/",postMessage)
router.get("/getmessages",getMessages)



module.exports = router;