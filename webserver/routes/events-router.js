"use strict";

const express = require("express");
const selectEvent = require("../controllers/event/select-event");
// const selectEventRol = require("../../webserver/controllers/event/select-event&rol");
const router = express.Router();

router.get("/event", selectEvent);
// router.post("/event/selectevent", selectEventRol);

module.exports = router;
