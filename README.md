# CapstoneAI — Final-Year Project Idea & Blueprint Architect

> **Built for university students & hackathon teams:** Turn your raw skills, interests, and constraints into production-caliber capstone project blueprints complete with realistic system architectures, 3-week proof-of-concept milestones, and phased development roadmaps.

---

## 🎯 Problem Statement

Final-year engineering and computer science students universally struggle with the question: *"What should I build for my capstone?"*

Most students face three critical failure points:
1. **The "Toy Project" Trap:** Building generic clones (e.g. basic to-do apps or standard chatbots) that fail to impress academic evaluators or hiring managers.
2. **The "Scope Creep" Catastrophe:** Choosing an over-ambitious idea with no clear boundary between what is buildable in a university semester versus a multi-year startup vision.
3. **The Stack Mismatch:** Choosing technologies misaligned with their actual skills, time constraints, or available computing resources (e.g., attempting distributed training with no GPU access).

---

## 💡 Solution Overview

**CapstoneAI** is an AI-powered project architect that formulates end-to-end, defense-ready engineering blueprints tailored to each student's unique profile. Instead of generating vague one-paragraph summaries, CapstoneAI produces:

- **Specific Problem & Stakeholder Framing:** Clear real-world pain points with quantified operational context and target user personas.
- **Full-Stack System Architecture:** Concrete technology choices across Frontend, Backend, Database, Cloud & DevOps, and AI/ML.
- **3-Week Proof of Concept (MVP Scope):** A strictly scoped, achievable minimum viable product designed to validate the core technical concept before tackling complex features.
- **Phased Development Roadmap:** An interactive, 4-phase milestone timeline with explicit deliverables and progress tracking.
- **Risks, Challenges & Mitigations:** Real-world technical bottlenecks (concurrency, data scarcity, medical liability, latency) paired with engineering solutions.
- **Refine & Tailor Engine:** Dynamic customization (e.g., "Simplify for Solo Dev", "Deepen IEEE research angle", "Pivot to Mobile-First").
- **IEEE-Ready Markdown Export:** 1-click clipboard copy or `.md` file download formatted for capstone project proposals.

---

## ✨ Key Features

- **Adaptive Profile Formulation:** Multi-select skill tagging, domain exploration, project categories, experience levels, team composition, and custom hardware/tech constraints.
- **Instant Demo Presets:** 1-click test configurations (Healthcare AI, FinTech Risk Engine, DevSecOps Sentry, Adaptive EdTech) allowing technical judges to immediately evaluate the platform.
- **Interactive Project Blueprint Viewer:** Tabbed exploration covering:
  - *Overview & Problem Space*
  - *Tech & AI Architecture*
  - *Features & 3-Week MVP*
  - *Phased Development Roadmap with Checklists*
  - *Risks, Mitigations & Future Scope*
- **Two-Tier Reliability Gateway:**
  - **Live Gemini AI Generation:** Uses Google Gemini with strict structured JSON output and prompt injection shielding.
  - **Curated High-Fidelity Fallback:** If `GEMINI_API_KEY` is omitted or API quotas are exhausted during a demo, the system seamlessly serves verified, domain-matched blueprints without crashing or displaying blank screens.
- **Interactive Milestone Tracking:** Stateful checkboxes in the roadmap allowing students to track their progress through development phases.
- **Export to Markdown:** Generates clean, publication-ready project proposals ready for university review committees.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 16 (App Router)               │
│               React 19  •  TypeScript  •  Tailwind CSS  │
└────────────────────────────┬────────────────────────────┘
                             │
                  [HTTP / POST REST APIs]
                             │
     ┌───────────────────────┴───────────────────────┐
     ▼                                               ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│  /api/generate-ideas         │   │  /api/refine-idea            │
