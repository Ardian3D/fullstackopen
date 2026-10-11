# Part 3 — Windows installation and submission checklist

Official material: https://fullstackopen.com/en/part3

Part 3 has **21 exercises, 3.1–3.21**. Several exercises are optional, but some require MongoDB Atlas, actual deployment, and real interactions with a full-stack app. An archive alone is **not evidence of completion**.

## 1. Extract into the existing repository

In PowerShell:

```powershell
cd C:\visual-studio-code\fullstackopen
Expand-Archive -Path "$env:USERPROFILE\Downloads\fullstackopen-part3-final.zip" -DestinationPath . -Force
```

This creates `part3/phonebook/backend` and `part3/phonebook/frontend`. It does NOT overwrite your Part 2 files.

## 2. MongoDB Atlas (required)

Create a **free-tier-eligible** MongoDB Atlas cluster and database user. Configure IP Network Access suitable for your local machine and deploy host, carefully restricting access where possible. Copy the connection URI. In PowerShell:

```powershell
cd C:\visual-studio-code\fullstackopen\part3\phonebook\backend
Copy-Item .env.example .env
notepad .env
npm install
npm run lint
npm test
npm run dev
```

Set `MONGODB_URI` in `.env` to your real private URI (use URL-encoded password if it contains special characters). The backend **will not start** without a working database connection. Never commit `.env` or paste its contents publicly. Test `http://localhost:3001/api/persons` and `http://localhost:3001/info`.

If your Atlas database has no persons yet, you may get `[]`, which is normal. Add a test person via the React app or via `requests.http` using the VS Code REST Client.

## 3. Run and build the frontend

In another terminal:

```powershell
cd C:\visual-studio-code\fullstackopen\part3\phonebook\frontend
npm install
npm run dev
```

Open the URL shown by Vite. The frontend forwards `/api/...` unchanged to Express on port 3001 (note: Part 2's Vite proxy removed `/api`, which must NOT happen with Express).

To build the production frontend and copy it into the backend's dist directory:

```powershell
cd C:\visual-studio-code\fullstackopen\part3\phonebook\backend
npm run build:ui
npm start
```

Stop `npm run dev` with Ctrl+C before `npm start`, or port 3001 will already be in use. Open `http://localhost:3001` and verify the app works. **The backend `dist/` directory must be included in Git**.

## 4. Verify core functionality

- [ ] List contacts through `GET /api/persons`
- [ ] Add a valid person, observe HTTP 201 and DB persistence
- [ ] Reject a duplicate name and missing fields with HTTP 400
- [ ] Read an existing/nonexistent person by ID
- [ ] Edit person number and verify Mongoose update validation
- [ ] Delete a person, confirm removal after restarting server
- [ ] Test 3.12 `mongo.js` against real Atlas
- [ ] Run `npm run lint` and `npm test`
- [ ] Verify `http://localhost:3001` shows the **built** React frontend
- [ ] Verify the app online, including MongoDB, API and React UI

## 5. Publish

From repository root:

```powershell
cd C:\visual-studio-code\fullstackopen
git status
git add part3
git commit -m "Implement Full Stack Open Part 3 Phonebook"
git push origin main
```

For Render: create a Node web service connected to this repo; set `Root Directory` to `part3/phonebook/backend`, `Build Command` to `npm install`, `Start Command` to `npm start`. Set the secret `MONGODB_URI` in Render's environment settings. Confirm reachable `https://YOUR-SERVICE-URL/api/persons` and root `/`. Hosting plans/payment requirements may vary. Add the actual deployed URL to `part3/phonebook/backend/README.md` **and to the existing repository-root `README.md` (Full Stack Open 3.10)**, then commit/push again.

Note: The official material recommends a separate repository for backend deployment to avoid accidental package.json path issues. Using Render's explicit Root Directory is an alternative; if your host does not support monorepo subdirectories, create a separate backend deployment repo **without publishing secrets**.

## 6. Helsinki submission

Submit through https://studies.cs.helsinki.fi/stats/courses/fullstackopen and use the repo URL `https://github.com/Ardian3D/fullstackopen`. Enter actual hours used. Mark ONLY exercises you have personally completed/verified. You cannot usually add exercises for the same Part 3 later after pressing Send. Public deployment and MongoDB cannot be supplied from a ZIP file alone.
