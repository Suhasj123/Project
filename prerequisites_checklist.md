# InterviewPro — Production Setup & Effective Execution Checklist

To run and demonstrate the **InterviewPro AI Portal** with maximum performance and efficiency, here is the complete setup checklist:

---

## 1. ⚙️ Prerequisites & System Requirements

| Component | Requirement | Status / Instructions |
| :--- | :--- | :--- |
| **Node.js Environment** | Node.js v18.0.0 or higher | Required to run backend & frontend servers |
| **Database** | MongoDB (Local or Atlas) | `mongodb://127.0.0.1:27017/interview_prep_db` |
| **Browser Support** | Google Chrome / Microsoft Edge | Recommended for Web Speech API (Voice Dictation) |

---

## 2. 🔑 API Keys & Environment Configuration (`backend/.env`)

Create or update the `.env` file inside `backend/.env`:

```env
# Server Port & Secret
PORT=5000
JWT_SECRET=prepai_super_secret_jwt_key_2026

# Database Connection String
MONGO_URI=mongodb://127.0.0.1:27017/interview_prep_db

# AI Engine API Keys (Optional - Fallback Mock Responses Active if Empty)
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Real Email SMTP Dispatch Credentials (Optional - Ethereal Test Inbox Active if Empty)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

> **Note on Zero-Configuration Fallbacks**:
> - If **AI API Keys** are omitted, the application uses built-in smart AI fallback response generators for instant responses without API costs.
> - If **SMTP Credentials** are omitted, Nodemailer auto-generates Ethereal test preview URLs in the console for instant email verification.

---

## 3. 🎙️ Browser Microphone Permissions
- For **AI Technical Mock Interviews (`/ai-mock-interview`)**, allow **Microphone Access** when prompted by the browser for continuous Speech-to-Text dictation.

---

## 4. 🚀 Quick Launch Command Summary

1. **Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Frontend Application**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
