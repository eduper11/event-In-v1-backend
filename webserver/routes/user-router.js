"use strict";

const express = require("express");
const multer = require("multer");
const checkJwt = require("../controllers/session/check-jwt-token");
const getUserProfile = require("../controllers/user/get-user-profile-controller");

const updateProfile = require("../controllers/user/update-user-profile");
const uploadAvatar = require("../controllers/user/upload-avatar");

const upload = multer();
const router = express.Router();

router.get("/user/getuserprofile", checkJwt, getUserProfile);
router.put("/user/updateprofile", checkJwt, updateProfile);
router.post(
  "/user/uploadavatar",
  checkJwt,
  upload.single("avatar"),
  uploadAvatar
);

module.exports = router;
