"use strict";

class NotOwnerPrivilegesError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.name = "NotOwnerPrivilegesError";
  }
}

module.exports = NotOwnerPrivilegesError;
