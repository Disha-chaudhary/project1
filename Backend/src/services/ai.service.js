const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

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
    return { skill: "Skill gap", description: String(item), severity: "Medium" };
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
    model: "gemini-2.5-flash-lite",
    contents: "Hello Gemini! Explain what is an interview?",
  });
  console.log(response.text);
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
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
  "jobTitle": "Frontend Developer",
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
- Determine the most appropriate job title from the job description and return it in "jobTitle".
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
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });
  const responseText = response.text;

  console.log("Gemini raw response:", responseText);
  const parsedResponse = JSON.parse(cleanJsonText(responseText));

  return {
    jobTitle: parsedResponse.jobTitle || "Job Title Not Found",
    matchScore: parsedResponse.matchScore || parsedResponse.match_score || parsedResponse.score || 0,
    technicalQuestions: toQuestionObjects(parsedResponse.technicalQuestions || parsedResponse.technical_interview_questions || []),
    behavioralQuestions: toQuestionObjects(parsedResponse.behavioralQuestions || parsedResponse.behavioral_interview_questions || []),
    skillGaps: toSkillGapObjects(parsedResponse.skillGaps || parsedResponse.skill_gaps || []),
    preparationPlan: toPreparationPlanObjects(parsedResponse.preparationPlan || parsedResponse.preparation_plan || []),
  };
}

async function evaluateMockInterview({ technicalQuestions, behavioralQuestions, jobDescription }) {
  const allQuestions = [
    ...technicalQuestions.map((q) => ({ ...q, type: "technical" })),
    ...behavioralQuestions.map((q) => ({ ...q, type: "behavioral" })),
  ];

  const prompt = `
You are an expert interviewer. Evaluate the following mock interview answers.

Job Description:
${jobDescription}

Questions and Candidate Answers:
${allQuestions.map((qa, i) => `
Question ${i + 1} [${qa.type}]: ${qa.question}
Candidate's Answer: ${qa.answer}
`).join("\n")}

Based on the candidate's actual answers, return ONLY valid JSON with EXACTLY this structure:

{
  "matchScore": 78,
  "overallFeedback": "Overall summary of candidate performance",
  "skillGaps": [
    {
      "skill": "skill name",
      "description": "why this is a gap based on their answers",
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
  ],
  "questionFeedbacks": [
    {
      "question": "the question text",
      "type": "technical or behavioral",
      "score": 80,
      "technicalFeedback": "feedback on accuracy",
      "communicationFeedback": "feedback on clarity",
      "improvement": "specific actionable suggestion"
    }
  ]
}

Rules:
- matchScore is 0-100 based on overall interview performance
- Score each answer 60% technical accuracy + 40% communication
- skillGaps must reflect weaknesses shown in their actual answers (3 gaps)
- preparationPlan must be a 7-day plan targeting their specific weak areas
- severity must be only "Low", "Medium", or "High"
- Return exactly ${allQuestions.length} items in questionFeedbacks
- Be honest but constructive
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });
  const responseText = response.text;
  const parsed = JSON.parse(cleanJsonText(responseText));

  return {
    matchScore: parsed.matchScore || 0,
    overallFeedback: parsed.overallFeedback || "",
    skillGaps: toSkillGapObjects(parsed.skillGaps || []),
    preparationPlan: toPreparationPlanObjects(parsed.preparationPlan || []),
    questionFeedbacks: parsed.questionFeedbacks || [],
  };
}

module.exports = {
  invokeGeminiAi,
  generateInterviewReport,
  evaluateMockInterview,
};
