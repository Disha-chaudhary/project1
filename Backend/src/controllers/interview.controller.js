const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

async function createInterviewReport(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID not found in token.",
      });
    }

    const { selfDescription, jobDescription } = req.body;

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const aiResponse = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user: userId,
      jobTitle: aiResponse.jobTitle || "Interview Report",
      resume: resumeText,
      selfDescription,
      jobDescription,
      matchScore: aiResponse.matchScore || 0,
      technicalQuestions: aiResponse.technicalQuestions || [],
      behavioralQuestions: aiResponse.behavioralQuestions || [],
      skillGaps: aiResponse.skillGaps || [],
      preparationPlan: aiResponse.preparationPlan || [],
    });

    res.status(201).json({
      message: "Interview report created successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Create Interview Report Error:", error);
    res.status(500).json({
      message: "Something went wrong while creating interview report",
      error: error.message,
    });
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await InterviewReportModel.findById(interviewId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    res.status(200).json({
      message: "Interview report found",
      interviewReport,
    });
  } catch (error) {
    console.error("Get Interview Report Error:", error);
    res.status(500).json({
      message: "Something went wrong while fetching interview report",
      error: error.message,
    });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await InterviewReportModel.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
      message: "Reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.error("Get All Interview Reports Error:", error);
    res.status(500).json({
      message: "Something went wrong while fetching interview reports",
      error: error.message,
    });
  }
}

module.exports = {
  createInterviewReport,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
