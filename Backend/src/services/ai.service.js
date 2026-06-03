const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

function cleanJsonText(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function toQuestionObjects(arr = []) {
  if (!Array.isArray(arr)) return [];

  const result = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (typeof item === "object" && item !== null) {
      result.push({
        question: item.question || "Question not provided",
        answer: item.answer || "Answer not provided",
        intention: item.intention || "Intention not provided",
      });
    } else if (typeof item === "string") {
      result.push({
        question: item.replace(/^Question:\s*/i, ""),
        answer: "Answer not provided",
        intention: "Intention not provided",
      });
    }
  }

  return result;
}

function toSkillGapObjects(arr = []) {
  if (!Array.isArray(arr)) return [];

  return arr.map((item) => {
    if (typeof item === "object" && item !== null) {
      return {
        skill: item.skill || "Skill gap",
        description: item.description || "Description not provided",
        severity: ["Low", "Medium", "High"].includes(item.severity)
          ? item.severity
          : "Medium",
      };
    }

    return {
      skill: "Skill gap",
      description: String(item),
      severity: "Medium",
    };
  });
}

function toPreparationPlanObjects(arr = []) {
  if (!Array.isArray(arr)) return [];

  return arr.map((item, index) => {
    if (typeof item === "object" && item !== null) {
      return {
        day: item.day || index + 1,
        focus: item.focus || "Interview preparation",
        resources: item.resources || "Online documentation and practice",
        task: item.task || "Practice and revise",
      };
    }

    return {
      day: index + 1,
      focus: "Interview preparation",
      resources: "Online documentation and practice",
      task: String(item),
    };
  });
}

async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello Gemini! Explain what is an interview?",
  });

  console.log(response.text);
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Analyze the following candidate profile and job description.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON.

Use EXACTLY this structure and EXACTLY these camelCase keys:

{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "technical question here",
      "answer": "answer here",
      "intention": "why interviewer asks this"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "behavioral question here",
      "answer": "answer here",
      "intention": "why interviewer asks this"
    }
  ],
  "skillGaps": [
    {
      "skill": "skill name",
      "description": "description here",
      "severity": "Medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "focus area",
      "resources": "resources here",
      "task": "task here"
    }
  ]
}

Rules:
- Do not use snake_case keys.
- Do not return arrays of strings.
- technicalQuestions must be array of objects.
- behavioralQuestions must be array of objects.
- skillGaps must be array of objects.
- preparationPlan must be array of objects.
- severity must be only "Low", "Medium", or "High".
- Give 5 technical questions.
- Give 5 behavioral questions.
- Give 3 skill gaps.
- Give 7 days preparation plan.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  console.log("Gemini raw response:", response.text);

  const parsedResponse = JSON.parse(cleanJsonText(response.text));

  return {
    matchScore:
      parsedResponse.matchScore ||
      parsedResponse.match_score ||
      parsedResponse.score ||
      0,

    technicalQuestions: toQuestionObjects(
      parsedResponse.technicalQuestions ||
        parsedResponse.technical_interview_questions ||
        []
    ),

    behavioralQuestions: toQuestionObjects(
      parsedResponse.behavioralQuestions ||
        parsedResponse.behavioral_interview_questions ||
        []
    ),

    skillGaps: toSkillGapObjects(
      parsedResponse.skillGaps || parsedResponse.skill_gaps || []
    ),

    preparationPlan: toPreparationPlanObjects(
      parsedResponse.preparationPlan || parsedResponse.preparation_plan || []
    ),
  };
}

module.exports = {
  invokeGeminiAi,
  generateInterviewReport,
};