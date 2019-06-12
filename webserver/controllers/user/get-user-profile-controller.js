'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function getUserProfile(req, res) {
  const { uuid } = req.claims;

  const connection = await mysqlPool.getConnection();
  const sqlQuery = `SELECT uuid, full_name, avatarUrl, linkedin, github, twitter, instagram, description FROM user_profile
WHERE uuid = '${uuid}';`;

  try {
    const [userProfile] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(userProfile);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getUserProfile;
