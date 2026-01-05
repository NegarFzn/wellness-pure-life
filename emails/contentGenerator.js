import fs from "fs";
import path from "path";
import { emailFooter, premiumHeader } from "./templates";

// ============================================================
// GLOBAL HELPER
// ============================================================
function getAppUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";
}

const appUrl = getAppUrl();
const logoUrl = `${appUrl}/images/logo.png`;

// ============================================================

const CTA_STYLE = `
background:#4F46E5;
color:white;
padding:14px 26px;
border-radius:28px;
text-decoration:none;
font-size:14px;
font-weight:600;
display:inline-block;
box-shadow:0 6px 16px rgba(79,70,229,0.25);
letter-spacing:0.3px;`;

// ============================================================

function safeReadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.error("JSON read error:", filePath, e);
    return {};
  }
}

const __dirname = path.resolve();
const newsData = safeReadJSON(path.resolve(__dirname, "data/news.json"));
const fitness = safeReadJSON(path.resolve(__dirname, "data/fitness.json"));
const mindfulness = safeReadJSON(
  path.resolve(__dirname, "data/mindfulness.json")
);
const nourish = safeReadJSON(path.resolve(__dirname, "data/nourish.json"));

function pickRandomEntry(data) {
  const sections = Object.values(data || {}).flat();

  // Prevent crash when array is empty
  if (!sections.length) {
    return {
      title: "No data available",
      description: "",
      content: "",
    };
  }

  return sections[Math.floor(Math.random() * sections.length)];
}

