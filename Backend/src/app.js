const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/check", (req, res) => res.send("App working"));

const interviewRouter = require("./routes/interview.routes");
const authRouter = require("./routes/auth.routes");

app.use("/api/interview", interviewRouter);
app.use("/api/auth", authRouter);

module.exports = app;