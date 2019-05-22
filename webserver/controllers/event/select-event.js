"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function getEventList(req, res, next) {
  const connection = await mysqlPool.getConnection();
  const sqlQuery = `SELECT event_id, name, created_at, finish_at, finished FROM events inner join user_events on user_events.event_id = events.event_id inner join user on users.user_id = user_events.user_id where uuid = '${uuid}';`;

  try {
    const [eventList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(eventList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getEventList;
