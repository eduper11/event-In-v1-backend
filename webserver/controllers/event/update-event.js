"use strict";

const Joi = require("joi");
const mysqlPool = require("../../../databases/mysql-pool");

async function validate(payload) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(128)
      .required(),
    company: Joi.string()
      .max(128)
      .allow(null),
    finish_at: Joi.date().allow(null)
  };

  return Joi.validate(payload, schema);
}

async function updateEvent(req, res) {
  const { eventId } = req.query;
  const eventData = req.body;

  try {
    await validate(eventData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const sqlQuery = `UPDATE events SET ? WHERE event_id = '${eventId}';`;
  // const now = new Date();

  const connection = await mysqlPool.getConnection();

  try {
    const result = await connection.query(sqlQuery, {
      name: eventData.name,
      company: eventData.company,
      finish_at: eventData.finish_at
    });

    connection.release();

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = updateEvent;
