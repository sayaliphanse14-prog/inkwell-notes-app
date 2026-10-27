# Deployment Guide (Atlas + Render + Vercel)

Push this whole project to a GitHub repository first
(`git init`, `git add .`, `git commit -m "notes app"`, create repo, `git push`).

## Step 1 – Database: MongoDB Atlas
1. Create a free account at https://www.mongodb.com/atlas and create a free **M0** cluster.
2. **Database Access** -> Add Database User (username + password; note them down).
3. **Network Access** -> Add IP Address -> **Allow access from anywhere (0.0.0.0/0)**.
4. **Connect** -> Drivers -> copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/inkwell?retryWrites=true&w=majority`
   Replace `<user>` and `<password>`, and keep `/inkwell` as the database name.

## Step 2 – Backend: Render
1. https://render.com -> New + -> **Web Service** -> connect your GitHub repo.
2. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance type: Free
3. Environment variables:
   - `MONGO_URI` = your Atlas string
   - `CLIENT_URL` = `http://localhost:5173` (temporary, updated in Step 4)
4. Deploy. Copy your backend URL, e.g. `https://inkwell-api.onrender.com`.
5. Test in browser: `https://inkwell-api.onrender.com/api/health` -> should show `{"status":"ok","database":"connected"}`.

## Step 3 – Frontend: Vercel
1. https://vercel.com -> Add New -> Project -> import the same repo.
2. Settings:
   - Root Directory: `frontend`
   - Framework Preset: Vite (auto-detected)
3. Environment variable:
   - `VITE_API_URL` = your Render backend URL (no trailing slash)
4. Deploy. Copy your frontend URL, e.g. `https://inkwell-notes.vercel.app`.

## Step 4 – Connect frontend and backend URLs
1. Go back to Render -> your service -> Environment.
2. Set `CLIENT_URL` = your Vercel URL (no trailing slash). Save (it redeploys).

## Step 5 – Verify (what to screenshot for the record)
1. Open the Vercel URL. The footer should show a green **API online** dot.
2. Add a note -> it appears in the list.
3. Refresh the page -> the note is still there (proof it is stored in Atlas).
4. In Atlas -> Browse Collections -> `inkwell.notes` shows the saved document.
5. Edit, pin and delete a note to confirm every operation works live.

## Troubleshooting
- **First request is slow (30-60 s):** Render free tier sleeps when idle. Wait and retry.
- **CORS error in browser console:** `CLIENT_URL` on Render does not exactly match your Vercel URL.
- **Footer says "API offline":** wrong `VITE_API_URL`; fix it in Vercel and redeploy.
- **Backend crashes with "MongoDB connection failed":** wrong password in `MONGO_URI`, or Atlas Network Access not set to 0.0.0.0/0.
- Vite env variables are read at build time, so redeploy the frontend after changing `VITE_API_URL`.
