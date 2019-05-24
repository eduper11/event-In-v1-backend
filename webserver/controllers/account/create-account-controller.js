"use strict";

const bcrypt = require("bcrypt");
const Joi = require("joi");
const uuidV4 = require("uuid/v4");
const sendgridMail = require("@sendgrid/mail");
const mysqlPool = require("../../../databases/mysql-pool");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function validateSchema(payload) {
  /**
   * TODO: Fill email, password and full name rules to be (all fields are mandatory):
   *  email: Valid email
   *  password: Letters (upper and lower case) and number
   *    Minimun 3 and max 30 characters, using next regular expression: /^[a-zA-Z0-9]{3,30}$/
   * fullName: String with 3 minimun characters and max 128
   */
  const schema = {
    full_name: Joi.string()
      .min(3)
      .max(60)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  };

  return Joi.validate(payload, schema);
}
/**
 *
 * @param {String} uuid
 * @param {String} full_name
 * añade en tabla user_profile uuid y full_name en el mismo momento de crear cuenta
 */

async function addUserProfile(uuid, full_name) {
  const fullName = full_name;
  const verificationCode = uuid;

  const sqlQuery = `INSERT INTO user_profile SET ?`;

  const connection = await mysqlPool.getConnection();

  await connection.query(sqlQuery, {
    uuid: verificationCode,
    full_name: fullName
  });

  connection.release();

  return fullName;
}

/**
 * Crea un codigo de verificacion para el usuario dado e inserta este codigo
 * en la base de datos
 * @param {String} uuid
 * @return {String} verificationCode
 */
async function addVerificationCode(uuid) {
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const sqlQuery = "INSERT INTO users_activation SET ?";
  const connection = await mysqlPool.getConnection();

  await connection.query(sqlQuery, {
    uuid: uuid,
    verification_code: verificationCode,
    created_at: createdAt
  });

  connection.release();

  return verificationCode;
}

/**
 *
 * @param {String} userEmail
 * @param {String} verificationCode
 * envía email automático para verificación de email (Sendgrid)
 */

async function sendEmailRegistration(userEmail, verificationCode) {
  const linkActivacion = `http://localhost:3000/api/account/activate?verification_code=${verificationCode}`;
  const msg = {
    to: userEmail,
    from: {
      email: "event_in@yopmail.com",
      name: "Event-In"
    },
    subject: "Activation code for your account",
    text: "Meet all people in your event",
    html: `To confirm the account press <a href="${linkActivacion}">here</a>`
  };

  const data = await sendgridMail.send(msg);

  return data;
}

async function createAccount(req, res, next) {
  const accountData = req.body;
  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * Inserto el usuario en la bbdd, para ello:
   * 1. Generamos un uuid v4
   * 2. creamo fecha actual created_at
   * 3. hash de la password y almacenamiento seguro
   */
  const now = new Date();
  const securePassword = await bcrypt.hash(accountData.password, 10);
  const uuid = uuidV4();
  const createdAt = now
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  const connection = await mysqlPool.getConnection();

  const sqlInsercion = "INSERT INTO users SET ?";

  try {
    const resultado = await connection.query(sqlInsercion, {
      uuid: uuid,
      email: accountData.email,
      password: securePassword,
      created_at: createdAt
    });
    connection.release();

    const verificationCode = await addVerificationCode(uuid);

    await sendEmailRegistration(accountData.email, verificationCode);
    // await createWall(uuid);
    await addUserProfile(uuid, accountData.full_name);

    return res.status(201).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }

    return res.status(500).send(e.message);
  }
}

module.exports = createAccount;
