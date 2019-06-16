'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function joinToEvent(req, res, next) {
  const { event_id, rol } = req.query;
  const { uuid } = req.claims;
  const now = new Date();

  const connection = await mysqlPool.getConnection();
  const sqlInsert = `INSERT INTO user_events SET ?`;

  try {
    const result = await connection.query(sqlInsert, {
      uuid: uuid,
      event_id: event_id,
      rol: rol,
      last_update: now
        .toISOString()
        .substring(0, 19)
        .replace('T', ' ')
    });

    connection.release(result);

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = joinToEvent;
