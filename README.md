# 🌙 SoulScript

### Private AI Reflection Journal

SoulScript is a private, AI-powered journaling and reflection application designed to help users slow down, process their thoughts, and gain meaningful insights from their personal reflections.

Instead of acting as a generic chatbot, SoulScript is designed as an **empathetic reflection partner**. Users can write about their experiences, emotions, challenges, or ideas and engage in a contextual conversation powered by Google Gemini.

> **Ideathon Challenge — Google Gen AI Academy Cohort 3**

---

## ✨ Features

* 📝 **Private Journaling** — Create and revisit personal reflection entries.
* 💬 **AI Reflection** — Have contextual, multi-turn conversations about your thoughts.
* 🧠 **AI Insights** — Receive reflections, gentle psychological insights, constructive feedback, and concise takeaways.
* 🔐 **Google Authentication** — Secure sign-in using Firebase Authentication.
* ☁️ **Cloud Persistence** — Journal entries and reflection data are stored using Firebase Firestore.
* 🎨 **Minimal Interface** — A calm, distraction-free interface inspired by Apple's Human Interface Guidelines.
* 📱 **Responsive Experience** — Designed for a comfortable experience across screen sizes.

---

## 🧠 How It Works

```text
                 ┌──────────────────────┐
                 │       User           │
                 │  Journal / Reflect   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   React Frontend     │
                 │     Vite + TS        │
                 └──────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
       ┌─────────────────┐     ┌─────────────────┐
       │ Firebase Auth   │     │   Firestore     │
       │  Google Sign-In │     │ Journal Entries │
       └─────────────────┘     └─────────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Express Backend    │
                 │    /api/reflect      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    Google Gemini     │
                 │ AI Reflection Engine │
                 └──────────────────────┘
```

The frontend communicates with an Express backend for AI functionality. Gemini is initialized on the server using `GEMINI_API_KEY`, preventing the API key from being exposed directly to the browser.

---

## 🛠️ Tech Stack

| Technology                  | Purpose                                 |
| --------------------------- | --------------------------------------- |
| **React 19**                | Frontend application                    |
| **TypeScript**              | Type-safe development                   |
| **Vite**                    | Frontend tooling and development server |
| **Tailwind CSS**            | UI styling                              |
| **Firebase Authentication** | Google authentication                   |
| **Cloud Firestore**         | Journal and reflection persistence      |
| **Google Gemini**           | AI reflection and insights              |
| **Express**                 | Backend API                             |
| **Lucide React**            | Interface icons                         |
| **Motion**                  | UI animations                           |
| **esbuild**                 | Server bundling                         |

The project's dependencies and build scripts are defined in `package.json`.

---

## 📂 Project Structure

```text
Soulscript-Submission/
├── assets/
│   └── .aistudio/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── JournalChat.tsx
│   │   ├── LandingPage.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   └── firebase.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
├── firestore.rules
├── server.ts
├── .env.example
├── firebase-applet-config.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The application is organized around reusable React components for the landing page, dashboard, navigation, and AI-powered journal conversation experience.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* A Firebase project
* Firebase Authentication configured with Google Sign-In
* A Cloud Firestore database
* A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Jericho0912/Soulscript-Submission.git
cd Soulscript-Submission
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The Gemini API key is consumed by the Express backend rather than being embedded in the frontend.

### 4. Configure Firebase

Create or connect a Firebase project and configure:

* Firebase Authentication
* Google Sign-In
* Cloud Firestore

Make sure the Firebase configuration used by the application matches your Firebase project.

### 5. Start the development server

```bash
npm run dev
```

The application runs through the Express server and is available on:

```text
http://localhost:3000
```

---

## 🔐 Privacy & Security

Privacy is a core design principle of SoulScript because journal entries may contain highly personal information.

Firestore security rules are included in the repository to restrict access to authenticated users and their own data.

The Gemini API is also accessed through the server-side `/api/reflect` endpoint rather than directly from the client. This keeps the Gemini API credential out of the browser.

**Important:** Never commit your `.env` file or expose your `GEMINI_API_KEY` publicly.

---

## 🤖 AI Reflection

SoulScript uses Gemini as a reflection and journaling assistant.

The AI is instructed to act as a:

> Compassionate, insightful, and wise AI reflection partner and journaling guide.

It can help users:

* Unpack thoughts and experiences
* Explore personal challenges
* Reflect on journal entries
* Generate gentle psychological insights
* Provide constructive feedback
* Brainstorm ideas
* Summarize important takeaways

The application sends conversation history and contextual information to the backend, allowing the AI to maintain the context of an active reflection session.

---

## 🏗️ Build for Production

Create a production build with:

```bash
npm run build
```

This builds the Vite frontend and bundles the Express server using esbuild.

To run the production build:

```bash
npm start
```

The available project scripts include development, production build, start, clean, and TypeScript checking.

---

## 🎯 Project Vision

SoulScript is built around a simple idea:

**Journaling should not just be about recording what happened—it can also be an opportunity to understand why we feel and think the way we do.**

By combining traditional journaling with conversational AI, SoulScript aims to create a more interactive and introspective way of processing personal experiences.

The AI is not intended to replace professional mental-health support. Instead, it serves as a private tool for reflection, organization, and self-discovery.

---

## 📄 License

This project was created as a submission for the **Google Gen AI Academy Cohort 3 Ideathon Challenge**.

See the repository for the latest project and licensing information.
