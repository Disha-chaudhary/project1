// const express = require('express');
// const cors = require('cors');

// const app = express();
// const cookieParser = require('cookie-parser');
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
// app.use(cookieParser());
// app.use(express.json());

// const authRouter = require('./routes/auth.routes');
// const interviewRouter = require('./routes/interview.routes');

// app.use('/api/interview', interviewRouter);
// app.use('/api/auth', authRouter);


// module.exports = app;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log("✅ app.js loaded");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

app.get("/check", (req, res) => {
  res.send("App working");
});

const interviewRouter = require("./routes/interview.routes");
const authRouter = require("./routes/auth.routes");

app.use("/api/interview", interviewRouter);
app.use("/api/auth", authRouter);

module.exports = app;