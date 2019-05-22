"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function getEventList(req, res, next) {
  const connection = await mysqlPool.getConnection();

  try {
    const sqlQuery =
      "SELECT event_id, name, created_at, finish_at, finished FROM event_in.events where finished = false;";
    const [eventList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(eventList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getEventList;
