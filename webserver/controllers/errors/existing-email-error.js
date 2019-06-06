'use strict';

class EmailAlreadyExist extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.name = 'EmailAlreadyExist';
    this.status = status;
  }
}

module.exports = EmailAlreadyExist;
