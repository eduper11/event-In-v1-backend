"use strict";

class NotOwnerPrivilegesError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.name = "NotOwnerPrivilegesError";
    NotOwnerPrivilegesError.prototype.status = 401;
  }
}

module.exports = NotOwnerPrivilegesError;
