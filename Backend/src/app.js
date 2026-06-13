const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({ origin: true, credentials: true })); // ← FIRST
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

app.get("/check", (req, res) => res.send("App working"));

const interviewRouter = require("./routes/interview.routes");
const authRouter = require("./routes/auth.routes");

app.use("/api/interview", interviewRouter);
app.use("/api/auth", authRouter);

module.exports = app;