export function generateEmailContent() {
  const fit = pickRandomEntry(fitness);
  const mind = pickRandomEntry(mindfulness);
  const food = pickRandomEntry(nourish);
  const news = pickRandomEntry(newsData);

  return {
    subject: "This Week’s Wellness: Fuel, Focus & Fitness 💚",
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>

<body style="margin:0; padding:0; background:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <center style="width:100%; padding:32px 12px;">
    <table role="presentation" width="100%">
      <tr>
        <td align="center">

          <!-- MAIN CONTAINER -->
          <table role="presentation" width="1000" cellpadding="0" cellspacing="0"
            style="max-width:1000px; width:100%; background:white; border-radius:16px; overflow:hidden;">

            <!-- PREMIUM HEADER -->
            <tr>
              <td>
                ${premiumHeader()}
              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td style="padding:32px; font-size:17px; color:#2c2c2c; line-height:1.75;">

                <h2 style="color:#0d0d0d; font-size:26px; margin-bottom:20px;">
                  🌟 Your Health Highlights
                </h2>

                <div style="margin-bottom:24px; font-size:17px; line-height:1.7;">
                  <p><strong>Fitness:</strong> ${fit.title}</p>
                  <p><strong>Mindfulness:</strong> ${mind.title}</p>
                  <p><strong>Nutrition:</strong> ${food.title}</p>
                  <p><strong>News:</strong> ${news.title}</p>
                </div>

                <p style="margin-top:30px;">
                  Stay well,<br/>
                  <strong>The Wellness Pure Life Team 🌿</strong>
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td>
                ${emailFooter()}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>

</body>
</html>
`,
  };
}

/* ============================================================
   PREMIUM WRAPPER — MOVED OUTSIDE SO BOTH FUNCTIONS CAN USE IT
============================================================ */
export const premiumWrapper = (
  innerHTML,
  {
    showCTA = true,
    title = "Wellness Pure Life Premium",
    subtitle = "7-Day Wellness Reset · Personalized Guidance",
  } = {}
) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<style>
  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; padding: 0 !important; }
    .card { padding: 22px !important; border-radius: 0 !important; }
    h2 { font-size: 20px !important; line-height: 1.4 !important; }
    p, li { font-size: 15px !important; line-height: 1.6 !important; }
    .cta-btn { padding: 14px 22px !important; width: 100% !important; }
  }
</style>
</head>

<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 0;">
<tr>
<td align="center">

<table class="container" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;">

<!-- 🔥 ONLY ONE HEADER FOR ALL EMAILS -->
${premiumHeader(title, subtitle)}

<tr>
  <td class="card" style="
    background:white;
    padding:32px;
    border-radius:0 0 20px 20px;
    font-size:15px;
    line-height:1.65;
    color:#333;
  ">

    ${innerHTML}

    ${
      showCTA
        ? `
    <div style="text-align:center;margin:32px 0 8px;">
       <a href="${appUrl}/premium" style="${CTA_STYLE}">
              Go to your Premium plan →
            </a>
    </div>`
        : ""
    }
  </td>
</tr>

</table>

${emailFooter()}

</td>
</tr>
</table>

</body>
</html>
`;

/* ============================================================
   WEEKLY SEQUENCE — UNCHANGED
============================================================ */
export function generateWeeklySequence(userName = "there") {
  return [
    {
      subject: "Your FREE 7-Day Wellness Reset is Activated 🎉",
      content: premiumWrapper(`
        <h2>Welcome ${userName},</h2>
        <p>You just activated your <strong>FREE 7-Day Wellness Reset</strong>.</p>
        <p>For the next 7 days, we will gently rebalance:</p>
        <ul>
          <li>💪 Body</li>
          <li>🧘 Nervous System</li>
          <li>🥗 Energy</li>
        </ul>
        <p><strong>Today's Reset:</strong></p>
        <p>5-min mobility, 4-4-6 breathing, warm lemon water.</p>
      `),
    },

    {
      subject: "Your system is starting to feel safe again",
      content: premiumWrapper(`
        <h2>Day 2 — Momentum Without Pressure</h2>
        <p>Your nervous system responds to <strong>consistency before intensity</strong>.</p>
        <p>Fitness: 10-min low impact</p>
        <p>Mindfulness: Box breathing</p>
        <p>Nourish: Protein snack</p>
      `),
    },

    {
      subject: "Why your mind feels lighter today",
      content: premiumWrapper(`
        <h2>Day 3 — Nervous System Reset</h2>
        <p>Fitness: 15-min walk</p>
        <p>Mindfulness: Grounding</p>
        <p>Nourish: Slow mindful eating</p>
      `),
    },

    {
      subject: "You are becoming consistent without forcing it",
      content: premiumWrapper(`
        <h2>Day 4 — Confidence Through Action</h2>
        <p>Fitness: Bodyweight circuit</p>
        <p>Mindfulness: Daily intention</p>
        <p>Nourish: Colorful vegetable</p>
      `),
    },

    {
      subject: "Why most wellness routines fail after 2 weeks",
      content: premiumWrapper(`
        <h2>${userName}, motivation is not your problem.</h2>
        <p>People fail because they lack:</p>
        <ul>
          <li>Nervous system regulation</li>
          <li>Progression structure</li>
          <li>Psychological safety</li>
        </ul>
      `),
    },

    {
      subject: "The real reason some people always succeed",
      content: premiumWrapper(`
        <h2>Transformation is not built on effort.</h2>
        <p>It's built on systems, repetition, and stability.</p>
      `),
    },

    {
      subject: "Your 48-hour Premium Access Window is Now Open ⏳",
      content: premiumWrapper(
        `
        <h2>${userName}, your private window is open.</h2>
        <p>You completed your FREE reset.</p>
        <p>Unlock full personalization for 48 hours.</p>
        <a href="${appUrl}/premium" style="color:#4F46E5;">
          Activate Premium
        </a>
      `,
        false
      ),
    },
  ];
}

/* ============================================================
   CORRECTED FUNNEL SELECTOR (NO DUPLICATE HEADER)
============================================================ */

export function generateFunnel7DayContent(dayIndex, userName = "there") {
  const sequence = generateWeeklySequence(userName);

  // ============================================================
  // COMPLETION EMAIL (AFTER DAY 6)
  // ============================================================
  if (!sequence[dayIndex]) {
    const title = "🌿 Your Free 7-Day Reset Is Complete";

    return {
      subject: title,
      htmlContent: premiumWrapper(
        `
          <h2>Great job, ${userName}!</h2>

          <p>You successfully completed your <strong>FREE 7-Day Wellness Reset</strong>.</p>

          <ul>
            <li>✔ Adaptive fitness programming</li>
            <li>✔ Advanced nervous system regulation</li>
            <li>✔ Full nutrition automation</li>
            <li>✔ Personalized weekly routines</li>
          </ul>

          <div style="text-align:center;margin:32px 0;">
            <a href="${appUrl}/premium" style="${CTA_STYLE}">
              Upgrade to Premium
            </a>
          </div>
        `,
        {
          title: "Your 7-Day Reset Is Complete",
          subtitle: "Congratulations · Your new chapter begins",
          showCTA: false,
        }
      ),
    };
  }

  // ============================================================
  // NORMAL DAYS 0–6 FROM WEEKLY SEQUENCE
  // ============================================================
  const { subject, content } = sequence[dayIndex];

  return {
    subject,
    htmlContent: content, // already wrapped inside premiumWrapper()
  };
}

/* ============================================
   DAILY ROUTINE EMAIL TEMPLATE (NEW)
=============================================== */

export function generateDailyPlanEmail({ routine, name }) {
  console.log("🟣 EMAIL GENERATOR INPUT:", {
    hasRoutine: !!routine,
    routineKeys: routine ? Object.keys(routine) : null,
    name,
  });

  if (!routine) {
    throw new Error("Routine data missing for email generator.");
  }

  // Extract fields safely
  const dailyRoutine = routine.dailyRoutine || {};
  const daySummary = routine.daySummary || "";
  const quote = routine.quote || "";
  const quoteAuthor = routine.quoteAuthor || "";
  const mentorTip = routine.mentorTip || "";
  const updatedAt = routine.updatedAt
    ? new Date(routine.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Routine sections (OBJECTS, not arrays)
  const morning = dailyRoutine.Morning || null;
  const midday = dailyRoutine.Midday || null;
  const evening = dailyRoutine.Evening || null;

  const subject = `Your Daily Wellness Routine for ${updatedAt}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              
${premiumHeader("Your Daily Wellness Plan", "Mind · Body · Balance")}
              <!-- BODY -->
              <tr>
                <td style="padding:30px;">

                  <p style="font-size:15px;color:#444;">
                    Hello <strong>${name}</strong>,
                  </p>

                  <p style="font-size:14px;color:#555;margin-top:20px;">
                    <strong>Last updated:</strong> ${updatedAt}
                  </p>

                  ${
                    quote
                      ? `
                  <div style="background:#f9fafc;border-left:4px solid #7b5bff;padding:15px 20px;margin-top:20px;border-radius:8px;">
                    <p style="font-size:14px;color:#666;margin:0;">“${quote}”</p>
                    ${
                      quoteAuthor
                        ? `<p style="margin:5px 0 0;font-size:13px;color:#888;">— ${quoteAuthor}</p>`
                        : ""
                    }
                  </div>`
                      : ""
                  }

                  ${
                    mentorTip
                      ? `
                  <p style="margin-top:25px;font-size:14px;"><strong>Coach Tip:</strong><br>${mentorTip}</p>
                  `
                      : ""
                  }

                  ${
                    daySummary
                      ? `
                  <p style="margin-top:25px;font-size:14px;"><strong>Summary:</strong><br>${daySummary}</p>
                  `
                      : ""
                  }

                  <h2 style="margin-top:35px;font-size:18px;color:#333;">Your Routine</h2>

                  ${renderBlock("🌅 Morning", morning)}
                  ${renderBlock("🌤 Midday", midday)}
                  ${renderBlock("🌙 Evening", evening)}

                  <!-- CTA BUTTON -->
  <div style="text-align:center;margin:45px 0 25px 0;">
    <a href="${appUrl}/premium" style="${CTA_STYLE}">
      Go to your Premium plan →
    </a>
  </div>

                </td>
              </tr>

              <!-- FOOTER -->
               ${emailFooter()}

            </table>

          </td>
        </tr>
         
      </table>

    </body>
  </html>
  `;

  return { subject, html };
}

/* ------------------------------------------
   Render a ROUTINE BLOCK (Morning / Midday / Evening)
------------------------------------------- */
function renderBlock(title, block) {
  if (!block) return "";

  return `
    <div style="margin-top:25px;">
      <h3 style="font-size:16px;color:#222;margin-bottom:10px;">${title}</h3>
      
      <div style="padding:15px;border:1px solid #eee;border-radius:10px;background:#fafafb;">
        <p style="margin:0 0 10px;font-size:14px;color:#444;"><strong>${
          block.title
        }</strong></p>
        <p style="margin:0 0 10px;font-size:14px;color:#555;">${
          block.description
        }</p>

        ${
          block.durationMinutes
            ? `<p style="margin:0 0 10px;font-size:13px;color:#777;"><strong>Duration:</strong> ${block.durationMinutes} min</p>`
            : ""
        }

        ${
          block.poem
            ? `<p style="margin:10px 0 0;font-size:13px;color:#666;font-style:italic;">“${block.poem}”</p>`
            : ""
        }
      </div>
    </div>
  `;
}

export function generateQuizPlanEmail({
  category,
  matchedPlan,
  displayAnswers,
  name,
}) {
  const title = `Your Personalized ${category} Plan`;

  return {
    subject: title,
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>

<body style="margin:0;padding:0;background:#f3f4f6;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  color:#111827;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background:#f3f4f6;padding:30px 0;">
  <tr>
    <td align="center">

      <!-- MAIN CONTAINER -->
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0"
        style="width:640px;max-width:640px;margin:0 auto;border-radius:16px;
        overflow:hidden;background:#ffffff;">

        <!-- HEADER -->
        <tr>
          <td>
            ${premiumHeader(
              `Your Personalized ${category} Plan`,
              "Tailored Insights Based on Your Answers"
            )}
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px;text-align:center;">

            <!-- TITLE -->
            <div style="font-size:20px;font-weight:700;margin-bottom:10px;">
              Your Personalized ${category} Plan
            </div>

            <div style="font-size:14px;color:#6b7280;max-width:520px;margin:0 auto 26px;line-height:1.6;">
              Based on your selections and goals, we created a structured,
              expert-designed plan tailored to your needs.
            </div>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px auto;width:80%;" />

            <!-- PROFILE SUMMARY -->
            <div style="max-width:480px;margin:0 auto 32px;text-align:center;">
              <div style="font-size:16px;font-weight:600;margin-bottom:14px;">
                Profile Summary
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="font-size:14px;line-height:1.6;margin:0 auto;">
                ${Object.entries(displayAnswers || {})
                  .map(
                    ([key, value]) => `
                    <tr>
                      <td style="padding:6px 10px;font-weight:600;color:#374151;text-align:right;width:45%;">
                        ${key}
                      </td>
                      <td style="padding:6px 10px;color:#4b5563;text-align:left;width:55%;">
                        ${value}
                      </td>
                    </tr>`
                  )
                  .join("")}
              </table>
            </div>

            <!-- PLAN STRUCTURE -->
            <div style="max-width:480px;margin:0 auto;text-align:center;">
              <div style="font-size:16px;font-weight:600;margin-bottom:12px;">
                Your Plan Structure
              </div>

              <ul style="list-style-position:inside;padding:0;margin:0;
                font-size:14px;line-height:1.7;color:#374151;text-align:left;">
                ${
                  matchedPlan?.structure && Array.isArray(matchedPlan.structure)
                    ? matchedPlan.structure
                        .map((item) => `<li style="margin-bottom:6px;">${item}</li>`)
                        .join("")
                    : `<li>Your plan structure is not available.</li>`
                }
              </ul>
            </div>

          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td align="center" style="padding:28px 32px 36px;">
            <a href="${appUrl}/premium" style="${CTA_STYLE}">
              View Your Premium Plan
            </a>
          </td>
        </tr>

      </table>

      <!-- FOOTER (CENTERED & SAME WIDTH) -->
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0"
        style="margin:0 auto;">
        <tr>
          <td>
            ${emailFooter()}
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>
`,
  };
}


export function generateMainQuizEmail({
  slug,
  matchedTitle,
  matchedDescription,
  matchedValues,
  answers,
  name,
  updatedAt,
}) {
  const properTitle = matchedTitle || "Your Personalized Wellness Insights";

  return {
    subject: properTitle,
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>

<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:30px 0;">
  <tr>
    <td align="center">

      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;margin:0 auto;border-radius:16px;overflow:hidden;background:#ffffff;">

        <!-- PREMIUM HEADER -->
        <tr>
          <td style="padding:0;margin:0;">
            ${premiumHeader(
              properTitle,
              "Insights Based on Your Wellness Quiz"
            )}
          </td>
        </tr>

        <!-- MAIN BODY -->
        <tr>
          <td style="background:#ffffff;padding:32px;font-size:15px;line-height:1.7;color:#111827;box-shadow:0 10px 28px rgba(0,0,0,0.08);">

            <!-- TITLE -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;text-align:center;">
              <tr>
                <td>
                  <div style="font-size:20px;font-weight:700;margin:0;">
                    ${properTitle}
                  </div>
                  ${
                    matchedDescription
                      ? `<div style="font-size:14px;color:#6b7280;margin-top:8px;line-height:1.6;">
                          ${matchedDescription}
                         </div>`
                      : ""
                  }
                </td>
              </tr>
            </table>
<!-- GREETING BLOCK -->
<div style="margin:20px 0 10px 0;text-align:left;">
  <p style="font-size:15px;color:#444;margin:0;">
    Hello <strong>${name}</strong>,
  </p>

  <p style="font-size:14px;color:#555;margin:6px 0 0 0;">
    <strong>Last updated:</strong> ${updatedAt}
  </p>
</div>

<!-- DIVIDER -->
<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

            <!-- PROFILE SUMMARY -->
            <div style="margin-bottom:26px;">
              <div style="font-size:16px;font-weight:600;margin-bottom:12px;">
                Your Selections
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.6;">
                ${Object.entries(answers || {})
                  .map(
                    ([key, value]) => `
                    <tr>
                      <td style="padding:6px 0;font-weight:600;color:#374151;width:160px;">
                        ${key}
                      </td>
                      <td style="padding:6px 0;color:#4b5563;">
                        ${value}
                      </td>
                    </tr>`
                  )
                  .join("")}
              </table>
            </div>

            <!-- INSIGHTS LIST -->
            <div>
              <div style="font-size:16px;font-weight:600;margin-bottom:10px;">
                Your Personalized Insights
              </div>

              <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#374151;">
                ${
                  matchedValues?.map((item) => `<li>${item}</li>`).join("") ||
                  ""
                }
              </ul>
            </div>

          </td>
        </tr>

        <!-- CTA BUTTON -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align:center;margin:26px 0;">
          <tr>
            <td>
              <a href="${appUrl}/premium" style="${CTA_STYLE}">
                View Full Premium Plan
              </a>
            </td>
          </tr>
        </table>

      </table>

      ${emailFooter()}

    </td>
  </tr>
</table>

</body>
</html>

`,
  };
}

export function createWeeklyPlanEmail({
  name,
  email,
  updatedAt,
  userPlan,
  planData,
  appUrl,
}) {
  const subject = "Your Weekly Wellness Plan";
  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const content = `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;padding:0;background:#f4f4f7;">
  <tr>
    <td align="center">

      <!-- FIXED EMAIL WIDTH WRAPPER -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td>
            ${premiumHeader(
              "Your Weekly Wellness Plan",
              "Personalized Guidance for a Balanced Week"
            )}
          </td>
        </tr>

        <!-- SUMMARY CARD (TABLE-BASED) -->
        <tr>
          <td style="padding:0 20px 0 20px;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0" 
              style="border:1px solid #e9e7f7;border-radius:18px;background:#ffffff;">
              <tr>
                <td style="padding:26px;font-family:Arial,Helvetica,sans-serif;">

                  <p style="font-size:15px;color:#444444;margin:0 0 6px 0;">
                    Hello <strong>${name}</strong>,
                  </p>

                  <p style="font-size:13px;color:#777777;margin:0;">
                    <strong>Updated:</strong> ${formattedUpdatedAt}
                  </p>

                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- WEEK PLAN -->
        <tr>
          <td style="padding:0 20px 0 20px;">

            <!-- TWO COLUMN LAYOUT -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>

                <!-- LEFT COLUMN -->
                <td valign="top" width="50%" style="padding-right:12px;">

                  ${planData
                    .slice(0, 3)
                    .map((d, idx) => {
                      const pastelColors = ["#fff7f0", "#f8f2ff", "#f0faff"];
                      const dayBg = pastelColors[idx % pastelColors.length];

                      return `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
                      style="background:${dayBg};border-radius:18px;border:1px solid #e8e6f9;margin-bottom:28px;">
                      <tr>
                        <td style="padding:26px;font-family:Arial,Helvetica,sans-serif;">

                          <!-- DAY TITLE -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0"
                            style="background:#ffffff;border:1px solid #e3defb;border-radius:12px;margin-bottom:14px;">
                            <tr>
                              <td style="
                                padding:10px 14px;
                                font-size:16px;
                                font-weight:700;
                                color:#4e46d2;
                                text-transform:capitalize;">
                                ${d.day}
                              </td>
                            </tr>
                          </table>

                          <!-- DAY CONTENT -->
                          ${Object.entries(d)
                            .filter(([k]) => k !== "day")
                            .map(([k, v]) => {
                              const tone = k.toLowerCase().includes("mood")
                                ? "#eef2ff"
                                : k.toLowerCase().includes("fitness")
                                ? "#e9f7ff"
                                : k.toLowerCase().includes("nourish")
                                ? "#f6fff2"
                                : "#ffffff";

                              return `
                              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background:${tone};border-radius:12px;border:1px solid #e3e3f0;margin-bottom:10px;">
                                <tr>
                                  <td style="padding:12px;font-size:13px;color:#4a4a4a;">
                                    <strong style="color:#2d2a94;">${k}:</strong><br/>
                                    ${
                                      typeof v === "object"
                                        ? Object.entries(v)
                                            .map(([a, b]) => `${a}: ${b}`)
                                            .join("<br>")
                                        : v
                                    }
                                  </td>
                                </tr>
                              </table>`;
                            })
                            .join("")}

                        </td>
                      </tr>
                    </table>
                    `;
                    })
                    .join("")}

                </td>

                <!-- RIGHT COLUMN -->
                <td valign="top" width="50%" style="padding-left:12px;">

                  ${planData
                    .slice(3)
                    .map((d, idx) => {
                      const pastelColors = ["#fff0f8", "#f0fff8", "#fffaf0"];
                      const dayBg = pastelColors[idx % pastelColors.length];

                      return `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
                      style="background:${dayBg};border-radius:18px;border:1px solid #e8e6f9;margin-bottom:28px;">
                      <tr>
                        <td style="padding:26px;font-family:Arial,Helvetica,sans-serif;">

                          <!-- DAY TITLE -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0"
                            style="background:#ffffff;border:1px solid #e3defb;border-radius:12px;margin-bottom:14px;">
                            <tr>
                              <td style="
                                padding:10px 14px;
                                font-size:16px;
                                font-weight:700;
                                color:#4e46d2;
                                text-transform:capitalize;">
                                ${d.day}
                              </td>
                            </tr>
                          </table>

                          <!-- DAY CONTENT -->
                          ${Object.entries(d)
                            .filter(([k]) => k !== "day")
                            .map(([k, v]) => {
                              const tone = k.toLowerCase().includes("mood")
                                ? "#eef2ff"
                                : k.toLowerCase().includes("fitness")
                                ? "#e9f7ff"
                                : k.toLowerCase().includes("nourish")
                                ? "#f6fff2"
                                : "#ffffff";

                              return `
                              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background:${tone};border-radius:12px;border:1px solid #e3e3f0;margin-bottom:10px;">
                                <tr>
                                  <td style="padding:12px;font-size:13px;color:#4a4a4a;">
                                    <strong style="color:#2d2a94;">${k}:</strong><br/>
                                    ${
                                      typeof v === "object"
                                        ? Object.entries(v)
                                            .map(([a, b]) => `${a}: ${b}`)
                                            .join("<br>")
                                        : v
                                    }
                                  </td>
                                </tr>
                              </table>`;
                            })
                            .join("")}

                        </td>
                      </tr>
                    </table>
                    `;
                    })
                    .join("")}

                </td>

              </tr>
            </table>

          </td>
        </tr>

        <!-- CTA BUTTON -->
        <tr>
          <td style="padding:10px 20px 40px 20px;text-align:center;">
            <a href="${appUrl}/premium" style="${CTA_STYLE}">
              Go to your Premium plan →
            </a>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

`;

  return {
    subject,
    body: content + emailFooter(),
  };
}
