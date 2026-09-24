# StudyGenie — AI Smart Study Partner

**Live demo:** [https://studygeniee.netlify.app/]
**Demo video:** [Watch on Google Drive](https://drive.google.com/file/d/1FttWLdgWehP5iKnffx-T2Iozw4B76bzI/view?usp=drivesdk)

Built at HackFest 2025, StudyGenie turns messy study material a PDF, pasted notes, a lecture transcript into a clean summary, an auto-generated quiz, and a visual flowchart in seconds, and lets students work through it together over live video.

## The Problem

Students revising from scattered PDFs and long lecture notes lose time to two separate frictions: turning raw material into something actually revisable, and coordinating group study once they have it. StudyGenie collapses both into one flow.

## Features

- **Upload & Extract** — drop in a PDF or paste text; content is parsed and ready to process instantly
- **AI Generation** — one click produces a summary, key points, an MCQ quiz, or a Mermaid flowchart from the same source text
- **Study With Friends** — join a shared room, video call, and screen-share to walk a friend through a topic live
- **Topic History** — the last 10 processed sessions are saved locally and restorable with one click, useful heading into exams

## Architecture

| Layer | Choice |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| AI Processing | Google Gemini API, called through a serverless proxy (see below) |
| Real-Time Video | Agora RTC SDK for video calls and screen sharing |
| PDF Parsing | PDF.js, extracted client-side |
| Diagrams | Mermaid.js |
| Hosting | Netlify (static site + serverless functions) |

**API keys are never shipped to the browser.** AI requests go through a Netlify serverless function (`netlify/functions/gemini.js`) that holds the Gemini keys server-side as environment variables and rotates across them on failure. The client only ever calls our own `/.netlify/functions/gemini` endpoint — nothing sensitive is present in the frontend bundle or visible in page source.

## Project Structure

```
studygenie/
├── index.html
├── login.html
├── app.html
├── css/
│   ├── base.css
│   └── components.css
├── js/
│   ├── core/
│   │   ├── state.js
│   │   ├── utils.js
│   │   ├── api.js
│   │   └── history.js
│   ├── features/
│   │   ├── pdfUpload.js
│   │   ├── summary.js
│   │   ├── quiz.js
│   │   ├── flowchart.js
│   │   └── videoCall.js
│   ├── pages/
│   │   └── login.js
│   └── main.js
├── netlify/
│   └── functions/
│       └── gemini.js
├── netlify.toml
└── .env.example
```

## Running Locally

This is a static frontend, so any local server works:

```bash
git clone https://github.com/swetasaraswat/StudyGenie.git
cd StudyGenie
python3 -m http.server 5500
```

Then visit `http://localhost:5500`. AI features require a `GEMINI_API_KEYS` environment variable (comma-separated keys) available to the Netlify function — see `.env.example`. Use `netlify dev` to run the function locally, or deploy to Netlify directly.

## Security Notes

- No sensitive data is stored; PDFs and text are processed only to generate output
- AI provider keys live server-side as environment variables, never in client code
- The login page validates and redirects client-side only — it's a prototype UI, not backed by a real authentication service or user database yet

## Roadmap

- Real backend with proper user accounts and authentication
- Real-time shared whiteboard
- Voice-based question answering
- Personalized study planner
- Saved quizzes & flashcards as a dedicated study set

## Built By

Team StudyGenie — HackFest 2025

- **Sweta Saraswat** — Leader, AI integration, UI/UX, webRTC layer and deployment. 
- Parthiv Yadav
- Kunika Varshney
- Ujjwal Malhotra

## Why We Built This

As students, we drown in PDFs, long notes, and scattered study material. StudyGenie is our attempt to make studying lighter, help students revise faster, and let friends collaborate easily — built by students, for students.
