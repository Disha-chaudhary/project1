require("dotenv").config();
const express = require("express");


const app = require("./src/app");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDB = require("./src/config/database");

connectDB();




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});