'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function getEventNotJoined(req, res) {
  const { uuid } = req.claims;

  const connection = await mysqlPool.getConnection();
  const sqlQuery = `SELECT id, name, owner_uuid, company, created_at, finish_at, streaming_url FROM events
  WHERE id NOT IN
  (SELECT id FROM events
  JOIN user_events ON id = event_id WHERE uuid = '${uuid}');`;

  try {
    const [eventList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(eventList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getEventNotJoined;
