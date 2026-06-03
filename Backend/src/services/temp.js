const sampleInterviewReport = {
  jobDescription: `
We are looking for a MERN Stack Developer Intern.
Requirements:
- Strong knowledge of JavaScript
- React.js
- Node.js & Express.js
- MongoDB
- REST APIs
- Git and GitHub
`,

  resume: `
Disha Chaudhary
B.Tech CSE Student

Skills:
- HTML
- CSS
- JavaScript
- React.js
- Node.js
- Express.js
- MongoDB
- Java

Projects:
- MediTrack
- Vidyarya
`,

  selfDescription:
    "I am a B.Tech CSE student passionate about full-stack development. I enjoy building web applications using the MERN stack and solving DSA problems.",

  matchScore: 82,

  technicalQuestions: [
    {
      question: "What is the Virtual DOM in React?",
      intention: "Check React fundamentals",
      answer:
        "Virtual DOM is a lightweight copy of the real DOM. React compares changes in the Virtual DOM and updates only the necessary parts of the actual DOM.",
    },
    {
      question: "What is middleware in Express.js?",
      intention: "Check backend knowledge",
      answer:
        "Middleware functions execute during the request-response cycle. They can modify requests, responses, perform authentication, logging, etc.",
    },
    {
      question: "Explain JWT Authentication.",
      intention: "Check authentication concepts",
      answer:
        "JWT is a token-based authentication mechanism where the server generates a signed token that is sent to the client and verified on protected routes.",
    },
  ],

  behavioralQuestions: [
    {
      question: "Tell me about yourself.",
      intention: "Assess communication skills",
      answer:
        "I am a Computer Science student interested in full-stack development and problem-solving. I have worked on several MERN projects and enjoy learning new technologies.",
    },
    {
      question: "Describe a challenge you faced in a project.",
      intention: "Assess problem-solving ability",
      answer:
        "While building a MERN application, I faced authentication issues. I debugged API requests, fixed JWT handling, and successfully implemented secure login functionality.",
    },
  ],

  skillGaps: [
    {
      skill: "TypeScript",
      description:
        "The resume does not show experience with TypeScript, which is commonly used in modern React projects.",
    },
    {
      skill: "Testing",
      description:
        "No evidence of Jest, React Testing Library, or backend testing frameworks.",
    },
    {
      skill: "System Design",
      description:
        "Limited exposure to scalable architecture and system design concepts.",
    },
  ],

  preparationPlan: [
    {
      tip: "Revise React hooks including useState, useEffect, useContext, and custom hooks.",
    },
    {
      tip: "Practice MongoDB aggregation and Mongoose relationships.",
    },
    {
      tip: "Build a complete MERN project with authentication and deployment.",
    },
    {
      tip: "Solve at least 2-3 DSA problems daily on LeetCode.",
    },
    {
      tip: "Prepare STAR-format answers for behavioral interviews.",
    },
  ],
};

module.exports = sampleInterviewReport;