│  - Rate Limiter (Sliding)    │   │  - Rate Limiter (Sliding)    │
│  - Zod Input Sanitization    │   │  - Zod Request Validation    │
│  - Prompt Injection Defense  │   │  - Blueprint Adjustment      │
└──────────────┬───────────────┘   └──────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Gemini AI Client Layer                      │
│   - Model: gemini-2.5-flash / gemini-1.5-flash                  │
│   - Structured JSON Schema Validation (Zod safeParse)           │
│   - Timeout & Failure Shield (AbortSignal 30s)                  │
│   - Graceful Curated Fallback (Zero Demo Breakage)              │
└─────────────────────────────────────────────────────────────────┘
```

### Stack Components:
- **Framework:** Next.js 16 (App Router, Server Actions & Route Handlers)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS (Dark theme with slate/indigo design tokens)
- **Validation:** Zod (Strict schema validation for inputs and AI outputs)
- **Icons:** Lucide React (Accessible, lightweight SVG icons)
- **AI Model:** Google Gemini API (`@google/genai`)
- **Testing:** Native Node.js test runner (`node:test`) + `tsx`

---

## 🔒 Security Measures

1. **Server-Side Secret Isolation:** `GEMINI_API_KEY` is accessed strictly in server-side route handlers. Never exposed in client bundles, public HTML, or browser console.
2. **Prompt Injection Resistance:** User input is strictly treated as untrusted data. Inputs are parsed, length-clamped, and encapsulated inside `<STUDENT_DATA>` payload blocks with strict system instructions prohibiting instructions inside the payload from altering behavior.
3. **Input Sanitization & Clamping:**
   - Skills & Interests arrays clamped to reasonable bounds.
   - String inputs stripped of control characters and capped in length (max 60-300 chars depending on field).
4. **Strict Output Schema Verification:** Model outputs are parsed with Zod (`geminiProjectsOutputSchema.safeParse`). If output format deviates, the system normalizes or gracefully falls back rather than crashing.
5. **In-Memory Rate Limiting:** Sliding-window rate limiter prevents denial-of-service and quota abuse on API endpoints (15-20 req/min per IP with automatic memory cleanup).
6. **Error Masking:** Raw stack traces, internal Google Cloud URLs, and environment variables are never returned in client HTTP responses.
7. **Safe DOM Rendering:** Avoids `dangerouslySetInnerHTML`. All dynamic text is rendered safely using standard React JSX bindings.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node.js v20 and v24)
- npm or yarn

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/promptwars.git
cd promptwars

# Install dependencies
npm install
```

### 2. Configure Environment Variables (Optional)
The application is pre-configured with a **Curated Demo Mode** that runs with 100% functionality even without an API key.

To enable live Google Gemini AI generation:
```bash
# Copy template
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Runs both unit validation tests and HTTP integration tests.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Testing Verification

The codebase includes an automated test suite verifying:
- [x] **Schema Validation:** Valid profiles pass; empty skills/interests or malicious payloads fail with descriptive Zod errors.
- [x] **Rate Limiting:** Accurately tracks requests and blocks clients exceeding velocity thresholds.
- [x] **Curated Blueprints:** Dynamically adapts fallback blueprints to student constraints (timeframe, team size).
- [x] **Markdown Exporter:** Formats complete IEEE-ready specifications with all 12 standard sections.
- [x] **Gateway Reliability:** Verifies graceful zero-downtime fallback when `GEMINI_API_KEY` is unset.
- [x] **Refinement Engine:** Verifies prompt adjustments alter the target blueprint appropriately.
- [x] **HTTP Integration:** End-to-end testing of `/api/generate-ideas` and `/api/refine-idea` route handlers.

---

## 📋 Example User Flow

1. **Profile Input:**
   - The student opens CapstoneAI and selects a preset (e.g. "Healthcare") or customizes their skills (Python, FastAPI, React), domain (Healthcare), and timeframe (12 weeks).
2. **Generate:**
   - Clicks *"Generate Capstone Blueprints"*. The backend evaluates the profile against Gemini AI (or Curated Engine).
3. **Explore Recommendations:**
   - Reviews 3 tailored project cards showing suitability scores, difficulty levels, and 3-week MVP previews.
4. **Examine Full Blueprint:**
   - Clicks *"Full Blueprint"* on **MediVerify: Clinical Drug Interaction & Prescription Safety Engine**.
   - Browses through the architecture, BioBERT AI integration, and the 4-phase development roadmap.
   - Checks off Phase 1 milestones in the interactive tracker.
5. **Refine Idea:**
   - Clicks *"Refine"*, selects *"Solo Dev (4-Week Sprint)"*, and applies the refinement. The blueprint dynamically adjusts its scope and deliverables.
6. **Export:**
   - Clicks *"Download .md"* to save the project proposal document for university submission.

---

## 🔮 Limitations & Future Scope

### Current MVP Limitations:
- Rate limiting uses in-memory tracking (for multi-instance serverless deployments like AWS Lambda, Redis/Upstash is recommended).
- Curated fallback library currently covers 5 core domains (Healthcare, FinTech, Cybersecurity, EdTech, Climate).

### Planned Enhancements:
- **GitHub Repository Bootstrapper:** One-click repository generation scaffolding the exact folders, Dockerfile, and starter code for the chosen blueprint.
- **Faculty Review Portal:** Allow academic supervisors to review student blueprints, leave comments, and approve project proposals directly within the app.
- **Live Dataset Health Check:** Automated verification of Kaggle/OpenFDA dataset availability and download links.

---

## 📄 License
MIT License. Built for the University AI Hackathon.
