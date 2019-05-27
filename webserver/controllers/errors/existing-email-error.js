"use strict";

class EmailAlreadyExist extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = "EmailAlreadyExist";
  }
}

module.exports = EmailAlreadyExist;
