"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const getEventList = require("../controllers/event/select-event-controller");
const createEvent = require("../controllers/event/create-event-controller");
const joinToEvent = require("../controllers/event/join-event-controller");
const updateEvent = require("../controllers/event/update-event-controller");
const getUserByEvent = require("../controllers/event/get-users-by-event-controller");
const router = express.Router();

router.get("/event/selectevent", checkJwt, getEventList);
router.post("/event/create-event", checkJwt, createEvent);
router.post("/event/jointoevent", checkJwt, joinToEvent);
router.put("/event/update-event", checkJwt, updateEvent);
router.get("/event/getusersbyevent", checkJwt, getUserByEvent);

module.exports = router;
