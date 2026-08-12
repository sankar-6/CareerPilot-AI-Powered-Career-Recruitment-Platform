# 🚀 AI CareerPilot — AI-Powered Career Management Platform

AI CareerPilot is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application built for students, job seekers, and recruiters. It combines resume text analysis, a smart job portal with transparent skill matching, application tracking, a recruiter candidate management portal, and an AI mock interview simulator featuring speech-to-text voice input and question countdown timers.

---

## 🌟 Comprehensive Feature Set

### 🔐 1. Authentication & Security
- **Dual-Role Authorization**: Separate, protected workflows for `JOB_SEEKER` and `RECRUITER` roles.
- **Forgot & Reset Password**: Time-bound password reset flow via cryptographic SHA-256 tokens (`POST /api/auth/forgotpassword`, `PUT /api/auth/resetpassword/:token`).
- **State-of-the-Art Security**: Bcrypt password hashing (12-round salt), JWT authorization middleware, and permissive CORS configuration.

### 👤 2. Candidate Profile Builder
- Interactive profile editor for Contact Info, Location, Career Objective, Technical Skills (tag-based input), Education history, Personal Projects, Certifications, GitHub, and LinkedIn links.

### 📄 3. PDF Resume Upload & Real PDF Text Parsing (`pdf-parse`)
- **PDF File Storage**: Secure resume upload using `multer` with file-type and 5MB size validation.
- **Real PDF Text Parsing**: Uses `pdf-parse` to extract raw text content directly from uploaded `.pdf` file buffers.
- **Google Gemini AI Analyzer**: Generates a Resume Score (out of 100), Key Strengths, Areas to Improve, Detected Skills, and Recommended Skills.
- **Profile Skill Auto-Sync**: Automatically merges newly detected skills from uploaded resumes into the candidate's MongoDB profile.

### 🎯 4. Smart Job Portal & Skill Match Engine
- **Multi-Field Search**: Search job listings by Job Title, Company, Skills, or Location.
- **Filters & Pagination**: Filter jobs by Job Type (*Full-time, Part-time, Internship, Contract*) and Experience level.
- **Skill Match Score**: Calculates exact candidate-to-job skill alignment: `(Matched Skills / Required Skills) * 100`.
- **Match Breakdown Modal**: Visual skill comparison modal showing exact matches (`✓ Java ✓ SQL ✗ Docker`).
- **1-Click Application**: Prevents duplicate applications using compound MongoDB indexes `(jobId, applicantId)`.

### 📋 5. Application Tracker
- Monitor submitted applications with status badges: `Applied`, `Under Review`, `Shortlisted`, `Selected`, and `Rejected`.

### 🤖 6. AI Interview Practice Simulator
- **Custom Mock Setup**: Select target **Role** (*e.g., Full Stack Engineer*), **Topic** (*e.g., React & Node.js*), and **Difficulty** (*Easy, Medium, Hard*).
- **Dynamic AI Questions**: Gemini AI generates 5 tailored technical interview questions.
- **🎤 Speech-to-Text Voice Input**: Dictate answers verbally using the browser's native `Web Speech API`.
- **⏱️ 90-Second Question Timer**: Built-in countdown timer per question to simulate real interview pressure.
- **Live AI Evaluation**: Evaluates answers with numerical scores (1-10) and constructive feedback, concluding with an overall performance scorecard.

### 🏢 7. Recruiter Portal & Candidate Drawer
- **Job Management**: Create, edit, and delete job listings.
- **Applicant Drawer**: Inspect candidate profiles and update application statuses in real-time.
- **Recruiter Analytics**: Metrics overview showing *Total Jobs, Active Postings, Total Applicants, and Shortlisted Candidates*.

