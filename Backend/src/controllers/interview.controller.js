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

    const { selfDescription, jobDescription } = req.body;

    const pdfData = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const resumeText = pdfData.text;

    const aiResponse = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user._id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...aiResponse,
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

module.exports = { createInterviewReport };