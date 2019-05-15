const express = require("express");
const Joi = require("joi");

const router = express.Router();

/**
 * 
 * @param {String} payload (userData)
 * @return {Boolean}
 */

function validateSchema(payload) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
  };
  return Joi.validate(payload, schema)
}

async function createAccount(req, res, next) {
  const accountData = req.body;

  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }
}

router.post("/account", createAccount);

module.exports = router;
