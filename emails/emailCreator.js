import { emailTemplate } from "./templates";
import { marked } from "marked";

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

export function createWelcomeEmail(name) {
  const subject = "Welcome to Wellness Pure Life";

  const preheader =
    "Your personalized wellness space is ready — begin your journey today.";

  const content = `

    <!-- INTRO TEXT -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
        <p style="
          margin:0 0 14px 0;
          font-size:15px;
          color:#374151;
          line-height:1.7;
        ">
          Welcome to <strong>Wellness Pure Life</strong> — your new space for balance, clarity, and a healthier daily rhythm.
        </p>

        <p style="
          margin:0 0 18px 0;
          font-size:15px;
          color:#374151;
          line-height:1.7;
        ">
          You can now explore personalized rituals, nourishing habits, and practical guidance designed to support your well-being from the inside out.
        </p>

        <p style="
          margin:0 0 8px 0;
          font-size:14px;
          color:#6B7280;
          line-height:1.65;
        ">
          If you want the full structured system (sleep reset, stress reset, weekly plan, Daily Rituals Pro, and more), Premium is where everything comes together.
        </p>
      </td>
    </tr>
  </table>

    <!-- PREMIUM FEATURES CARD (email-safe, matches Premium page style) -->
<!-- PREMIUM FEATURES CARD (all boxes clickable) -->
<table width="100%" cellpadding="0" cellspacing="0" border="0"
  style="margin-top:18px;border-collapse:separate;border-spacing:0;">
  <tr>
    <td style="
      background-color:#FFF5FA;
      background: linear-gradient(135deg, #FFE4F1 0%, #FFD6E8 45%, #FFEAF4 100%);
      border:1px solid #FBCFE8;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 10px 26px rgba(17,24,39,0.08);
    ">

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:18px 20px 10px; font-family:Arial,Helvetica,sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
              <tr>
                <td style="
                  background:#FFFFFF;
                  border:1px solid rgba(236,72,153,0.25);
                  color:#BE185D;
                  font-size:11px;
                  font-weight:900;
                  letter-spacing:0.6px;
                  padding:6px 10px;
                  border-radius:999px;
                ">
                  PREMIUM MEMBERSHIP
                </td>
              </tr>
            </table>

            <div style="height:10px; line-height:10px; font-size:10px;">&nbsp;</div>

            <p style="
              margin:0;
              font-size:20px;
              line-height:1.25;
              font-weight:900;
              color:#111827;
              letter-spacing:-0.2px;
            ">
              <a href="https://wellnesspurelife.com/premium"
                 target="_blank" rel="noopener"
                 style="color:#111827; text-decoration:none;">
                What’s Inside Wellness Pure Life Pro
              </a>
            </p>

            <p style="
              margin:8px 0 0;
              font-size:14px;
              line-height:1.6;
              color:#374151;
            ">
              A structured, science-based system to support your sleep, stress, energy, and confidence—every day.
            </p>
          </td>
        </tr>
      </table>

      <!-- Feature grid -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:14px 20px 18px; font-family:Arial,Helvetica,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;">
              <tr>
                <!-- Left column -->
                <td valign="top" width="50%" style="padding-right:8px;">

                  <!-- Daily Rituals Pro (clickable) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:#FFFFFF;border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
                    <tr>
                      <td style="padding:0;">
                        <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                           style="display:block; padding:12px 12px 10px; text-decoration:none;">
                          <p style="margin:0;font-size:13px;font-weight:900;color:#9D174D;">
                            Daily Rituals Pro
                          </p>
                          <p style="margin:6px 0 0;font-size:13px;line-height:1.55;color:#374151;">
                            Morning, midday, and evening rituals for clarity, calm, and steady energy.
                          </p>
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="height:10px; line-height:10px; font-size:10px;">&nbsp;</div>

                  <!-- Weekly Wellness Plan (clickable) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:#FFFFFF;border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
                    <tr>
                      <td style="padding:0;">
                        <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                           style="display:block; padding:12px 12px 10px; text-decoration:none;">
                          <p style="margin:0;font-size:13px;font-weight:900;color:#9D174D;">
                            Weekly Wellness Plan
                          </p>
                          <p style="margin:6px 0 0;font-size:13px;line-height:1.55;color:#374151;">
                            A 7-day structure based on your needs—movement, recovery, and focus.
                          </p>
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="height:10px; line-height:10px; font-size:10px;">&nbsp;</div>

                  <!-- Easy Nutrition Structure (clickable) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:#FFFFFF;border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
                    <tr>
                      <td style="padding:0;">
                        <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                           style="display:block; padding:12px 12px 10px; text-decoration:none;">
                          <p style="margin:0;font-size:13px;font-weight:900;color:#9D174D;">
                            Easy Nutrition Structure
                          </p>
                          <p style="margin:6px 0 0;font-size:13px;line-height:1.55;color:#374151;">
                            Simple meal guidance, hydration habits, and smart snack ideas.
                          </p>
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>

                <!-- Right column -->
                <td valign="top" width="50%" style="padding-left:8px;">

                  <!-- Sleep Reset (clickable) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:#FFFFFF;border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
                    <tr>
                      <td style="padding:0;">
                        <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                           style="display:block; padding:12px 12px 10px; text-decoration:none;">
                          <p style="margin:0;font-size:13px;font-weight:900;color:#9D174D;">
                            Sleep Reset
                          </p>
                          <p style="margin:6px 0 0;font-size:13px;line-height:1.55;color:#374151;">
                            Fall asleep faster, wake up less, and restore deeper sleep.
                          </p>
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="height:10px; line-height:10px; font-size:10px;">&nbsp;</div>

                  <!-- Stress Reset (clickable) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:#FFFFFF;border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
                    <tr>
                      <td style="padding:0;">
                        <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                           style="display:block; padding:12px 12px 10px; text-decoration:none;">
                          <p style="margin:0;font-size:13px;font-weight:900;color:#9D174D;">
                            Stress Reset
                          </p>
                          <p style="margin:6px 0 0;font-size:13px;line-height:1.55;color:#374151;">
                            Calm emotional overload, reduce tension, and feel grounded.
                          </p>
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="height:10px; line-height:10px; font-size:10px;">&nbsp;</div>

                  <!-- AI Wellness Coach + Tracking (clickable) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:#FFFFFF;border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
                    <tr>
                      <td style="padding:0;">
                        <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                           style="display:block; padding:12px 12px 10px; text-decoration:none;">
                          <p style="margin:0;font-size:13px;font-weight:900;color:#9D174D;">
                            AI Wellness Coach + Tracking
                          </p>
                          <p style="margin:6px 0 0;font-size:13px;line-height:1.55;color:#374151;">
                            Instant guidance plus habit & progress tracking to stay consistent.
                          </p>
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>

            <!-- Bottom check list (clickable container) -->
            <div style="height:14px; line-height:14px; font-size:14px;">&nbsp;</div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:rgba(255,255,255,0.75);border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
              <tr>
                <td style="padding:0;">
                  <a href="https://wellnesspurelife.com/premium" target="_blank" rel="noopener"
                     style="display:block; padding:12px 14px; text-decoration:none;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                      <tr>
                        <td valign="top" width="20" style="font-size:14px;font-weight:900;color:#10B981;line-height:1.2;">✓</td>
                        <td style="font-size:13px;line-height:1.55;color:#374151;">
                          Premium workouts (strength, mobility, low-impact) built for real life
                        </td>
                      </tr>
                      <tr><td colspan="2" style="height:8px;line-height:8px;font-size:8px;">&nbsp;</td></tr>
                      <tr>
                        <td valign="top" width="20" style="font-size:14px;font-weight:900;color:#10B981;line-height:1.2;">✓</td>
                        <td style="font-size:13px;line-height:1.55;color:#374151;">
                          Premium articles for long-term understanding and sustainable growth
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>



     <!-- SPACER (table-based) -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr><td style="height:22px;line-height:22px;font-size:22px;">&nbsp;</td></tr>
  </table>

  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      preheader,
      showCTA: false,
    }),
  };
}

export function createVerificationEmail(name, email, token) {
  const subject = "Verify Your Wellness Pure Life Account";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wellnesspurelife.com";

  const verificationLink = `${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}`;

  const preheader =
    "Confirm your email to activate your personalized wellness experience.";

  const content = `

    <p style="margin:0 0 14px; font-size:15px; color:#1f2937;">
      You're almost there!
    </p>

    <p style="margin:0 0 20px; font-size:15px; color:#374151; line-height:1.7;">
      Please verify your email to unlock your personalized wellness insights,
      daily routines, premium recommendations, and full access to your Wellness Pure Life experience.
    </p>

    <!-- BUTTON -->
    <div style="text-align:center; margin:30px 0;">
      <a href="${verificationLink}"
        style="
          display:inline-block;
          padding:14px 32px;
          background:#4F46E5;
          color:white;
          text-decoration:none;
          border-radius:12px;
          font-weight:600;
          font-size:15px;
          box-shadow:0 6px 18px rgba(79,70,229,0.28);
        ">
        Verify Your Email
      </a>
    </div>

    <!-- NOTE -->
    <p style="
      margin:22px 0 0;
      font-size:14px;
      color:#6b7280;
      line-height:1.6;
    ">
      If you did not create an account, you can safely ignore this message.
    </p>
  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      preheader,
      showCTA: false,
    }),
  };
}

