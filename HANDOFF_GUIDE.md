# 🚀 Modular Campus Hub — Project Handover & Judge Guide
### Built for Hacktoberfest Hack Day Jaunpur (at Prasad Institute of Technology)

Welcome to **Modular Campus Hub**! This document provides everything you need to run, demonstrate, and deploy this project with zero hassle.

---

## ⚡ 30-Second Quickstart

### Option A: 1-Click Launcher (Windows)
Simply **double-click** the batch files in this directory:
- **`start.bat`**: Launches the web app at [http://localhost:3000](http://localhost:3000) and automatically opens your browser.
- **`test.bat`**: Runs all 33 automated tests in Vitest with detailed pass/fail reports.
- **`dev.bat`**: Starts development mode with hot-reloading.

### Option B: Command Line (PowerShell)
```powershell
cd d:\anurag

# 1. Enforce strict D: external SSD cache isolation (0 writes to C:)
$env:npm_config_cache="d:\anurag\.cache\npm"
$env:TEMP="d:\anurag\.cache\tmp"
$env:TMP="d:\anurag\.cache\tmp"
$env:NEXT_TELEMETRY_DISABLED="1"

# 2. Run the production server
npm start -- -p 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 How to Add Your Real API Key (Only Remaining Step!)

The application has a built-in **Local Grounded Engine** that works immediately without any API key. When you are ready to enable live neural **Google Gemma 4 (`gemma-4-31b-it`)**, you have two simple options:

### Method 1: In-App 1-Click Modal (Easiest)
1. Open the web app at **[http://localhost:3000](http://localhost:3000)**.
2. In the top navigation bar or desktop sidebar, click the **"⚡ Connect Gemma 4"** button.
3. Paste your free Google AI Studio key (`AIzaSy...`).
4. Click **"Save & Test Connection"**.
5. The app verifies the key in real-time, displays a green confirmation badge, and automatically saves it to `.env.local`!

### Method 2: Manual `.env.local` File
Open `d:\anurag\.env.local` in any text editor and paste your key:
```env
GEMINI_API_KEY=AIzaSyYourActualGoogleAIStudioKeyHere
BACKBOARD_API_KEY=bb_YourOptionalBackboardKeyHere
TEAM_PASSCODE=pit2026
DATA_DIR=./data
NEXT_TELEMETRY_DISABLED=1
```
*(Get a 100% free key with no credit card required at [aistudio.google.com](https://aistudio.google.com/).)*

---

## 🎯 What This Project Solves

During high-stakes collegiate hackathons at **Prasad Institute of Technology (PIT Jaunpur)**, students and organizers face information chaos:
- *"When is the next hackathon?"*
- *"How do I join a project team if I arrived solo?"*
- *"Where do I report a lost item or student ID card?"*

**The Solution**: An extensible, modular **Campus Hub** powered by **Google Gemma 4** and a pure TypeScript **Hybrid BM25 Grounded Retriever**. Every response cites exact uploaded circulars with zero hallucination. If a student asks about unverified facilities (e.g. *"Where is the campus swimming pool?"*), the assistant **defensively refuses to guess**, protecting student safety.

---

## 🏆 Hackathon Judge Demo Script (3-Minute Presentation)

Follow this exact walkthrough to win hackathon prize tracks:

### Step 1: Show Verified Grounding (Gemma Challenge)
1. Go to **`/assistant`** (or click *Launch Assistant* from the landing page).
2. Click the quick starter prompt: **"When is the next hackathon?"**.
3. **Show the Judge**:
   - The assistant answers with exact PIT Jaunpur records: **Saturday, 24 October 2026 (9:30 AM – 3:00 PM IST)** in **Seminar Hall, Block B**.
   - Point out the **`[Source: Hacktoberfest Hack Day Jaunpur 2026 Official Guide]`** citation pill.
   - Click **"Inspect Retrieved Evidence (Judge Drawer)"** to show the exact similarity score and retrieved text chunk.

### Step 2: Prove Zero Hallucination & Defensive Safety
1. Click the starter prompt: **"Does the campus have an Olympic swimming pool?"**.
2. **Show the Judge**:
   - The assistant declines to hallucinate fake pool hours or locations.
   - It politely explains that no such facility exists in campus records and directs the student to the **Student Welfare Desk in Block A**.
   - *This directly satisfies the MLH Gemma Challenge requirement: "Demonstrate that it uses your supplied information instead of simply generating generic answers."*

### Step 3: Demonstrate the Team Knowledge Studio
1. Navigate to **`/knowledge`**.
2. Click **"1-Click Judge Demo Unlock (pit2026)"**.
3. Under **Quick Notice Composer**, publish a live emergency notice:
   - *Title*: `Emergency Hardware Lab Notice`
   - *Content*: `Arduino hardware kits are now being distributed in Computer Lab 2.`
4. Click **"Publish Notice Live to Gemma 4"**.
5. Return to **`/assistant`** and ask: *"Where are Arduino kits being distributed?"*.
6. Watch the AI answer immediately using your newly published notice!

### Step 4: Show the Pitch Video & Presentation Deck
1. Navigate to **`/pitch`**.
2. Click **"Play Video Presentation"** to hear the real-time speech synthesizer narrate the project walkthrough.
3. Click **"Download Pitch Video (.webm)"** to demonstrate the built-in HTML5 Canvas 720p video encoder.

---

## 💎 Sponsor Track Alignment Summary ($0 Free Stack)

| Track | Prize Criteria | What We Built |
| :--- | :--- | :--- |
| **Google Gemma Challenge (MLH)** | Meaningful use of Gemma with verified data | Runs `gemma-4-31b-it` / `gemma-4-26b-a4b-it` via Google AI Studio free tier with strict system grounding and inspectable citation evidence. |
| **Best Open-Source AI Project (MLH)** | High-quality open-source software | Clean Next.js 15 TypeScript architecture, MIT `LICENSE`, git history, comprehensive `README.md`, and **33/33 passing automated tests**. |
| **Best Use of Backboard (DEV Track)** | Persistent memory & context | Synchronizes multi-turn threads to `https://app.backboard.io/api` using the $5 free credit, with local JSON atomic fallback. |
| **Best Use of Render (DEV Track)** | Live deployment with public URL | Turnkey `render.yaml` (`plan: free`) with `/api/health` monitoring for 1-click cloud deployment. |

---

## 🌐 1-Click Cloud Deployment to Render

To deploy this project to the web so judges can test it on their phones:
1. Push this folder to a GitHub repository:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/campus-hub.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [Render.com](https://dashboard.render.com/) (Free account).
3. Click **New +** $\rightarrow$ **Blueprint** $\rightarrow$ Select your GitHub repo.
4. Render detects [`render.yaml`](file:///d:/anurag/render.yaml) and deploys your free live URL in ~3 minutes.
5. In Render Dashboard $\rightarrow$ Environment, add your `GEMINI_API_KEY`.

---

## 🧪 Automated Verification Evidence

Run `npm test` or double-click `test.bat`:
```
Test Files  6 passed (6)
Tests       33 passed (33)
Duration    1.79s
```
- `tests/retriever.test.ts`: Mathematical BM25 search & synonym expansion
- `tests/variations.test.ts`: Real student inquiries & intent coordination
- `tests/grounding.test.ts`: Strict citation formatting & defensive refusal
- `tests/parser.test.ts`: Serverless `unpdf` extraction & semantic chunking
- `tests/store.test.ts`: Self-healing storage lifecycle & atomic JSON
- `tests/api.test.ts`: Full Next.js API route integration (Health, Chat, Knowledge, Threads, Settings)

---

## 📁 Key File Locations

- **Landing Page**: [`src/app/page.tsx`](file:///d:/anurag/src/app/page.tsx)
- **AI College Assistant**: [`src/modules/assistant/AssistantView.tsx`](file:///d:/anurag/src/modules/assistant/AssistantView.tsx)
- **Team Knowledge Studio**: [`src/modules/knowledge/KnowledgeStudioView.tsx`](file:///d:/anurag/src/modules/knowledge/KnowledgeStudioView.tsx)
- **Pitch Video Deck**: [`src/modules/pitch/PitchDeckView.tsx`](file:///d:/anurag/src/modules/pitch/PitchDeckView.tsx)
- **Gemma 4 RAG Core**: [`src/lib/ai/gemma.ts`](file:///d:/anurag/src/lib/ai/gemma.ts)
- **API Key Manager**: [`src/app/api/settings/key/route.ts`](file:///d:/anurag/src/app/api/settings/key/route.ts)
- **Campus Data**: [`data/knowledge/`](file:///d:/anurag/data/knowledge/) & [`data/seed/campus-knowledge.json`](file:///d:/anurag/data/seed/campus-knowledge.json)

---
*Good luck at Hacktoberfest Hack Day Jaunpur! Built with ❤️ for Prasad Institute of Technology.*
