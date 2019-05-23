"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function getEventList(req, res, next) {
  const connection = await mysqlPool.getConnection();
  const { uuid } = req.claims;
  const sqlQuery = `SELECT events.event_id, name, owner, events.company, events.created_at, finish_at FROM events`;

  try {
    const [eventList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(eventList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getEventList;
