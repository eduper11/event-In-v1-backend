'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../databases/mysql-pool');

const AccountNotActivatedError = require('../errors/account-not-activated-error');
const UserNotFoundError = require('../errors/user-not-found-error');

async function validateData(payload) {
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  };

  return Joi.validate(payload, schema);
}

async function login(req, res, next) {
  /**
   * Validar datos de entrada con Joi
   */
  const accountData = { ...req.body };
  try {
    await validateData(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * Check si existe el usuario en la bbdd
   */
  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT
    id, uuid, email, password, activated_at
    FROM users
    WHERE email = '${accountData.email}'`;

    const [result] = await connection.query(sqlQuery);
    if (result.length === 1) {
      const userData = result[0];
      /*
      userData:
      {
  id: 66,
  uuid: 'fb66233b-23b4-46ad-bdf3-51e65dbb2f8e',
  email: 'eduper123@yopmail.com',
  password:
   '$2b$10$lW7xAAZSs2TnaX7Ua.7LGOa4bHpBQ53ig2TWRdS.EMB8XihVcckrO',
  activated_at: 2019-03-01T19:00:57.000Z  
}
  */
      if (!userData.activated_at) {
        const accountNotActivated = new AccountNotActivatedError(
          'you need to confirm the verification link',
          401
        );

        // throw accountNotActivated; // throw new AccountNotActivatedError()

        return next(accountNotActivated);
      }

      /**
       * Paso3: validar password
       */
      const correctPass = await bcrypt.compare(
        accountData.password,
        userData.password
      );
      if (correctPass === false) {
        // !correctPass
        return res.status(401).send();
      }

      /**
       * token JWT con uuid + rol
       * La duración del token es de 1h (en variable de entorno)
       */
      const payloadJwt = {
        uuid: userData.uuid,
        rol: userData.rol // userData.rol será speaker o listener
      };

      const jwtTokenExpiration = parseInt(
        process.env.AUTH_JWT_ACCESS_TOKEN_TTL,
        10
      );

      const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_PASS, {
        expiresIn: jwtTokenExpiration
      });
      const response = {
        accessToken: token,
        uuid: userData.uuid,
        expiresIn: jwtTokenExpiration
      };

      return res.status(200).json(response);
    }
    const userNotFoundError = new UserNotFoundError('User not found', 404);
    return next(userNotFoundError);
    // return res.status(404).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = login;
