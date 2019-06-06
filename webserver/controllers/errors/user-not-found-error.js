'use strict';

class UserNotFoundError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.name = 'UserNotFoundError';
    this.status = status;
  }
}

module.exports = UserNotFoundError;
