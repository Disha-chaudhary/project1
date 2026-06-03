const mongoose = require("mongoose");








const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    tip: {
      type: String,
      required: [true, "Tip is required"],
    },
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
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
    },

    technicalQuestions: [technicalQuestionsSchema],

    behavioralQuestions: [behavioralQuestionsSchema],

    skillGaps: [skillGapsSchema],

    preparationPlan: [preparationPlanSchema],
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("InterviewReport", interviewReportSchema);