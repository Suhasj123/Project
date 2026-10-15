# AI-Based Interview Preparation Portal (PrepAI) 🚀

> Full-Stack MERN Stack Application with AI Integration

PrepAI is a modern, responsive, full-stack web application designed to help students and candidates prepare for campus placements and job interviews. Built using **MongoDB**, **Express.js**, **React.js**, **Node.js**, **Tailwind CSS**, and **OpenAI / Gemini AI**.

---

## 🌟 Key Features & Module Overview

1. **Module 1: Authentication & User Profiles**
   - User Registration, JWT Login, Forgot Password handling.
   - Profile management with custom avatar selection and target role configuration.
   - Password hashing using `bcryptjs`.

2. **Module 2: Student Dashboard**
   - Personal Welcome Banner & Target Placement Role.
   - **Job Readiness Score Gauge** calculated from quiz accuracy, mock interviews & streak.
   - Daily Placement Challenge card with XP points.
   - Quick actions to launch Quizzes, AI Interviews, Resume Analyzer, and AI Mentor.

3. **Module 3: Resume & ATS Analyzer**
   - Upload PDF/DOCX or paste resume text.
   - AI extracts technical skills, detects missing skills for target role, calculates ATS Score, and provides tailored interview questions.

4. **Module 4: AI Mock Interview Portal**
   - Select round type (**Technical**, **HR**, **Behavioral**), domain (**Java**, **Python**, **MERN**, **SQL**, **C++**), and difficulty (**Easy**, **Medium**, **Hard**).
   - Real-time 1-on-1 interview simulation.
   - AI evaluation generating Overall Score, Communication Feedback, Technical Accuracy Grade, and Confidence Ratings.

5. **Module 5: Aptitude Quiz Engine**
   - Categories: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation.
   - Random question selection, countdown timer, skip, bookmarking, and instant evaluation.

6. **Module 6: Coding Assessment & Debugging**
   - Languages: C, C++, Java, Python, JavaScript.
   - MCQ, Output Prediction, Debugging snippets, and coding challenges.

7. **Module 7: Interactive Learning Center**
   - Post-quiz answer review.
   - Color-coded answer feedback: **Green** for correct choices, **Red** for wrong choices.
   - Detailed solution explanations, reference notes, and **AI Instant Explanation** modal.

8. **Module 8: Top Recruiter Company Preparation**
   - Hubs for **TCS**, **Infosys**, **Accenture**, **Wipro**, **Cognizant**, **Capgemini**.
   - Round patterns, technical Q&A, HR questions, coding challenges, and student interview experiences.

9. **Module 9: 24/7 AI Placement Mentor Chatbot**
   - Interactive chatbot answering doubts on OOPs, DBMS, SQL JOINs, DSA, and career guidance.

10. **Module 10: Progress Dashboard & PDF Reports**
    - Visual trend charts powered by `Recharts`.
    - Weak vs. Strong topics tracking.
    - Downloadable PDF performance reports for placement officers.

11. **Module 11: Gamified Achievements & Badges**
    - Unlockable badges: *First Quiz*, *100 Questions Solved*, *7-Day Streak*, *Quiz Master*, *Interview Expert*, *Coding Champion*.

12. **Module 12: Admin Management Control Center**
    - System analytics, user management (view/delete), and placement question bank editor.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Axios, Vite
- **Backend**: Node.js, Express.js, Mongoose, JSONWebToken, Multer, Bcryptjs
- **Database**: MongoDB (with fallback in-memory mode for smooth viva demo without local Mongo)
- **AI Engine**: OpenAI API / Google Gemini API (with intelligent rule-based fallbacks)

---

## 🚀 Quick Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates sample placement questions & company modules
npm run dev      # Starts backend server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React app on http://localhost:3000
```

---

## 🔑 Viva Demo Credentials

- **Demo Student**:
  - Email: `student@placement.com`
  - Password: `student123`
- **Demo Administrator**:
  - Email: `admin@placement.com`
  - Password: `admin123`
