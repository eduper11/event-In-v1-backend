'use strict';

const mysqlPool = require('../../../databases/mysql-pool');
const Joi = require('joi');

async function validateData(payload) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(128)
      .required(),
    company: Joi.string()
      .max(128)
      .required(),
    finish_at: Joi.date().required(),
    streaming_url: Joi.string()
      .uri({ allowRelative: true })
      .allow(null)
  };

  return Joi.validate(payload, schema);
}

async function createEvent(req, res) {
  const eventData = req.body;

  try {
    await validateData(eventData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const { uuid } = req.claims;
  const sqlQuery = `INSERT INTO events SET ?`;
  const now = new Date();

  const connection = await mysqlPool.getConnection();

  try {
    const result = await connection.query(sqlQuery, {
      name: eventData.name,
      owner_uuid: uuid,
      company: eventData.company,
      created_at: now
        .toISOString()
        .substring(0, 19)
        .replace('T', ' '),
      finish_at: eventData.finish_at,
      streaming_url: eventData.streaming_url
    });

    connection.release();

    return res.status(201).send(result[0]);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = createEvent;