export function createPasswordResetEmail(name, token) {
  const subject = "Reset Your Password – Wellness Pure Life";

  const preheader =
    "You requested to reset your password. Click the secure link to continue.";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wellnesspurelife.com";

  const resetLink = `${baseUrl}/?resetToken=${token}`;

  const content = `
    <div style="font-size:15px; line-height:1.7; color:#1f2937;">

      <!-- MAIN MESSAGE -->
      <p style="margin:0 0 14px;">
        We received a request to reset your password for your Wellness Pure Life account.
      </p>

      <p style="margin:0 0 14px;">
        If you made this request, you can reset your password securely using the button below:
      </p>

      <!-- RESET BUTTON -->
      <div style="text-align:center; margin:28px 0;">
        <a href="${resetLink}"
          style="
            display:inline-block;
            padding:14px 34px;
            background:#4F46E5;
            color:#ffffff;
            text-decoration:none;
            border-radius:12px;
            font-size:15px;
            font-weight:600;
            box-shadow:0 6px 18px rgba(79,70,229,0.28);
          ">
          Reset Password
        </a>
      </div>

      <!-- FALLBACK LINK -->
      <p style="margin:0 0 20px; font-size:14px; color:#4b5563;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <!-- CLEAN FALLBACK LINK BOX -->
<!-- CLEAN FALLBACK LINK BOX -->
<p style="
  margin:0 0 20px;
  font-size:12px;
  line-height:1.5;
  word-break:break-all;
  background:#F9FAFB;
  border:1px solid #E5E7EB;
  padding:10px 14px;
  border-radius:10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
  color:#374151;
">

  <a href="${resetLink}"
    style="
      color:#1f2937;
      text-decoration:none;
      font-weight:500;
      word-break:break-all;
    ">
    ${resetLink}
  </a>

</p>



      <!-- EXPIRY NOTE -->
      <p style="margin:0 0 14px; font-size:14px; color:#4b5563;">
        This link is valid for <strong>15 minutes</strong>.
      </p>

      <!-- SECURITY NOTE -->
      <p style="margin:26px 0 0; font-size:13px; color:#6b7280;">
        If you did not request a password reset, please ignore this message —
        your account is safe and no changes were made.
      </p>

    </div>
  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      headerSubtitle: "Account Security",
      content,
      name,
      preheader,
      showCTA: false, // must disable premium CTA for security emails
    }),
  };
}

export function createContactEmail(name, email, message) {
  const subject = "New Contact Form Message – Wellness Pure Life";

  const safeMessage = message
    ?.replace(/</g, "&lt;")
    ?.replace(/>/g, "&gt;")
    ?.replace(/\n/g, "<br>");

  const content = `
    <div style="font-size:15px; line-height:1.7; color:#1f2937;">

      <!-- CONTACT DETAILS CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          border-radius:14px;
          margin:0 0 28px 0;
        ">
        <tr>
          <td style="padding:18px 22px;">

            <p style="margin:0 0 10px; font-size:15px;">
              <strong>Name:</strong> ${name}
            </p>

            <p style="margin:0 0 10px; font-size:15px;">
              <strong>Email:</strong>
              <a href="mailto:${email}" style="color:#4F46E5;">
                ${email}
              </a>
            </p>

          </td>
        </tr>
      </table>

      <!-- MESSAGE TITLE -->
      <p style="margin:0 0 8px; font-size:15px; font-weight:600; color:#111827;">
        Message:
      </p>

      <!-- MESSAGE BODY -->
      <div style="
        background:white;
        border:1px solid #e5e7eb;
        border-radius:12px;
        padding:18px 22px;
        font-size:14px;
        color:#374151;
        line-height:1.7;
        white-space:pre-line;
      ">
        ${safeMessage}
      </div>

    </div>
  `;
  console.log(
    "emailTemplate exists:",
    typeof emailTemplate,
    "BODY:",
    emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false,
    })?.length,
  );

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false, // No marketing CTA for admin emails
    }),
  };
}

/* ============================================================
   2. MARKETING EMAILS (Use emailTemplate)
============================================================ */

export function createWeeklySummaryEmail(name, result) {
  const subject = `Your Weekly Wellness Summary: ${result}`;

  const content = `
    <div style="font-size:15px; line-height:1.7; color:#1f2937;">

      <!-- WEEKLY RESULT -->
      <p style="margin:0 0 16px;">
        Your weekly check-in shows that you are currently trending as:
      </p>

      <div style="
        background:#f9fafb;
        padding:16px 20px;
        border-radius:14px;
        border:1px solid #e5e7eb;
        margin-bottom:22px;
        font-size:16px;
        text-align:center;
        font-weight:700;
        color:#4F46E5;
      ">
        ${result}
      </div>

      <!-- INSIGHT TEXT -->
      <p style="margin:0 0 22px;">
        Based on this week’s patterns, here are personalized recommendations to help
        you stay balanced, energized, and aligned:
      </p>

      <!-- SUGGESTIONS CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px;">
        <tr>
          <td style="padding:18px 22px;">

            <ul style="margin:0; padding-left:20px; color:#374151; font-size:14px; line-height:1.7;">
              <li>
                <strong>Mindfulness Support:</strong>
                <br />
                <a href="${appUrl}/mindfulness"
                  style="color:#4F46E5; text-decoration:none;">
                  Explore calming meditation practices
                </a>
              </li>

              <li style="margin-top:12px;">
                <strong>Nourish Your Body:</strong>
                <br />
                <a href="${appUrl}/nourish"
                  style="color:#4F46E5; text-decoration:none;">
                  Balanced meal ideas for steady energy
                </a>
              </li>

              <li style="margin-top:12px;">
                <strong>Fitness Guidance:</strong>
                <br />
                <a href="${appUrl}/fitness"
                  style="color:#4F46E5; text-decoration:none;">
                  Personalized movement recommendations
                </a>
              </li>
            </ul>

          </td>
        </tr>
      </table>

      <!-- CLOSING TEXT -->
      <p style="margin:26px 0 0; font-size:15px; color:#4b5563;">
        Keep showing up for yourself — small steps each day create meaningful change.
      </p>

    </div>
  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false, // Weekly summaries should not include premium CTA unless required
    }),
  };
}

