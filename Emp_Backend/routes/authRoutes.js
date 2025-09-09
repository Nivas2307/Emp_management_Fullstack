const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer
const { signup, login } = require("../controller/authController");

router.post("/signup", upload.single("photo"), signup); // multer file handler
router.post("/login", login);

module.exports = router;
