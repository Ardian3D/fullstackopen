# Phonebook backend — Full Stack Open Part 3

Source code for the Part 3 exercises. This backend depends on a **real MongoDB Atlas database**; it does not silently fake persistence. The frontend source is in `../frontend`, and its compiled output is copied here into `dist/` by `npm run build:ui`.

**Deployed phonebook URL:** TODO — add the real public URL after you deploy.

## Local setup

1. `npm install` in this backend directory.
2. Copy `.env.example` to `.env`, edit with your real Atlas `MONGODB_URI` (do not commit this file).
3. `npm run dev` starts Express on port 3001 after MongoDB connects.
4. `npm run lint` and `npm test` check source and Mongoose validators.
5. For UI: run `npm install` in `../frontend`, then `npm run build:ui` here and open `http://localhost:3001`.

## Routes

- `GET /api/persons`, `GET /api/persons/:id`, `POST /api/persons`
- `PUT /api/persons/:id`, `DELETE /api/persons/:id`
- `GET /info` and `GET /health`

## Deployment

Render example: connect repository, select Node web service; **Root Directory** `part3/phonebook/backend`, build `npm install`, start `npm start`; add environment variable `MONGODB_URI` in hosting dashboard. Ensure `dist/` exists in Git for exercises 3.11 and 3.21, from `npm run build:ui`. Actual public deployment and production testing cannot be done from the ZIP alone.

## Academic integrity

Study and adapt each exercise's implementation, verify every applicable requirement, and only claim completed exercises in the Helsinki submission system. Do not present copied code as an independent exercise solution.

After deployment, also put the public URL in the **top-level repository README** per official Exercise 3.10.
