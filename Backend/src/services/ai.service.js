const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello Gemini! Explain what is an interview?",
  });

  console.log(response.text);
}

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100).describe("Resume match score"),

  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("Technical interview question"),
      answer: z.string().describe("Answer to the technical question"),
      intention: z.string().describe("Intention behind the technical question"),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("Behavioral interview question"),
      answer: z.string().describe("Answer to the behavioral question"),
      intention: z.string().describe("Intention behind the behavioral question"),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("Skill gap"),
      description: z.string().describe("Description of the skill gap"),
      severity: z.enum(["Low", "Medium", "High"]).describe("Severity of the skill gap"),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("Day of the preparation plan"),
      focus: z.string().describe("Focus area for the preparation plan"),
      resources: z.string().describe("Resources for the preparation plan"),
      task: z.string().describe("Task for the preparation plan"),
    })
  ),
});

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

Generate:
1. Technical interview questions with answers and intentions.
2. Behavioral interview questions with answers and intentions.
3. Skill gaps.
4. Preparation plan.
5. Match score from 0 to 100.

Return only valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  invokeGeminiAi,
  generateInterviewReport,
};