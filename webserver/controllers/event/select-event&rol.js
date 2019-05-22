"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function selectEventRol(req, res, next) {
  const eventData = req.body;
  const { uuid } = req.claims;

  const connection = await mysqlPool.getConnection();
  const sqlInsert = `UPDATE users SET ? WHERE uuid = '${uuid}'`;

  try {
    const result = await connection.query(sqlInsert, {
      event_joined: eventData.event_id,
      rol: eventData.rol
    });
    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = selectEventRol;
