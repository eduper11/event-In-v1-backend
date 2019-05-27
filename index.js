"use strict";

require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const routes = require("./webserver/routes");
const mysqlPool = require("./databases/mysql-pool");

process.on("uncaughtException", err => {
  console.error("excepción inesperada", err.message, err);
});

process.on("unhandledRejection", err => {
  console.error("Error inesperado", err.message, err);
});

const app = express();
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send({
    error: `Body parser: ${err.message}`
  });
});

app.use("/api", routes.accountRouter);
app.use("/api", routes.eventRouter);
app.use("/api", routes.userRouter);

app.use((err, req, res, next) => {
  const { name: errorName } = err;

  if (errorName === "AccountNotActivatedError") {
    return res.status(403).send({
      message: err.message
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

init();
