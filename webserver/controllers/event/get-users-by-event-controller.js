"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function getUsersByEvent(req, res, next) {
  const connection = await mysqlPool.getConnection();
  // const { uuid } = req.claims;
  const { eventId } = req.query;
  const sqlQuery = `SELECT user_profile.uuid, full_name, avatarUrl, linkedin, github, twitter, instagram, description FROM user_profile
INNER JOIN user_events ON user_events.uuid = user_profile.uuid 
WHERE event_id = '${eventId}';`;

  try {
    const [usersList] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(usersList);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getUsersByEvent;
