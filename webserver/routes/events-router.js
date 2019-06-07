'use strict';

const express = require('express');
const checkJwt = require('../controllers/session/check-jwt-token');
const getEventNotJoined = require('../controllers/event/get-event-not-joined-controller');
const createEvent = require('../controllers/event/create-event-controller');
const joinToEvent = require('../controllers/event/join-event-controller');
const updateEvent = require('../controllers/event/update-event-controller');
const getUserByEvent = require('../controllers/event/get-users-by-event-controller');
const getEventJoined = require('../controllers/event/get-event-joined-controller');
const getEventById = require('../controllers/event/get-event-by-id-controller');
const router = express.Router();

router.get('/event', checkJwt, getEventNotJoined);
router.get('/myevents', checkJwt, getEventJoined);
router.get('/event/users', checkJwt, getUserByEvent);
router.get('/eventbyid', checkJwt, getEventById);
router.post('/event', checkJwt, createEvent);
router.post('/event/join', checkJwt, joinToEvent);
router.put('/event', checkJwt, updateEvent);

module.exports = router;
