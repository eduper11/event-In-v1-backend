"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function createEvent(req, res) {
  const { uuid } = req.claims;
  const eventData = req.body;
  const sqlQuery = `INSERT INTO events SET ?`;
  const now = new Date();

  const connection = await mysqlPool.getConnection();

  try {
    const result = await connection.query(sqlQuery, {
      name: eventData.name,
      owner: uuid,
      company: eventData.company,
      created_at: now
        .toISOString()
        .substring(0, 19)
        .replace("T", " "),
      finish_at: eventData.finish_at
    });

    connection.release();

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = createEvent;
