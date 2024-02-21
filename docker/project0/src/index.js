const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json("Hi, this is from the project 0");
});

app.listen(3000, () => {
  console.log("Backend is runing at port 3000");
});