export function create21DaysFitnessChallengeEmail(name, day, challenge) {
  const subject = `Day ${day} – 21 Days of Fitness`;

  const appUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";

  const content = `
    <div style="font-size:15px; line-height:1.7; color:#1f2937; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

      <!-- INTRO -->
      <p style="margin:0 0 22px; font-size:15px; color:#374151;">
        Welcome to <strong>Day ${day}</strong> of your 
        <span style="color:#EF4444; font-weight:600;">21-Day Fitness Challenge</span>.
      </p>

      <!-- FITNESS WORKOUT CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          margin-bottom:26px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
        ">
        <tr>
          <td style="padding:24px 26px;">

            <!-- TITLE -->
            <div style="font-size:18px; font-weight:700; margin-bottom:14px; color:#111827;">
              ${challenge.title}
            </div>

            <!-- CONTENT (Markdown → HTML) -->
            <div style="font-size:15px; color:#374151; margin-bottom:6px;">
              ${marked.parse(challenge.content)}
            </div>

          </td>
        </tr>
      </table>

      <!-- PRO TIP BOX -->
      <div style="
        padding:18px 22px;
        border-left:4px solid #EF4444;
        background:#fff5f5;
        border-radius:8px;
        margin-bottom:32px;
        color:#4B5563;
        font-size:14px;
        box-shadow:0 1px 4px rgba(0,0,0,0.03);
      ">
        <strong style="color:#EF4444; font-size:14px;">Fitness Tip:</strong><br/>
        ${marked.parse(challenge.tip)}
      </div>

      <!-- CTA BUTTON -->
      <div style="text-align:center; margin:32px 0;">
        <a href="${appUrl}/challenges/21-days-fitness/${day}"
          style="
            display:inline-block;
            padding:14px 34px;
            background: linear-gradient(135deg, #F87171 0%, #EF4444 100%);
            color:white;
            text-decoration:none;
            border-radius:10px;
            font-size:15px;
            font-weight:600;
            letter-spacing:0.2px;
            box-shadow:0 4px 18px rgba(239,68,68,0.35);
          ">
          View Day ${day} Online
        </a>
      </div>

    </div>
  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false, // No premium CTA inside challenge emails
    }),
  };
}

export function create21DaysMindfulnessChallengeEmail(name, day, challenge) {
  const subject = `Day ${day} – 21 Days of Mindfulness`;

  const appUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";

  const content = `
    <div style="font-size:15px; line-height:1.7; color:#1f2937; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

      <p style="margin:0 0 22px; font-size:15px; color:#374151;">
        Welcome to <strong>Day ${day}</strong> of your 
        <span style="color:#4F46E5; font-weight:600;">21-Day Mindfulness Journey</span>.
      </p>

      <!-- MAIN CHALLENGE CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          margin-bottom:26px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
        ">
        <tr>
          <td style="padding:24px 26px;">

            <!-- TITLE -->
            <div style="font-size:18px; font-weight:700; margin-bottom:14px; color:#111827;">
              ${challenge.title}
            </div>

            <!-- CONTENT (Markdown converted to HTML) -->
            <div style="font-size:15px; color:#374151; margin-bottom:6px;">
              ${marked.parse(challenge.content)}
            </div>

          </td>
        </tr>
      </table>

      <!-- TIP BOX -->
      <div style="
        padding:18px 22px;
        border-left:4px solid #4F46E5;
        background:#f9f9ff;
        border-radius:8px;
        margin-bottom:32px;
        color:#4B5563;
        font-size:14px;
        box-shadow:0 1px 4px rgba(0,0,0,0.03);
      ">
        <strong style="color:#4F46E5; font-size:14px;">Mindfulness Tip:</strong><br/>
        ${marked.parse(challenge.tip)}
      </div>

      <!-- BUTTON CTA -->
      <div style="text-align:center; margin:32px 0;">
        <a href="${appUrl}/challenges/21-days-mindfulness/${day}"
          style="
            display:inline-block;
            padding:14px 34px;
            background: linear-gradient(135deg,#6366F1 0%,#4F46E5 100%);
            color:white;
            text-decoration:none;
            border-radius:10px;
            font-size:15px;
            font-weight:600;
            letter-spacing:0.2px;
            box-shadow:0 4px 18px rgba(99,102,241,0.35);
          ">
          View Day ${day} Online
        </a>
      </div>

    </div>
  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false,
    }),
  };
}

