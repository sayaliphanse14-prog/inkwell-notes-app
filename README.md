# Experiment 19 – Deploy MERN Notes App (Cloud)

**Inkwell** – a MERN notes app (React + Express + MongoDB) ready for cloud deployment.

| Layer    | Tech                    | Cloud platform (free)  |
|----------|-------------------------|------------------------|
| Frontend | React (Vite)            | Vercel (or Netlify)    |
| Backend  | Node.js + Express       | Render                 |
| Database | MongoDB + Mongoose      | MongoDB Atlas          |

Features: add / view / edit / delete notes, pin notes, 6 colours, live search, tags,
API-status indicator in the footer (handy for verifying deployment).

## 1. Run locally first
    cd backend  && npm install && cp .env.example .env && npm start
    cd frontend && npm install && npm run dev
Open http://localhost:5173

## 2. Deploy
See **DEPLOYMENT.md** for the complete step-by-step guide
(Atlas -> Render -> Vercel -> connect URLs -> verify).

## Environment variables
Backend (`backend/.env`, or Render dashboard)
- `MONGO_URI`  – MongoDB Atlas connection string
- `CLIENT_URL` – deployed frontend URL(s), comma separated (used for CORS)
- `PORT`       – set automatically by Render

Frontend (`frontend/.env`, or Vercel dashboard)
- `VITE_API_URL` – deployed backend URL, e.g. https://inkwell-api.onrender.com

## API
| Method | Route            | Purpose        |
|--------|------------------|----------------|
| GET    | /api/health      | Health check   |
| GET    | /api/notes       | List notes     |
| POST   | /api/notes       | Add a note     |
| PUT    | /api/notes/:id   | Update a note  |
| DELETE | /api/notes/:id   | Delete a note  |
