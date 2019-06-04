'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

/**
 * función de activación de la cuenta.
 */

async function activate(req, res, next) {
  const { verification_code: verificationCode } = req.query;

  if (!verificationCode) {
    return res.status(400).json({
      message: 'invalid verification code',
      target: 'verification_code'
    });
  }

  const now = new Date();
  const sqlActivateQuery = `UPDATE users_activation
SET activated_at = '${now
    .toISOString()
    .substring(0, 19)
    .replace('T', ' ')}'
WHERE verification_code='${verificationCode}'
AND activated_at IS NULL`;

  try {
    const connection = await mysqlPool.getConnection();
    const result = await connection.query(sqlActivateQuery);

    if (result[0].affectedRows === 1) {
      const sqlActivateUserQuery = `UPDATE users
      JOIN users_activation
      ON users.uuid = users_activation.uuid
      AND users.activated_at IS NULL
      AND users_activation.verification_code = '${verificationCode}'
      SET users.activated_at = users_activation.activated_at`;

      const resultActivateUser = await connection.query(sqlActivateUserQuery);
      if (resultActivateUser[0].affectedRows === 1) {
        connection.release();
        return res.redirect(`${process.env.HTTP_FRONT_DOMAIN}/activation`);
      }
    }

    connection.release();
    return res.send('verification code invalid');
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = activate;
