/* ============================
   PREMIUM HEADER (REUSABLE)
=============================== */
export function premiumHeader(title = "Wellness Pure Life", subtitle = "") {
  const isDev = process.env.NODE_ENV === "development";

  const appUrl = isDev
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL || "https://wellnesspurelife.com";

  const logoUrl = `${appUrl}/images/logo.png`;

  return `
  <!-- PREMIUM HEADER (GMAIL-SAFE, TABLE-BASED) -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:0 10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:650px;margin:0 auto;border-collapse:collapse;">
          <tr>
            <td align="center"
              style="
                background-color:#5B21B6;
                background: linear-gradient(135deg, #4C1D95 0%, #6D28D9 35%, #7C3AED 70%, #818CF8 100%);
                padding: 38px 22px 28px;
                border-radius: 24px 24px 0 0;
                color: #ffffff;
                font-family: Arial, Helvetica, sans-serif;
                border-bottom: 1px solid rgba(255,255,255,0.18);
              ">

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="max-width:520px;margin:0 auto;border-collapse:collapse;">

                <!-- LOGO + BRAND PILL -->
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    <img
                      src="${logoUrl}"
                      width="76"
                      height="76"
                      alt="Wellness Pure Life"
                      style="
                        display:block;
                        border-radius:18px;
                        box-shadow:0 10px 26px rgba(0,0,0,0.30);
                      "
                    />
                  </td>
                </tr>

                <!-- SMALL BADGE / CATEGORY -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                      <tr>
                        <td
                          style="
                            background: rgba(255,255,255,0.92);
                            color: #4C1D95;
                            font-size: 12px;
                            font-weight: 800;
                            letter-spacing: 0.2px;
                            padding: 7px 14px;
                            border-radius: 999px;
                          ">
                          Premium Wellness
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- TITLE -->
                <tr>
                  <td align="center"
                    style="
                      font-size:30px;
                      font-weight:900;
                      letter-spacing:-0.3px;
                      color:#ffffff;
                      line-height:1.22;
                      padding:0 8px;
                      text-shadow:0 10px 24px rgba(0,0,0,0.18);
                    ">
                    ${title}
                  </td>
                </tr>

                <!-- SUBTITLE -->
                ${
                  subtitle
                    ? `
                <tr>
                  <td align="center"
                    style="
                      font-size:15px;
                      font-weight:400;
                      color:rgba(255,255,255,0.92);
                      line-height:1.6;
                      padding:12px 12px 0;
                    ">
                    ${subtitle}
                  </td>
                </tr>`
                    : ""
                }

                <!-- DIVIDER -->
                <tr>
                  <td align="center" style="padding:18px 0 0;">
                    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="height:2px;width:150px;background:rgba(255,255,255,0.45);border-radius:2px;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- MICRO-COPY -->
                <tr>
                  <td align="center"
                      style="
                        font-size:12px;
                        color:rgba(255,255,255,0.78);
                        line-height:1.5;
                        padding:12px 10px 0;
                      ">
                    Personalized guidance • Premium routines • Member-only tools
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}

/* ============================
   PREMIUM FOOTER (REUSABLE)
=============================== */

function getBaseAppUrl() {
  const isDev = process.env.NODE_ENV === "development";

  return isDev
    ? "http://localhost:3000"
    : (
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        "https://wellnesspurelife.com"
      ).replace(/^http:\/\//, "https://");
}

/* ======================================================
   FOOTER (UNIVERSAL)
====================================================== */
export function emailFooter(userEmail = "") {
  const appUrl = getBaseAppUrl();

  return `
    <div style="
      width:100%;
      padding:32px 0 30px;
      text-align:center;
      font-family:Arial, Helvetica, sans-serif;
      color:#9ca3af;
      font-size:12px;
      line-height:1.6;
    ">

      <div style="margin-bottom:6px;">
        © 2025 <strong>Wellness Pure Life</strong> • All Rights Reserved
      </div>

      <div style="margin-bottom:10px;">
        <a href="mailto:support@wellnesspurelife.com"
          style="color:#6D28D9; text-decoration:none; font-weight:500;">
          support@wellnesspurelife.com
        </a>
      </div>

      ${
        userEmail
          ? `
        <div style="margin-top:6px;">
          <a href="${appUrl}/unsubscribe?email=${encodeURIComponent(userEmail)}"
            style="color:#9ca3af; text-decoration:underline;">
            Unsubscribe
          </a>
        </div>
      `
          : ""
      }

    </div>
  `;
}

/* ============================
   MAIN EMAIL TEMPLATE
=============================== */

export function emailTemplate(input) {
  const isObject = typeof input === "object" && input !== null;

  const title = input?.title ?? "Your Wellness Plan";
  const content = input?.content || "";
  const userName = input?.name || input?.userName || "Member";
  const headerTitle = title;
  const headerSubtitle = input?.headerSubtitle || "";

  const isDev = process.env.NODE_ENV === "development";
  const appUrl = isDev
    ? "http://localhost:3000"
    : (
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        "https://wellnesspurelife.com"
      ).replace(/^http:\/\//, "https://");

  const quizType = isObject?.quizType || "";
  const primaryGoal = isObject?.primaryGoal || "";
  const utm = isObject?.utm || "";
  const showCTA = isObject?.showCTA !== false;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quizPath = quizType ? `/premium/${quizType}` : `/premium`;
  const goalParam = primaryGoal
    ? `&goal=${encodeURIComponent(primaryGoal)}`
    : "";
  const utmParam = utm ? `&utm_campaign=${encodeURIComponent(utm)}` : "";
  const baseUTM = `?utm_source=funnel&utm_medium=email`;
  const ctaUrl = `${appUrl}${quizPath}${baseUTM}${goalParam}${utmParam}`;

  const preheader =
    isObject?.preheader ||
    "Your personalized wellness guidance is ready for you.";

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>

    <!-- DARK MODE SAFE COLORS -->
    <meta name="color-scheme" content="light dark"/>
    <meta name="supported-color-schemes" content="light dark"/>

    <style>
      body, table, td, p, a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      table { border-collapse: collapse; }
      img { border:0; display:block; }
      a { color:#4f46e5; text-decoration:none; }

      body {
        margin:0;
        padding:0;
        background:#f3f4f6;
      }

      /* MOBILE RESPONSIVE */
      @media screen and (max-width:600px) {
        .container { width:100% !important; border-radius:0 !important; }
        .inner-padding { padding:22px 18px !important; }
        h1 { font-size:22px !important; }
      }
    </style>
  </head>

  <body style="margin:0;padding:0;background:#f3f4f6;">
    <!-- PREHEADER (HIDDEN) -->
    <span style="
      display:none;
      font-size:0;
      line-height:0;
      max-height:0;
      max-width:0;
      opacity:0;
      overflow:hidden;
      visibility:hidden;
      mso-hide:all;
    ">
      ${preheader}
    </span>

    <center style="width:100%;padding:32px 12px;">
      <table role="presentation" width="100%">
        <tr>
          <td align="center">

            <!-- OUTER EMAIL CONTAINER -->
            <table role="presentation" width="640" class="container"
              style="
                width:640px;
                max-width:640px;
                background:#ffffff;
                border-radius:24px;
                overflow:hidden;
                box-shadow:0 14px 40px rgba(0,0,0,0.10);
              ">

              <!-- PREMIUM HEADER -->
              <tr>
                <td style="padding:0;">
                ${premiumHeader(headerTitle, headerSubtitle)}

                </td>
              </tr>

              <!-- GREETING SECTION -->
              <tr>
                <td style="padding:32px 32px 0 32px;">
                  <div style="font-size:18px;font-weight:600;color:#111827;">
                   Hello <span style="font-weight:700;">${userName}</span>,

                  </div>

                  <div style="font-size:14px;color:#4b5563;margin-top:6px;margin-bottom:18px;">
                    <strong>Last updated:</strong> ${formattedDate}
                  </div>
                </td>
              </tr>

            

              <!-- DIVIDER -->
              <tr>
                <td style="padding:0 32px;">
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
                </td>
              </tr>

              <!-- MAIN CONTENT -->
              <tr>
                <td class="inner-padding"
                  style="padding:6px 32px 32px;color:#1f2937;font-size:16px;line-height:1.7;">
                  ${content}
                </td>
              </tr>

              <!-- CTA -->
              ${
                showCTA
                  ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:0 0 6px;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
          <tr>
            <td
              align="center"
              bgcolor="#EC4899"
              style="
                border-radius:999px;
                box-shadow:0 12px 28px rgba(236,72,153,0.28);
                background-color:#EC4899;
                background: linear-gradient(90deg, #EC4899 0%, #F472B6 45%, #FB7185 100%);
              "
            >
              <a
                href="${appUrl}/premium"
                target="_blank"
                rel="noopener"
                style="
                  display:inline-block;
                  padding:14px 26px;
                  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                  font-size:14px;
                  font-weight:900;
                  color:#FFFFFF;
                  text-decoration:none;
                  border-radius:999px;
                  letter-spacing:0.2px;
                "
              >
                Explore Premium Membership →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
        font-size:12px;
        color:#6B7280;
        line-height:1.5;
        padding:6px 0 0;
      ">
        Prefer to start free? <a href="${appUrl}" target="_blank" rel="noopener" style="color:#BE185D;font-weight:800;text-decoration:underline;">Open your journey</a>
      </td>
    </tr>
  </table>
              `
                  : ""
              }

              <!-- FOOTER -->
             ${emailFooter()}

            </table>

          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
  `;
}
