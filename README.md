🤖 Mockly — AI-Powered Mock Interview Platform


Prepare smarter. Interview better.



Mockly is an AI-powered mock interview platform that helps job seekers prepare for technical and behavioral interviews. It analyzes your resume and job description, generates tailored interview questions, evaluates your answers, and provides detailed feedback — all powered by Google Gemini AI.


🌐 Live Demo


Frontend: https://mockly-frontend.onrender.com
Backend: https://mockly-backend-kn7n.onrender.com



✨ Features


🔐 User Authentication — Secure register/login with JWT and HTTP-only cookies
📄 Resume Analysis — Upload your resume (PDF/DOC/DOCX) and paste a job description
🤖 AI Interview Report — Gemini AI generates tailored technical and behavioral questions
📊 Match Score — See how well your profile matches the job
🧠 Skill Gap Analysis — Identify areas you need to improve
📅 7-Day Preparation Plan — Personalized study plan based on your profile
⏱ 30-Minute Timer — Realistic interview simulation with countdown timer
⚡ AI Evaluation — Get detailed feedback on your answers after submission
📈 Mock Interview Results — See scores, feedback, and improvement suggestions



🛠 Tech Stack

Frontend

TechnologyPurposeReact 19UI FrameworkViteBuild ToolReact Router v7Client-side RoutingAxiosHTTP RequestsSCSSStylingThree.js3D Background AnimationGSAPAnimations

Backend

TechnologyPurposeNode.jsRuntimeExpress.jsWeb FrameworkMongoDB + MongooseDatabaseJWTAuthenticationbcryptPassword HashingMulterFile Uploadpdf-parsePDF Text ExtractionCORSCross-Origin Resource Sharing

AI & Cloud

TechnologyPurposeGoogle Gemini AIInterview Question Generation & EvaluationMongoDB AtlasCloud DatabaseRenderDeployment (Frontend + Backend)


📁 Project Structure

project1/
├── Frontend/
│   ├── public/
│   │   └── _redirects
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   └── protected.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   ├── pages/
│   │   │   │   │   ├── landing.jsx
│   │   │   │   │   ├── login.jsx
│   │   │   │   │   └── register.jsx
│   │   │   │   └── services/
│   │   │   │       ├── auth.api.js
│   │   │   │       └── interview.api.js
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       │   └── useinterview.js
│   │   │       └── pages/
│   │   │           ├── Home.jsx
│   │   │           ├── interviewDashboard.jsx
│   │   │           ├── MockInterview.jsx
│   │   │           └── MockResult.jsx
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.contoller.js
│   │   │   └── interview.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── blacklist.model.js
│   │   │   ├── interview.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md


🚀 Getting Started (Local Development)

Prerequisites


Node.js v18+
MongoDB Atlas account
Google AI Studio API key


1. Clone the repository

bashgit clone https://github.com/Disha-chaudhary/project1.git
cd project1

2. Setup Backend

bashcd Backend
npm install

Create a .env file in the Backend folder:

envMONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173

Start the backend:

bashnpm start

3. Setup Frontend

bashcd Frontend
npm install

Create a .env file in the Frontend folder:

envVITE_API_URL=http://localhost:3000

Start the frontend:

bashnpm run dev


🔌 API Endpoints

Auth Routes

MethodEndpointDescriptionPOST/api/auth/registerRegister a new userPOST/api/auth/loginLogin userGET/api/auth/logoutLogout userGET/api/auth/get-meGet current user

Interview Routes

MethodEndpointDescriptionPOST/api/interviewCreate interview reportGET/api/interviewGet all interview reportsGET/api/interview/:idGet interview report by IDPOST/api/interview/:id/evaluateEvaluate mock interview answers


🎯 How It Works


Register/Login — Create an account or login
Upload Resume — Upload your resume (PDF/DOC/DOCX)
Paste Job Description — Add the job description you're targeting
Add Self Description — Optional: describe yourself
Generate Report — AI analyzes everything and generates:

Match Score (0-100)
5 Technical Questions
5 Behavioral Questions
3 Skill Gaps
7-Day Preparation Plan



Start Mock Interview — Answer all 10 questions within 30 minutes
Get Results — AI evaluates your answers and provides:

Overall Score
Per-question feedback
Communication feedback
Improvement suggestions






🌍 Deployment

Backend (Render Web Service)

SettingValueRoot DirectoryBackendBuild Commandnpm installStart Commandnpm start

Frontend (Render Static Site)

SettingValueRoot DirectoryFrontendBuild Commandnpm install && npm run buildPublish Directorydist


🔒 Security


Passwords are hashed using bcrypt
Authentication via JWT tokens stored in HTTP-only cookies
Token blacklisting on logout
Environment variables for all secrets
.env files excluded from version control



👩‍💻 Author

Disha Chaudhary


GitHub: @Disha-chaudhary



📄 License

This project is open source and available under the MIT License.



Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI
