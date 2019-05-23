"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function joinToEvent(req, res, next) {
  const eventData = req.body;
  const { uuid } = req.claims;
  const now = new Date();
  console.log(now);

  const connection = await mysqlPool.getConnection();
  const sqlInsert = `INSERT INTO user_events SET ?`;

  try {
    const result = await connection.query(sqlInsert, {
      uuid: uuid,
      event_id: eventData.event_id,
      rol: eventData.rol,
      last_update: now
        .toISOString()
        .substring(0, 19)
        .replace("T", " ")
    });
    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = joinToEvent;
