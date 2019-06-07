'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function getEventByUuid(req, res) {
  const connection = await mysqlPool.getConnection();
  const { uuid } = req.claims;
  const sqlQuery = `SELECT events.id, name, owner_uuid, events.company, events.created_at, finish_at FROM events
INNER JOIN user_events ON events.id = user_events.event_id 
WHERE uuid = '${uuid}' 
ORDER BY name`;

  try {
    const [eventList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(eventList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getEventByUuid;