export function create21DaysNourishChallengeEmail(name, day, challenge) {
  const subject = `Day ${day} – 21 Days of Nourish`;

  const appUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";

  const content = `
    <div style="font-size:15px; line-height:1.7; color:#1f2937; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

      <!-- INTRO -->
      <p style="margin:0 0 22px; font-size:15px; color:#374151;">
        Welcome to <strong>Day ${day}</strong> of your 
        <span style="color:#10B981; font-weight:600;">21-Day Nourish Journey</span>.
      </p>

      <!-- MAIN CONTENT CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          margin-bottom:26px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
        ">
        <tr>
          <td style="padding:24px 26px;">

            <!-- TITLE -->
            <div style="font-size:18px; font-weight:700; margin-bottom:14px; color:#111827;">
              ${challenge.title}
            </div>

            <!-- CONTENT (Markdown converted to HTML) -->
            <div style="font-size:15px; color:#374151; margin-bottom:6px;">
              ${marked.parse(challenge.content)}
            </div>

          </td>
        </tr>
      </table>

      <!-- NOURISH TIP BOX -->
      <div style="
        padding:18px 22px;
        border-left:4px solid #10B981;
        background:#F0FDF4;
        border-radius:8px;
        margin-bottom:32px;
        color:#4B5563;
        font-size:14px;
        box-shadow:0 1px 4px rgba(0,0,0,0.03);
      ">
        <strong style="color:#10B981; font-size:14px;">Nourish Tip:</strong><br/>
        ${marked.parse(challenge.tip)}
      </div>

      <!-- BUTTON CTA -->
      <div style="text-align:center; margin:32px 0;">
        <a href="${appUrl}/challenges/21-days-nourish/${day}"
          style="
            display:inline-block;
            padding:14px 34px;
            background: linear-gradient(135deg,#34D399 0%,#10B981 100%);
            color:white;
            text-decoration:none;
            border-radius:10px;
            font-size:15px;
            font-weight:600;
            letter-spacing:0.2px;
            box-shadow:0 4px 18px rgba(16,185,129,0.35);
          ">
          View Day ${day} Online
        </a>
      </div>

    </div>
  `;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false,
    }),
  };
}

