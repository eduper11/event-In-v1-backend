'use strict';

class AccountNotActivatedError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.name = 'AccountNotActivatedError';
    this.status = status;
  }
}

module.exports = AccountNotActivatedError;
