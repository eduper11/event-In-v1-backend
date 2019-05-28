"use strict";

const express = require("express");
const multer = require("multer");
const checkJwt = require("../controllers/session/check-jwt-token");
const getUserProfile = require("../controllers/user/get-user-profile-controller");
const updateProfile = require("../controllers/user/update-user-profile-controller");
const uploadAvatar = require("../controllers/user/upload-avatar-controller");
const searchUser = require("../controllers/user/search-users-controller");

const upload = multer();
const router = express.Router();

router.get("/user/profile", checkJwt, getUserProfile);
router.put("/user/profile", checkJwt, updateProfile);
router.post("/user/avatar", checkJwt, upload.single("avatar"), uploadAvatar);
router.get("/user/search", checkJwt, searchUser);

module.exports = router;
