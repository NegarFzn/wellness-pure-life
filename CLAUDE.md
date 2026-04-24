# CLAUDE.md — Wellness Pure Life

This file gives Claude Code context about this project. Read it before making changes.

---

## Project Overview

**Wellness Pure Life** is a production full-stack wellness platform at [wellnesspurelife.com](https://wellnesspurelife.com). It offers AI-generated wellness plans, quizzes, 21-day challenges, a blog, and a premium subscription tier.

- **Repo**: github.com/NegarFzn/wellness-pure-life
- **Framework**: Next.js 14 (Pages Router — not App Router)
- **Owner**: Solo developer / self-hosted production app

---

## Commands
```bash
# Development
npm run dev           # Start dev server (NODE_ENV=development)

# Production
npm run build         # Build (NODE_ENV=production)
npm run start         # Start production server

# Post-build
# next-sitemap runs automatically via postbuild hook

# Data scripts
npm run import:quiz               # Import quiz questions to MongoDB
npm run import:recommendations    # Import quiz recommendations
npm run reset:quizResults         # Clear quiz results
npm run export:quizResults        # Export quiz results
npm run send:weekly               # Send weekly summary emails

# Testing
npx playwright test               # Run all E2E tests
npx playwright test tests/auth.spec.ts   # Run specific test file
npx playwright show-report        # View last test report
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, Pages Router |
| UI | React 18, CSS Modules, Framer Motion, Lucide React |
| Auth | NextAuth v4, bcryptjs, custom JWT, email verification |
| Database | MongoDB (native driver), global connection cache |
| AI | Azure OpenAI (GPT-4o) via OpenAI SDK |
| Payments | Stripe (subscriptions, webhooks) |
| Email | Nodemailer (SMTP), custom HTML templates |
| Notifications | Firebase (client + admin SDK), Expo push SDK |
| Search | Fuse.js (client-side fuzzy search) |
| Testing | Playwright (E2E) |
| Analytics | Google Analytics (gtag) |
| SEO | next-sitemap |

---

## Project Structure
```
/
├── pages/                  # All routes (Next.js Pages Router)
│   ├── api/                # 35 API endpoints
│   │   ├── auth/           # signup, login, emailverification, reset-password, subscribe
│   │   ├── plan/           # daily, weekly, history, favorites, restore
│   │   ├── quiz/           # quiz-main, quiz-plan, quiz-daily
│   │   ├── admin/          # blog, feedback, create-users
│   │   ├── notifications/  # token, send
│   │   ├── cron/           # run-funnel-7day (drip email automation)
│   │   └── ...             # stripe-webhook, blog, news, weather, contact, ai, chat, etc.
│   ├── fitness/            # index + [...fit].js (dynamic content)
│   ├── mindfulness/        # index + [...mind].js
│   ├── nourish/            # index + [...nourish].js
│   ├── plan/               # weekly-plan, daily-routine, favorites
│   ├── quizzes/            # quiz-main/, quiz-plan/, history
│   ├── challenges/         # 21-days-fitness/, 21-days-mindfulness/, 21-days-nourish/
│   ├── sample/             # weekly-plan, daily-routine (non-premium preview)
│   ├── blog/               # index + [slug].js
│   ├── news/               # index + [slug].js
│   ├── admin/              # blog.js, feedback.js
│   ├── dashboard/          # index.js (authenticated user hub)
│   └── ...                 # login, signup, premium, upgrade, about, faq, etc.
├── components/             # React components
│   ├── Auth/               # Login, Signup, ResetPassword, ResendVerificationModal
│   ├── Plan/               # WeeklyPlan, DailyRoutine, history/preview modals
│   ├── UI/                 # Button, Modal, Toast, ShareButton, AuthorBox, ResultCTA
│   ├── layout/             # Layout, Footer, MobileNav, SpotlightColumn, Weather
│   ├── nourish/            # Content, NourishItem, NourishList
│   ├── Quiz/               # DailyQuiz, QuizCard, QuizPlan subfolders
│   └── ...                 # Subscribe, KeyFeatures, DailyList, FAQItem, etc.
├── lib/
│   ├── plan/               # generateWeeklyPlan.js, generateDailyRoutine.js (AI logic)
│   ├── gtag.js             # Google Analytics events
│   └── quizEvents.js
├── utils/
│   ├── mongodb.js          # DB connection with dev global cache
│   ├── ai.js               # Azure OpenAI client + getAIChatCompletion()
│   ├── auth.js             # Auth helpers
│   ├── email.js            # Nodemailer sendEmail()
│   └── fetch.js            # Client-side fetch helpers
├── emails/                 # Email system
│   ├── emailCreator.js     # Creates email objects (subject + body)
│   ├── contentGenerator.js # Generates email content (AI-assisted)
│   └── templates.js        # HTML email templates
├── middlewares/
│   └── requirePremium.js   # NextAuth JWT middleware — protects premium routes
├── context/
│   ├── ThemeContext.js
│   └── UIContext.js
├── data/                   # Static JSON content libraries
│   ├── fitness.json        # ~900KB
│   ├── mindfulness.json    # ~345KB
│   ├── nourish.json        # ~305KB
│   └── news.json, weather.json
├── styles/
│   └── globals.css
├── public/
│   ├── audio/              # morning-focus.mp3, mindfulness-background.mp3
│   └── images/
├── scripts/                # Node.js data import/export scripts (.cjs + .mjs)
├── tests/                  # Playwright E2E tests
│   ├── auth.spec.ts
│   ├── Pages.spec.ts
│   ├── navigation.spec.ts
│   ├── homepage.spec.ts
│   └── Contact.spec.ts
├── next.config.js
├── next-sitemap.config.js
├── playwright.config.ts
└── Makefile
```

---

## Architecture Decisions

### Pages Router (not App Router)
This project uses **Next.js Pages Router**. Do not suggest App Router patterns (`app/`, `layout.tsx`, Server Components, `use client` directive, etc.).

### CSS Modules
Styling is done with **CSS Modules** (`.module.css` files co-located with components). Do not introduce Tailwind, styled-components, or global class-based approaches.

### MongoDB Connection
`utils/mongodb.js` uses a **global connection cache** in development to avoid exhausting connections during hot reload. Always import `connectToDatabase()` from there — do not create new `MongoClient` instances elsewhere.

### AI Integration
`utils/ai.js` wraps **Azure OpenAI** (not standard OpenAI). The client uses `aiClient.responses.create()` with `input` (not `messages`) and `max_output_tokens` (not `max_tokens`). JSON responses from AI are cleaned with `cleanJSON()` and parsed with `safeParseJSON()` — always use these helpers when handling AI plan output.

### Authentication
- **NextAuth v4** manages sessions (`useSession`, `getToken`)
- Custom `/api/auth/signup` and `/api/auth/login` endpoints
- Users have `isPremium: boolean` and `isVerified: boolean` fields in MongoDB
- `requirePremium.js` middleware protects plan routes via JWT token check

### Premium / Stripe
- Two price IDs: monthly (`price_1Sm2bILUvW2lwD1sQwCVUq0X`) and yearly (`price_1Sm2bxLUvW2lwD1sfea1Q4Wo`)
- `stripe-webhook.js` flips `isPremium` in MongoDB on subscription events
- `confirm-premium.js` handles post-checkout confirmation

### Quiz System
Two distinct quiz types:
- **quiz-main** — general recommendation quizzes (returns advice/content)
- **quiz-plan** — plan-generating quizzes (triggers AI plan generation)
- **quiz-daily** — daily check-in quizzes

MongoDB collections: `quiz_main_questions`, `quiz_main_recommendations`, `quiz_main_saved`, `quiz_plan_questions`, `quiz_plan_recommendations`, `quiz_plan_saved`

---

## Environment Variables

See `.env.example` for all required keys. Key groups:
```
AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME
MONGODB_URI
NEXTAUTH_SECRET, JWT_SECRET
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_ID
EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, RECEIVER_EMAIL
NEXT_PUBLIC_FIREBASE_*, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
GNEWS_API_KEY, WEATHER_API_KEY
```

---

## Common Patterns

### API route structure
```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { db } = await connectToDatabase();
  // ... logic
}
```

### Protected routes
```js
import { getToken } from 'next-auth/jwt';
const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
if (!token) return res.status(401).json({ message: 'Unauthorized' });
```

### GA event tracking
```js
import { gaEvent } from '../../lib/gtag';
gaEvent('event_name', { optional: 'payload' });
```

### Sending email
```js
import { sendEmail } from '../../../utils/email';
import { createVerificationEmail } from '../../../emails/emailCreator';
const { subject, body } = createVerificationEmail(name, email, token);
await sendEmail(email, subject, body);
```

---

## Notes

- `.DS_Store` files are present in the repo — add to `.gitignore`
- `project.md` is an internal MongoDB schema reference, not a README
- Push notifications use Expo SDK server-side + Firebase for web
- Cron job at `/api/cron/run-funnel-7day.js` sends drip emails 7 days after signup