const express = require("express");
const bodyparser = require("body-parser");
const accountRouter = require("./routes/account-router");

const app = express();
app.use(bodyparser.json());

app.use("/account", accountRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});
