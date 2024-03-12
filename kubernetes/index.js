const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    `mongodb://${process.env.USER_NAME}:${process.env.USER_PWD}@${process.env.DB_URL}`
  )
  .then(() => console.log("db connected successfully !"))
  .catch((err) => console.log(err));

app.get("/api/", (req, res) => {
  res.status(200).json("it works !");
});

app.listen(8000, () => {
  console.log(`Backend is running on port 8000`);
});
