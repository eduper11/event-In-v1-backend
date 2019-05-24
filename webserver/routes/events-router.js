"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const getEventList = require("../controllers/event/select-event");
const createEvent = require("../controllers/event/create-event");
const joinToEvent = require("../controllers/event/join-event");
const updateEvent = require("../controllers/event/update-event");
const getUserByEvent = require("../controllers/event/get-users-by-event");
const router = express.Router();

router.get("/event/selectevent", checkJwt, getEventList);
router.post("/event/create-event", checkJwt, createEvent);
router.post("/event/jointoevent", checkJwt, joinToEvent);
router.put("/event/update-event", checkJwt, updateEvent);
router.get("/event/getusersbyevent", checkJwt, getUserByEvent);

module.exports = router;
