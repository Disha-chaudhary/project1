
const express = require("express");
const upload = require("../middlewares/file.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");

const interviewRouter = express.Router();

console.log(" interview.routes.js loaded");

interviewRouter.get("/test", (req, res) => {
  res.send("Interview route working");
});

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.createInterviewReport
);

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

interviewRouter.get(
  "/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

// ✅ New: Mock interview evaluation route
interviewRouter.post(
  "/:interviewId/evaluate",
  authMiddleware.authUser,
  interviewController.evaluateMockInterviewController
);

module.exports = interviewRouter;
