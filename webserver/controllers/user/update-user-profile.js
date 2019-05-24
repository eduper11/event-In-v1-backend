"use strict";

const Joi = require("joi");
const mysqlPool = require("../../../databases/mysql-pool");

async function validate(payload) {
  const schema = {
    full_name: Joi.string()
      .min(3)
      .max(128)
      .required(),
    linkedIn: Joi.string().allow(null),
    twitter: Joi.string().allow(null),
    github: Joi.string()
      .uri()
      .allow(null),
    description: Joi.string().allow(null)
  };

  return Joi.validate(payload, schema);
}

async function updateProfile(req, res) {
  const { uuid } = req.claims;
  const profileData = req.body;
  const sqlQuery = `UPDATE user_profile SET ? WHERE uuid = '${uuid}';`;
  const now = new Date();

  const connection = await mysqlPool.getConnection();

  try {
    const result = await connection.query(sqlQuery, {
      full_name: profileData.full_name,
      avatarUrl: profileData.avatarUrl,
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