### 🎨 8. UI/UX & Feedback System
- **Design System**: Glassmorphic dark UI powered by Tailwind CSS.
- **Toast Notifications**: Interactive floating toast feedback using `react-hot-toast`.
- **Seamless Navigation**: Top navigation bars with "Back to Home" links on auth pages.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v7, Tailwind CSS v4, Lucide React Icons, Axios, `react-hot-toast`.
- **Backend**: Node.js, Express.js, REST API architecture, `pdf-parse`, `multer`.
- **Database**: MongoDB Atlas with Mongoose Schemas & Indexes.
- **Authentication**: JWT (JSON Web Tokens), `bcryptjs`, `crypto`.
- **AI Integration**: Google Gemini API (`gemini-flash-latest`) with fail-safe fallback.

---

## 📁 Project Structure

```text
FullStackProject/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # AppLayout, Sidebar, ProtectedRoute, GuestRoute
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Landing, Login, Register, ForgotPassword, ResetPassword, Profile, Dashboard, ResumeBuilder, Jobs, Applications, InterviewPractice, RecruiterDashboard
│   │   ├── services/       # API Axios client
│   │   └── App.jsx         # App Router & Toaster Configuration
├── server/                 # Express Backend API
│   ├── config/             # Environment & Database connection
│   ├── controllers/        # auth, profile, job, application, resume, interview, dashboard controllers
│   ├── middleware/         # Auth JWT verification, Multer upload, Error handler
│   ├── models/             # User, Profile, Job, Application, Resume, Interview Mongoose schemas
│   ├── routes/             # Express API endpoints
│   ├── services/           # AI Service (Gemini API & fail-safe fallback)
│   └── server.js           # Server Entry Point
├── .env.example            # Environment variables template
└── README.md               # Project Documentation
```

---

## 🚦 Quick Setup & Running Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (Local or MongoDB Atlas)

### 2. Environment Setup
Create a `.env` file in the root folder:

```env
PORT=5002
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-careerpilot
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Install & Start Application
Run from root:

```bash
# Install dependencies
npm run install-all

# Launch both server and client concurrently
npm run dev
```

- **Frontend**: `http://localhost:5174` (or `http://localhost:5173`)
- **Backend API**: `http://localhost:5002/api`

---

## 🌐 Live Production Deployment Guide

### 🛠️ 1. Deploy Express Backend to Render

1. Log into **[Render.com](https://render.com)** and create a new **Web Service**.
2. Connect your GitHub repository: `CareerPilot-AI-Powered-Career-Recruitment-Platform`.
3. Configure the following build & start settings:

| Setting | Value |
|---|---|
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

4. Under **Environment Variables**, add:
   - `PORT`: `5002`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `GEMINI_API_KEY`: `your_google_gemini_api_key`
   - `CLIENT_URL`: `https://your-vercel-frontend.vercel.app`

---

### ⚡ 2. Deploy React Frontend to Vercel

1. Log into **[Vercel.com](https://vercel.com)** and import your GitHub repository.
2. Configure project settings:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

3. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-render-backend.onrender.com/api`

---

## 🧪 Running Tests

To run the automated backend test suite:

```bash
cd server
npm test
```

---

## 📡 Main API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new Job Seeker or Recruiter |
| POST | `/api/auth/login` | Public | Authenticate user & return JWT token |
| POST | `/api/auth/forgotpassword` | Public | Request password reset token |
| PUT | `/api/auth/resetpassword/:token` | Public | Reset password using token |
| GET | `/api/profile/me` | Private | Get user profile details |
| PUT | `/api/profile/me` | Private | Update user profile details |
| GET | `/api/jobs` | Private | Search & filter jobs with skill match score |
| POST | `/api/jobs` | Recruiter | Post new job opening |
| POST | `/api/jobs/:id/apply` | Job Seeker | Apply for a job opening |
| GET | `/api/applications` | Job Seeker | Get user submitted applications |
| PUT | `/api/applications/:id/status` | Recruiter | Update application status |
| POST | `/api/resumes` | Job Seeker | Upload PDF resume |
| POST | `/api/resumes/analyze` | Job Seeker | Parse PDF text & run AI resume analysis |
| POST | `/api/interviews` | Job Seeker | Start AI mock interview session |
| POST | `/api/interviews/:id/answer` | Job Seeker | Submit answer (text/voice) & receive live AI score |
