const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./model/employee.model");

const app = express();

mongoose
  .connect(
    "mongodb://admin:password@localhost:27017/company?authSource=admin&authMechanism=DEFAULT"
  )
  .then(() => {
    console.log("connection successfull !");
  })
  .catch((err) => console.log(err));

app.use(express.json());

// create
app.post("/api/", async (req, res) => {
  try {
    const { id, name, role } = req.body;
    const newEmployee = new Employee({ id, name, role });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
app.get("/api/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(201).json(employees);
  } catch (err) {
    res.status(500).json(err);
  }
});
// update
// app.update("/api/:id", async (req, res) => {
//   try {
//     const changeData = req.body;
//     const employeeId = req.params.id;
//     const employees = await Employee.findOne({id:employeeId});

//     res.status(200).json(employees);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// app.get("/api/", async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.status(200).json(employees);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

app.listen(4000, () => {
  console.log("Backend is runing at port 3000");
});
