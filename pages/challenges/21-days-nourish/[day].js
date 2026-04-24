import { connectToDatabase } from "../../../utils/mongodb";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gaEvent } from "../../../lib/gtag";
import PremiumButton from "../../../components/PremiumButton/PremiumButton";
import ShareButton from "../../../components/UI/ShareButton";
import ReactMarkdown from "react-markdown";
import classes from "./21-days-nourish.module.css";

export default function NourishChallenge({ challenge, isInvalidFutureDay }) {
  const { data: sessionData } = useSession();
  const session = sessionData;
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");
  const [showPremium, setShowPremium] = useState(false);

  const currentDay = challenge.day;
  const progressPercent = (currentDay / 21) * 100;
  const isPremium = session?.user?.isPremium;

  /* ------------------------------- */
  /* PAGE VIEW ANALYTICS            */
  /* ------------------------------- */
  useEffect(() => {
    gaEvent("challenge_page_view", {
      category: "challenge",
      label: `day_${currentDay}`,
    });
    gaEvent("key_challenge_page_view", { day: currentDay });
    gaEvent("challenge_content_view", { day: currentDay });
    gaEvent("key_challenge_content_view", { day: currentDay });
  }, []);

  /* ------------------------------- */
  /* PREMIUM MODAL VIEW ANALYTICS   */
  /* ------------------------------- */
  useEffect(() => {
    if (showPremium) {
      gaEvent("challenge_premium_modal_view", { day: currentDay });
      gaEvent("key_challenge_premium_modal_view", { day: currentDay });
    }
  }, [showPremium]);

  return (
    <>
      <Head>
        <title>
          {currentDay < 21
            ? `Day ${currentDay} – 21 Days of Nourish`
            : "🎉 Congratulations – Challenge Completed!"}
        </title>
        <meta
          name="description"
          content={
            currentDay < 21
              ? `Day ${currentDay}: ${challenge.title}`
              : "You have successfully completed the 21 Days of Nourish Challenge!"
          }
        />
        <meta
          property="og:title"
          content={`Day ${currentDay} – 21 Days of Nourish`}
        />
        <meta property="og:description" content={challenge.title} />
        <meta
          property="og:url"
          content={`https://wellnesspurelife.com/challenges/21-days-nourish/${currentDay}`}
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image"
          content={`/assets/nourish/day-${currentDay}.jpg`}
        />
        <meta
          property="twitter:image"
          content={`/assets/nourish/day-${currentDay}.jpg`}
        />
      </Head>

      <main className={classes.main}>
        {isPremium && (
          <div className={classes.premiumBadge}>🌟 Premium Access</div>
        )}

        <h1 className={classes.title}>
          {currentDay < 21
            ? `Day ${currentDay}: ${challenge.title}`
            : "🎉 Congratulations!"}
        </h1>

        <div className={classes.progressContainer}>
          <div className={classes.progressLabel}>Day {currentDay} of 21</div>
          <div className={classes.progressBar}>
            <div
              className={classes.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {currentDay < 21 ? (
          isInvalidFutureDay ? (
            isPremium ? (
              <div className={classes.dailyNotice}>
                🍎 This is a daily nourish challenge — each day builds on the
                last. Come back tomorrow for your next nourishing step.
              </div>
            ) : (
              <div className={classes.lockedBox}>
                <h3 className={classes.lockedTitle}>🔒 Premium Content</h3>
                <p className={classes.lockedMessage}>
                  This day is part of the premium nourish experience.
                  <br />
                  Please upgrade to continue your journey.
                </p>
                <PremiumButton />
              </div>
            )
          ) : currentDay === 1 || isPremium ? (
            <>
              <ReactMarkdown className={classes.markdown}>
                {challenge.content}
              </ReactMarkdown>

              <blockquote className={classes.tipBox}>
                <strong>Nourish Tip:</strong> {challenge.tip}
              </blockquote>

              {/* EMAIL BUTTON */}
              <button
                className={`${classes.emailButton} ${
                  sending ? classes.loading : ""
                } ${sent ? classes.success : ""}`}
                disabled={sending}
                onClick={async () => {
                  gaEvent("challenge_email_request", {
                    category: "challenge",
                    label: `day_${currentDay}`,
                  });

                  setSending(true);
                  setSent(false);

                  try {
                    const res = await fetch("/api/21days-challenge", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: session?.user?.email,
                        name: session?.user?.name,
                        dayNumber: currentDay,
                        type: "nourish",
                      }),
                    });

                    const data = await res.json();

                    setSending(false);
                    setSent(true);
                    setToast(data.message || "Email sent!");

                    gaEvent("challenge_email_success", { day: currentDay });
                    gaEvent("key_challenge_email_success", { day: currentDay });

                    setTimeout(() => setSent(false), 2000);
                  } catch (err) {
                    setSending(false);
                    setToast("Error sending email.");

                    gaEvent("challenge_email_error", { day: currentDay });
                    gaEvent("key_challenge_email_error", { day: currentDay });
                  }
                }}
              >
                {!sending &&
                  !sent &&
                  "📩 Email me this day’s nourish challenge"}
                {sending && <span className={classes.spinner}></span>}
                {sent && "✔ Sent Successfully"}
              </button>
            </>
          ) : (
            <div className={classes.lockedBox}>
              <h3 className={classes.lockedTitle}>🔒 Premium Content</h3>
              <p className={classes.lockedMessage}>
                Days 2–21 are available for premium members only.
                <br />
                Please login or upgrade to continue your Nourish journey.
              </p>
              <PremiumButton />
            </div>
          )
        ) : (
          <>
            {/* COMPLETION ANALYTICS */}
            {(() => {
              gaEvent("challenge_completed_view", { category: "nourish" });
              gaEvent("key_challenge_completed_view");
            })()}

            <div className={classes.congratsBox}>
              <h2>🎉 You did it!</h2>
              <p>
                You’ve completed the 21 Days of Nourish Challenge! Take a moment
                to appreciate how your body and mind feel.
              </p>

              <a
                href={`/api/21days-challenge?name=${encodeURIComponent(
                  session?.user?.name || "Participant",
                )}&email=${encodeURIComponent(session?.user?.email || "")}`}
                className={classes.certificateButton}
                onClick={() => {
                  gaEvent("challenge_certificate_request");
                  gaEvent("key_challenge_certificate_request");
                }}
              >
                🎓 Email My Certificate
              </a>

              <Link href="/" className={classes.navLink}>
                Back to Home →
              </Link>
            </div>
          </>
        )}

        {currentDay < 21 && (
          <div className={classes.navButtons}>
            {currentDay > 1 && (
              <button
                className={classes.navLink}
                onClick={() => {
                  gaEvent("challenge_previous_day", {
                    category: "challenge",
                    label: `from_day_${currentDay}`,
                  });
                  gaEvent("key_challenge_previous_day", { day: currentDay });

                  router.push(`/challenges/21-days-nourish/${currentDay - 1}`);
                }}
              >
                ← Previous
              </button>
            )}

            {currentDay < 21 && (
              <button
                className={classes.navLink}
                onClick={() => {
                  gaEvent("challenge_next_attempt", {
                    category: "challenge",
                    label: `from_day_${currentDay}`,
                  });
                  gaEvent("key_challenge_next_attempt", { day: currentDay });

                  const nextDay = currentDay + 1;
                  const today = new Date();
                  const start = new Date(
                    session?.user?.challenge_21_nourish?.startedAt ||
                      new Date(),
                  );
                  const daysSince = Math.floor(
                    (today - start) / (1000 * 60 * 60 * 24),
                  );
                  const allowed = Math.min(daysSince + 1, 21);

                  if (!isPremium && nextDay > allowed) {
                    gaEvent("challenge_next_locked", { day: currentDay });
                    gaEvent("key_challenge_next_locked", { day: currentDay });

                    setShowPremium(true);
                    return;
                  }

                  gaEvent("challenge_next_day_success", {
                    from: currentDay,
                    to: nextDay,
                  });
                  gaEvent("key_challenge_next_day_success", {
                    from: currentDay,
                    to: nextDay,
                  });

                  router.push(`/challenges/21-days-nourish/${nextDay}`);
                }}
              >
                Next →
              </button>
            )}
          </div>
        )}

        {showPremium && (
          <div
            className={classes.modalOverlay}
            onClick={() => setShowPremium(false)}
          >
            <div
              className={classes.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={classes.modalClose}
                onClick={() => setShowPremium(false)}
              >
                ×
              </button>
              <h3 className={classes.lockedTitle}>
                🔒 Premium Access Required
              </h3>
              <p className={classes.lockedMessage}>
                To continue to Day 2, please{" "}
                <Link href="/login" className={classes.loginLink}>
                  login
                </Link>{" "}
                and upgrade your account.
              </p>
              <PremiumButton />
            </div>
          </div>
        )}
      </main>

      {currentDay === 21 && (
        <div className={classes.utilityButtons}>
          <button
            className={`${classes.utilityButton} ${classes.secondaryButton}`}
            onClick={() => {
              window.print();
              gaEvent("challenge_print_certificate");
              gaEvent("key_challenge_print_certificate");
            }}
          >
            🖨️ Print This Challenge
          </button>

          <ShareButton
            title="I completed the 21 Days of Nourish Challenge!"
            text="I just completed a 21-day nourishment journey with Wellness Pure Life."
            url={`https://wellnesspurelife.com${router.asPath}`}
          />
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  try {
  const session = await getSession(context);
  const { day } = context.params;
  const dayNumber = Number.isInteger(Number(day)) ? parseInt(day) : null;

  if (!dayNumber || dayNumber < 1 || dayNumber > 21) {
    return { notFound: true };
  }

  const { db } = await connectToDatabase();

  let userStartDate = null;
  if (session?.user?.email) {
    const userRecord = await db
      .collection("users")
      .findOne({ email: session.user.email });

    userStartDate = userRecord?.challenge_21_nourish?.startedAt || new Date();

    if (!userRecord?.challenge_21_nourish?.startedAt) {
      await db.collection("users").updateOne(
        { email: session.user.email },
        {
          $set: {
            "challenge_21_nourish.startedAt": new Date(),
            "challenge_21_nourish.lastEmailSentDay": 0,
          },
        },
        { upsert: true },
      );
    }
  } else {
    userStartDate = new Date();
  }

  const today = new Date();
  const daysSinceStart = Math.floor(
    (today - new Date(userStartDate)) / (1000 * 60 * 60 * 24),
  );
  const allowedDay = Math.min(daysSinceStart + 1, 21);
  const isInvalidFutureDay = dayNumber > allowedDay;

  const collection = db.collection("challenges_21_nourish");
  const challenge = await collection.findOne({ day: dayNumber });

  if (!challenge && dayNumber <= 21) {
    return { notFound: true };
  }

  return {
    props: {
      session,
      challenge: challenge
        ? {
            day: challenge.day,
            title: challenge.title,
            content: challenge.content,
            tip: challenge.tip,
          }
        : { day: 21, title: "Challenge Completed", content: "", tip: "" },
      isInvalidFutureDay,
    },
  };
  } catch {
    return { notFound: true };
  }
}
