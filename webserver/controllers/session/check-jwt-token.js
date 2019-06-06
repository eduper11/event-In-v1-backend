'use strict';

const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-error');

const { AUTH_JWT_PASS: authJwtSecret } = process.env;

function checkJwtToken(req, res, next) {
  // checkeará el token jwt que viene en el header como authorization
  const { authorization } = req.headers;
  if (!authorization) {
    const notAuthorizedError = new NotAuthorizedError('Session expired', 401);
    return next(notAuthorizedError);
  }

  //   if (!authorization.startsWith('Bearer '))
  const [prefix, token] = authorization.split(' ');
  if (prefix !== 'Bearer') {
    return res.status(401).send();
  }

  if (!token) {
    return res.status(401).send();
  }
  try {
    const decoded = jwt.verify(token, authJwtSecret);

    req.claims = {
      uuid: decoded.uuid,
      role: decoded.role,
      email: decoded.email
    };

    return next();
  } catch (e) {
    return res.status(401).send('4');
  }
}

module.exports = checkJwtToken;
