"use strict";

const Joi = require("joi");
const mysqlPool = require("../../../databases/mysql-pool");

const NotOwnerPrivilegesError = require("../errors/owner-privileges-error");

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

async function updateEvent(req, res, next) {
  const { uuid } = req.claims;
  const { eventId } = req.query;
  const eventData = req.body;

  // const sqlAuxiliar = `SELECT owner_uuid FROM events WHERE event_Id = '${eventId}';`;

  // try {
  //   const [dataOwner] = await connection.query(sqlAuxiliar);

  //   connection.release();

  //   if (uuid !== dataOwner) {
  //     const notOwnerPrivilegesError = new NotOwnerPrivilegesError();
  //     return next(notOwnerPrivilegesError);
  //   }
  // } catch (e) {
  //   return res.status(401).send(e);
  // }

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
        finish_at: eventData.finish_at
      });

      connection.release();

      return res.status(201).send();
    } else {
      const notOwnerPrivilegesError = new NotOwnerPrivilegesError(
        "You can not modify this event: you are not the owner"
      );

      return next(notOwnerPrivilegesError);
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
// const sqlUpdate = `UPDATE events SET ? WHERE events.id = '${eventId}';`;

//   try {
//     const result = await connection.query(sqlUpdate, {
//       name: eventData.name,
//       company: eventData.company,
//       finish_at: eventData.finish_at
//     });

//     connection.release();

//     return res.status(201).send();
//   } catch (e) {
//     return res.status(500).send(e.message);
//   }
// }

module.exports = updateEvent;
