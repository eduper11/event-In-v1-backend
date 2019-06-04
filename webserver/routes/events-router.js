'use strict';

const express = require('express');
const checkJwt = require('../controllers/session/check-jwt-token');
const getEventList = require('../controllers/event/select-event-controller');
const createEvent = require('../controllers/event/create-event-controller');
const joinToEvent = require('../controllers/event/join-event-controller');
const updateEvent = require('../controllers/event/update-event-controller');
const getUserByEvent = require('../controllers/event/get-users-by-event-controller');
const getEventByUuid = require('../controllers/event/get-event-by-uuid-controller');
const router = express.Router();

router.get('/event', checkJwt, getEventList);
router.get('/myevents', checkJwt, getEventByUuid);
router.post('/event', checkJwt, createEvent);
router.post('/event/join', checkJwt, joinToEvent);
router.put('/event', checkJwt, updateEvent);
router.get('/event/users', checkJwt, getUserByEvent);

module.exports = router;
