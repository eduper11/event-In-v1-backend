"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const getEventList = require("../controllers/event/select-event-controller");
const createEvent = require("../controllers/event/create-event-controller");
const joinToEvent = require("../controllers/event/join-event-controller");
const updateEvent = require("../controllers/event/update-event-controller");
const getUserByEvent = require("../controllers/event/get-users-by-event-controller");
const router = express.Router();

router.get("/event/select", checkJwt, getEventList);
router.post("/event/create", checkJwt, createEvent);
router.post("/event/jointo", checkJwt, joinToEvent);
router.put("/event/update", checkJwt, updateEvent);
router.get("/event/users", checkJwt, getUserByEvent);

module.exports = router;
