// /lib/quizEvents.js
import { gaEvent } from "./gtag";

// User starts a quiz
export function trackQuizStart(slug) {
  gaEvent("quiz_start", { slug });
}

// User answers a question
export function trackQuizAnswer(slug, questionId, answer) {
  gaEvent("quiz_answer", { slug, questionId, answer });
}

// User completes quiz
export function trackQuizComplete(slug) {
  gaEvent("quiz_complete", { slug });
}

// User submits their email
export function trackQuizEmailSubmit(slug, email) {
  gaEvent("quiz_email_submit", { slug, email });
}

// Plan generated
export function trackPlanGenerated(slug, planName) {
  gaEvent("plan_generated", { slug, planName });
}
