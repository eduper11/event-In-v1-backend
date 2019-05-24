"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const getUserProfile = require("../controllers/user/get-user-profile-controller");

const router = express.Router();

router.get("/user/getuserprofile", checkJwt, getUserProfile);

module.exports = router;
