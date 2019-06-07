'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function getEventByIdList(req, res) {
  const connection = await mysqlPool.getConnection();
  const { event_id: id } = req.query;
  const sqlQuery = `SELECT id, name, owner_uuid, company, created_at, finish_at FROM events
WHERE id = '${id}' 
ORDER BY name`;

  try {
    const [eventList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(eventList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getEventByIdList;
