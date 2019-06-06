'use strict';

require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const routes = require('./webserver/routes');
const mysqlPool = require('./databases/mysql-pool');

process.on('uncaughtException', err => {
  console.error('excepción inesperada', err.message, err);
});

process.on('unhandledRejection', err => {
  console.error('Error inesperado', err.message, err);
});

const app = express();
app.use(bodyParser.json());

/**
 * Enable CORS with a origin whitelist of valid domains
 */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send({
    error: `Body parser: ${err.message}`
  });
});

app.use(cors());

app.use('/api', routes.accountRouter);
app.use('/api', routes.eventRouter);
app.use('/api', routes.userRouter);

app.use((err, req, res, next) => {
  const { name } = err;

  // if (errorName === 'AccountNotActivatedError') {
  //   return res.status(403).send({
  //     message: err.message
  //   });
  // }

  if (name !== 'Error') {
    const { message, status } = err;

    return res.status(status).send({
      name,
      message,
      status
    });
  }

  return res.status(500).send({
    error: err.message
  });
});

async function init() {
  try {
    await mysqlPool.connect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

init();
