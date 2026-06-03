const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    focus: {
      type: String,
      required: true,
    },
    resources: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    selfDescription: {
      type: String,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    technicalQuestions: [questionSchema],

    behavioralQuestions: [questionSchema],

    skillGaps: [skillGapsSchema],

    preparationPlan: [preparationPlanSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewReport", interviewReportSchema);