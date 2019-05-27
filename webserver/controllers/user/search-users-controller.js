"use strict";

const Joi = require("joi");
const mysqlPool = require("../../../databases/mysql-pool");

/**
 * Validate if search data is valid
 * @param {Object} payload Object to be validated. { q: String to search }
 * @return {Object} null if data is valid, throw an Error if data is not valid
 */
async function validate(payload) {
  const schema = {
    q: Joi.string()
      .min(3)
      .max(128)
      .required()
  };

  return Joi.validate(payload, schema);
}

async function searchUsers(req, res, next) {
  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e);
  }

  const sqlQuery = `SELECT * FROM user_profile WHERE full_name LIKE '${q}%' ORDER BY full_name;`;
  const connection = await mysqlPool.getConnection();

  try {
    const [userProfileSearch] = await connection.query(sqlQuery);
    connection.release();

    return res.send(userProfileSearch);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = searchUsers;
