'use strict';

const Joi = require('joi');
const mysqlPool = require('../../../databases/mysql-pool');

async function validateData(payload) {
  const schema = {
    full_name: Joi.string()
      .min(3)
      .max(128)
      .required(),
    linkedIn: Joi.string()
      .uri({
        scheme: ['http', 'https']
      })
      .allow(null),
    github: Joi.string()
      .uri({
        scheme: ['http', 'https']
      })
      .allow(null),
    twitter: Joi.string()
      .uri({
        scheme: ['http', 'https']
      })
      .allow(null),
    instagram: Joi.string()
      .uri({
        scheme: ['http', 'https']
      })
      .allow(null),
    description: Joi.string().allow(null)
  };

  return Joi.validate(payload, schema);
}

async function updateProfile(req, res) {
  const profileData = req.body;

  try {
    await validateData(profileData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const { uuid } = req.claims;
  const sqlQuery = `UPDATE user_profile SET ? WHERE uuid = '${uuid}';`;

  // const now = new Date();

  const connection = await mysqlPool.getConnection();

  try {
    const result = await connection.query(sqlQuery, {
      full_name: profileData.full_name,
      linkedin: profileData.linkedin,
      github: profileData.github,
      twitter: profileData.twitter,
      instagram: profileData.instagram,
      description: profileData.description
    });

    connection.release();

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = updateProfile;
