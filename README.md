StudyGenie — AI Smart Study Partner

Built with love for HackFest 2025

StudyGenie is a simple, clean, and powerful AI-powered study assistant designed to help students learn faster and smarter.
With just a PDF upload or pasted text, StudyGenie instantly generates:

✔ Summaries
✔ Key Points
✔ Auto-Generated Quizzes
✔ Flowcharts

You can also study together with friends using built-in video calling, screen sharing, and real-time collaboration.
A full History panel lets you revisit any previously processed topic anytime.

> In short: StudyGenie converts messy study material into clean, organized, and understandable notes — instantly.



🔗 Live Demo

https://dancing-praline-eae563.netlify.app/
(Hosted on Netlify — works on mobile + laptop)


 Features :

 Upload Notes

Upload PDFs or paste text

Extracts content instantly

Clean UI for quick reading


🧠 AI Generation

For every note uploaded, StudyGenie can generate:

Summary

Key Points

Quiz (MCQs)

Flowchart (structured breakdown)


Everything displays in a neat lavender-themed interface.

👥 Study With Friends

Invite friends using a join button

Enter the same room

Study the same topic together


🎥 Video Call + Screen Sharing

Built-in video calling

Share your screen to explain concepts

Great for group study and revision


📚 Topic History

Automatically saves previously processed content

Revisit old summaries, key points, and quizzes anytime

Extremely useful during exam revision



🛠 Tech Stack

Frontend:

HTML

Tailwind CSS

JavaScript


AI Processing:

OpenAI API for summaries, quizzes, key points, flowcharts


Collaboration:

WebRTC (via browser APIs)

getUserMedia / getDisplayMedia

Custom signaling-free peer setup (for prototype)


Hosting:

Netlify

GitHub (source code)



📁 Project Structure

studygenie/
│
├── index.html             # Landing page
├── login.html             # Login page
├── students.html          # Dashboard
├── upload.html            # Upload & AI tools
├── group.html             # Study with friends (video call)
│
├── css/
│   └── styles.css         # Main styles
│
├── js/
│   ├── upload.js          # Handle file/text uploads
│   ├── summary.js         # AI summary rendering
│   ├── quiz.js            # Generate & render quizzes
│   ├── flowchart.js       # Flowchart creation
│   └── videoCall.js       # Video call & screen sharing
│
└── assets/
    └── images, icons, etc.



🚀 How It Works (Process Description)

1️⃣ Upload

User uploads a PDF OR pastes text into the tool.

2️⃣ Generate

StudyGenie sends the content to the AI backend and generates:

Summary

Key Points

Quiz

Flowchart


3️⃣ Display

Results appear on the screen instantly, ready for revision.

4️⃣ Study Together

Users can:

Join a study room

Video call with friends

Share screen to review topics


5️⃣ History

Previous topics are stored for fast future revision.


🧪 Running the Project Locally

Since this is a front-end project, it runs easily on any local server.

1. Clone the repo

git clone https://github.com/swetasaraswat/StudyGenie.git

2. Use a local server instead of opening files directly

Example using Python:

python3 -m http.server 5500

Now go to:
👉 http://localhost:5500

Everything will work in your browser.


📹 Demo Vide
https://drive.google.com/file/d/1FttWLdgWehP5iKnffx-T2Iozw4B76bzI/view?usp=drivesdk


🛡 Security Notes

No sensitive data stored

PDF/text processed only for summary output

No password database used (prototype stage)



🚀 Future Enhancements

Proper backend for user accounts

Real-time shared whiteboard

Voice-based question answering

Personalized study planner

Dark mode

Mobile app version

Saved quizzes & flashcards



👩‍💻 Built By

Sweta Saraswat — Developer, UX, Idea
Parthiv yadav
Kunika Varshney
Ujjwal Malhotra


⭐ Why We Built This

As students, we often drown in PDFs, long notes, and scattered study material.
StudyGenie was our attempt to create something that:

✔ Makes studying lighter
✔ Helps students revise faster
✔ Allows friends to collaborate easily
✔ Gives quick clarity on any topic

It’s built by students — for students.