export function createFitnessCompletionEmail(name) {
  const subject =
    "💪 Congratulations! You’ve Completed the 21-Day Fitness Challenge";

  const appUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center"
    style="margin:0; padding:0; background:#f0f6ff;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:650px; width:100%; background:#ffffff; border-radius:20px;">

          <tr>
            <td style="padding:32px 36px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1f2937; font-size:15px; line-height:1.7;">

              <p style="margin:0 0 18px; font-size:16px;">
                <strong>Well done!</strong> You’ve successfully completed the 
                <span style="color:#2563EB; font-weight:600;">21-Day Fitness Challenge</span> 💪
              </p>

              <p style="margin:0 0 20px; color:#374151;">
                Your discipline and consistency have helped you build strength, endurance, and momentum toward a healthier lifestyle.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#f3f8ff; border:1px solid #dbeafe; border-radius:14px; margin:0 0 26px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                <tr>
                  <td style="padding:22px 26px; font-size:15px; color:#1e3a8a;">
                    You completed all <strong>21 days</strong> of workouts — 
                    a huge achievement. Keep this energy going!
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 22px; color:#374151;">
                Your <strong>official fitness certificate</strong> is attached.  
                Celebrate your strength and commitment.
              </p>

              <p style="margin:0 0 32px; color:#374151;">
                Continue training with personalized routines, weekly plans, and guided programs.
              </p>

              <div style="text-align:center; margin:20px 0 32px;">
                <a href="${appUrl}/fitness"
                  style="
                    display:inline-block;
                    padding:14px 32px;
                    background:linear-gradient(135deg,#3B82F6 0%,#2563EB 100%);
                    color:white;
                    text-decoration:none;
                    border-radius:10px;
                    font-size:15px;
                    font-weight:600;
                    box-shadow:0 4px 18px rgba(37,99,235,0.35);
                  ">
                  Continue Your Fitness Journey
                </a>
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
`;

  return {
    subject,
    body: emailTemplate({ title: subject, content, name, showCTA: false }),
  };
}

export function createMindfulnessCompletionEmail(name) {
  const subject =
    "🎉 Congratulations! You’ve Completed the 21-Day Mindfulness Challenge";

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center"
    style="margin:0; padding:0; background:#f8fafc;">
    <tr>
      <td align="center">

        <!-- INNER CONTAINER -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:650px; width:100%; margin:0 auto; background:#ffffff; border-radius:20px;">

          <tr>
            <td style="padding:32px 36px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1f2937; font-size:15px; line-height:1.7;">

              <!-- CELEBRATION MESSAGE -->
              <p style="margin:0 0 18px; font-size:16px;">
                <strong>Congratulations!</strong> You’ve officially completed the 
                <span style="color:#4F46E5; font-weight:600;">21-Day Mindfulness Challenge</span> 🌿
              </p>

              <p style="margin:0 0 20px; color:#374151;">
                Your consistency, presence, and dedication have helped you build healthier emotional patterns,
                clearer awareness, and a more grounded daily rhythm.
              </p>

              <!-- ACHIEVEMENT CARD -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:14px; margin:0 0 26px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                <tr>
                  <td style="padding:22px 26px; font-size:15px; color:#374151;">
                    You completed all <strong>21 days</strong>, and that is something to be proud of.
                    This journey wasn’t about perfection — it was about showing up for yourself.
                  </td>
                </tr>
              </table>

              <!-- CERTIFICATE MESSAGE -->
              <p style="margin:0 0 22px; color:#374151;">
                Your <strong>official completion certificate</strong> is attached to this email. 💚  
                Keep it as a reminder of your dedication to mindfulness and personal growth.
              </p>

              <!-- NEXT STEP INVITE -->
              <p style="margin:0 0 32px; color:#374151;">
                We’re proud of your journey — and excited to support your next steps with new challenges,
                wellness programs, and daily routines made just for you.
              </p>

              <!-- CTA BUTTON -->
              <div style="text-align:center; margin:20px 0 32px;">
                <a href="${appUrl}/mindfulness"
                  style="
                    display:inline-block;
                    padding:14px 32px;
                    background:linear-gradient(135deg,#6366F1 0%,#4F46E5 100%);
                    color:white;
                    text-decoration:none;
                    border-radius:10px;
                    font-size:15px;
                    font-weight:600;
                    letter-spacing:0.2px;
                    box-shadow:0 4px 18px rgba(99,102,241,0.35);
                  ">
                  Continue Your Wellness Journey
                </a>
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
`;

  return {
    subject,
    body: emailTemplate({
      title: subject,
      content,
      name,
      showCTA: false, // no premium CTA for challenge completion
    }),
  };
}

export function createNourishCompletionEmail(name) {
  const subject =
    "🥗 Congratulations! You’ve Completed the 21-Day Nourish Challenge";

  const appUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center"
    style="margin:0; padding:0; background:#ecfdf5;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:650px; width:100%; background:#ffffff; border-radius:20px;">

          <tr>
            <td style="padding:32px 36px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1f2937; font-size:15px; line-height:1.7;">

              <p style="margin:0 0 18px; font-size:16px;">
                <strong>Wonderful work!</strong> You’ve completed the 
                <span style="color:#059669; font-weight:600;">21-Day Nourish Challenge</span> 🥗✨
              </p>

              <p style="margin:0 0 20px; color:#374151;">
                You’ve built healthier eating habits, strengthened your relationship with food,
                and discovered new ways to fuel your energy and wellness.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; margin:0 0 26px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                <tr>
                  <td style="padding:22px 26px; font-size:15px; color:#065f46;">
                    You completed all <strong>21 days</strong> — a beautiful step toward long-term wellness.
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 22px; color:#374151;">
                Your <strong>official Nourish certificate</strong> is attached.  
                Keep it as a reminder of your commitment to your health.
              </p>

              <p style="margin:0 0 32px; color:#374151;">
                Explore new meal plans, recipes, and balanced-eating strategies designed for your lifestyle.
              </p>

              <div style="text-align:center; margin:20px 0 32px;">
                <a href="${appUrl}/nourish"
                  style="
                    display:inline-block;
                    padding:14px 32px;
                    background:linear-gradient(135deg,#34D399 0%,#10B981 100%);
                    color:white;
                    text-decoration:none;
                    border-radius:10px;
                    font-size:15px;
                    font-weight:600;
                    box-shadow:0 4px 18px rgba(16,185,129,0.35);
                  ">
                  Continue Your Nourish Journey
                </a>
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
`;

  return {
    subject,
    body: emailTemplate({ title: subject, content, name, showCTA: false }),
  };
}
