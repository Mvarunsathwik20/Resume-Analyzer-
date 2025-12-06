# AI Resume Analyzer (Mini Project 1)

Backend (Node.js) + Frontend (static) that accepts PDF resumes, extracts text, uses OpenAI to classify domain, extract skills, and generate feedback. Optionally sends report by email.

Quick start:

- Copy `.env` variables (OPENAI_API_KEY, SMTP_*) into `backend/.env`.
- Install backend deps:
  - cd backend && npm install
- Run backend:
  - npm run dev
- Open frontend:
  - open `frontend/index.html` in your browser (or serve it via a static server).

Notes:
- The AI integration uses OpenAI; you can swap it with Wrap AI or other providers by editing `backend/services/openaiClient.js`.


