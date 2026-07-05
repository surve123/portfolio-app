# Shreyas Surve — Portfolio (React + Java/Spring Boot)

A full stack version of the portfolio: a React (Vite) frontend, and a
contact-form backend that emails submissions straight to your inbox. Two
backend implementations are included — pick one:

```
portfolio-app/
├── client/               React (Vite) frontend
├── server-springboot/    Backend in Java + Spring Boot (recommended — matches your resume)
└── server/               Backend in Node + Express (kept as an alternative)
```

Both backends expose the same API: `POST /api/contact` → emails the message
to `shreyas.surve02@gmail.com` (or whatever `TO_EMAIL` you set).

## Why Spring Boot

Since the whole point of this site is to show you're a Java / Spring Boot
developer, having the actual contact-form backend running on Spring Boot
(instead of Node) is more consistent with the resume and gives anyone
reading the code a real Spring Boot sample, not just Java on paper. That's
the one described below; `server/` (Express) still works if you'd rather
run Node.

## 1. Run the Spring Boot backend

Requires **JDK 17+** and **Maven** installed locally (this sandbox doesn't
have Maven, so it hasn't been build-tested end-to-end here — the code was
written and reviewed carefully, but run `mvn spring-boot:run` locally to
confirm before you deploy).

```bash
cd server-springboot
```

Set these as environment variables (don't commit real credentials to
`application.properties`):

| Variable | Purpose |
|---|---|
| `MAIL_USERNAME` | Gmail address that sends the email |
| `MAIL_PASSWORD` | Gmail **App Password** (not your normal password — see below) |
| `TO_EMAIL` | Where messages land (defaults to `shreyas.surve02@gmail.com`) |
| `APP_CORS_ALLOWED_ORIGINS` | Your deployed client URL in production (defaults to `*`) |
| `PORT` | Defaults to `5000` |

Generating a Gmail App Password:
1. Turn on 2-Step Verification: https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Export it locally, e.g.:
   ```bash
   export MAIL_USERNAME=your.email@gmail.com
   export MAIL_PASSWORD=your16charapppassword
   mvn spring-boot:run
   ```

Visit `http://localhost:5000/api/health` — it should say
`"emailConfigured": true` once the env vars are set.

## 2. Run the frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/...` to
`http://localhost:5000` in dev (see `client/vite.config.js`), so the
contact form works against whichever backend (Spring Boot or Express) is
running on port 5000.

## 3. Going live (deploying)

This part needs a couple of accounts on hosting providers — that's
something you'll need to do yourself (I can't sign up for services or enter
credentials on your behalf). Here's the shape of it:

**Frontend (static site):**
- `cd client && npm run build` → produces `client/dist/`.
- Push the repo to GitHub, then connect it on **Vercel** or **Netlify**
  (both have free tiers, and both auto-detect Vite). Point the build at the
  `client` folder.

**Backend (needs a Java host — GitHub Pages/Vercel don't run Java):**
- **Render** has a native "Web Service" type for Docker/Java and a generous
  free tier (cold starts after inactivity). Point it at `server-springboot/`
  and it can build using the included `Dockerfile`.
- **Railway** or **Fly.io** are similar alternatives if you prefer.
- Whichever you pick, set `MAIL_USERNAME`, `MAIL_PASSWORD`, `TO_EMAIL`, and
  `APP_CORS_ALLOWED_ORIGINS` as environment variables in that host's
  dashboard.

**Wire them together:**
- Once the backend has a public URL (e.g. `https://portfolio-api.onrender.com`),
  set `VITE_API_URL` when building the client so it knows where to send
  contact-form requests (e.g. a `client/.env` file:
  `VITE_API_URL=https://portfolio-api.onrender.com`), then rebuild/redeploy
  the client.
- Set `APP_CORS_ALLOWED_ORIGINS` on the backend to your deployed client's
  URL so the browser is allowed to call it.

## Notes

- The resume button downloads `client/public/Shreyas_Surve_Resume.pdf`.
  Swap that file to update what visitors download.
- The rate limiter (in both backends) caps the contact form at 5
  submissions/minute per IP to deter spam — fine for a personal site.
- "Live Demo" links on projects are disabled ("Demo soon") until you deploy
  one of the actual project apps and add its URL in
  `client/src/App.jsx` (`PROJECTS[i].demo`).
