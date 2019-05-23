"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const getEventList = require("../controllers/event/get-user-events");
const createEvent = require("../controllers/event/create-event");
// const getEventListRol = require("../../webserver/controllers/event/select-event&rol");
const router = express.Router();

router.get("/event/selectevent", checkJwt, getEventList);
router.post("/event/create-event", checkJwt, createEvent);
// router.post("/event/getEventList", getEventListRol);

module.exports = router;
