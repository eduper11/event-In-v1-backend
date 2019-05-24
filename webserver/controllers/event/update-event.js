"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function updateEvent(req, res) {
  const { uuid } = req.claims;
  const eventData = req.body;
  const sqlQuery = `UPDATE events SET ?`;
  const now = new Date();

  const connection = await mysqlPool.getConnection();

  try {
    const result = await connection.query(sqlQuery, {
      name: eventData.name,
      company: eventData.company,
      finish_at: eventData.finish_at
    });

    connection.release();

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = updateEvent;
