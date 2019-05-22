"use strict";

const express = require("express");
const checkJwt = require("../controllers/session/check-jwt-token");
const selectEvent = require("../controllers/event/select-event");
// const selectEventRol = require("../../webserver/controllers/event/select-event&rol");
const router = express.Router();

router.get("/event", checkJwt, selectEvent);
// router.post("/event/selectevent", selectEventRol);

module.exports = router;
