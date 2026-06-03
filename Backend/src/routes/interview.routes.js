// const express = require("express");
// const authMiddleware = require("../middlewares/auth.middleware");
// const interviewController = require("../controllers/interview.controller");
// const upload = require("../middlewares/file.middleware");

// const interviewRouter = express.Router();
// interviewRouter.get("/test", (req, res) => {
//   res.send("Interview route working");
// });

// interviewRouter.post(
//   "/",
//   authMiddleware.authUser,
//   upload.single("resume"),
//   interviewController.createInterviewReport
// );
// module.exports = interviewRouter;.
const express = require("express");
const upload = require("../middlewares/file.middleware");
const interviewController = require("../controllers/interview.controller");

const interviewRouter = express.Router();

console.log("✅ interview.routes.js loaded");

interviewRouter.get("/test", (req, res) => {
  res.send("Interview route working");
});

interviewRouter.post(
  "/",
  upload.single("resume"),
  interviewController.createInterviewReport
);

module.exports = interviewRouter;