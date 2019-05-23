"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const getEventList = require("../controllers/event/select-event");
const createEvent = require("../controllers/event/create-event");
const joinToEvent = require("../controllers/event/join-event");
// const getEventListRol = require("../../webserver/controllers/event/select-event&rol");
const router = express.Router();

router.get("/event/selectevent", checkJwt, getEventList);
router.post("/event/create-event", checkJwt, createEvent);
router.post("/event/jointoevent", checkJwt, joinToEvent);
// router.post("/event/getEventList", getEventListRol);

module.exports = router;
