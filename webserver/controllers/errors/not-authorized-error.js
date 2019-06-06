'use strict';

class NotAuthorizedError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.name = 'NotAuthorizedError';
    this.status = status;
  }
}

module.exports = NotAuthorizedError;
