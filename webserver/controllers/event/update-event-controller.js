'use strict';

const Joi = require('joi');
const mysqlPool = require('../../../databases/mysql-pool');

const NotOwnerPrivilegesError = require('../errors/owner-privileges-error');

async function validate(payload) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(128)
      .allow(null),
    company: Joi.string()
      .max(128)
      .allow(null),
    finish_at: Joi.date().allow(null),
    streaming_url: Joi.string().allow(null)
  };

  return Joi.validate(payload, schema);
}

async function updateEvent(req, res, next) {
  const { uuid } = req.claims;
  const eventId = req.query.event_id;
  const eventData = req.body;

  try {
    await validate(eventData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const sqlAuxiliar = `SELECT owner_uuid FROM events WHERE id = '${eventId}';`;

  try {
    const connection = await mysqlPool.getConnection();
    const [dataOwner] = await connection.query(sqlAuxiliar);
    const { owner_uuid } = dataOwner[0];

    connection.release();

    if (owner_uuid === uuid) {
      const sqlUpdate = `UPDATE events SET ? WHERE events.id = '${eventId}';`;

      const result = await connection.query(sqlUpdate, {
        name: eventData.name,
        company: eventData.company,
        finish_at: eventData.finish_at,
        streaming_url: eventData.streaming_url
      });

      connection.release();

      return res.status(201).send();
    } else {
      const notOwnerPrivilegesError = new NotOwnerPrivilegesError(
        'You can not modify this event: you are not the owner',
        401
      );

      return next(notOwnerPrivilegesError);
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = updateEvent;
