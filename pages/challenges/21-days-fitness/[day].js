import { MongoClient } from "mongodb";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import PremiumButton from "../../../components/PremiumButton/PremiumButton";
import ShareButton from "../../../components/UI/ShareButton";
import ReactMarkdown from "react-markdown";
import classes from "./21-days-fitness.module.css";

export default function FitnessChallenge({ challenge, isInvalidFutureDay }) {
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

  return (
    <>
      <Head>
        <title>
          {currentDay < 21
            ? `Day ${currentDay} – 21 Days of Fitness`
            : "🎉 Congratulations – Challenge Completed!"}
        </title>
        <meta
          name="description"
          content={
            currentDay < 21
              ? `Day ${currentDay}: ${challenge.title}`
              : "You have successfully completed the 21 Days of Fitness Challenge!"
          }
        />
        <meta
          property="og:title"
          content={`Day ${currentDay} – 21 Days of Fitness`}
        />
        <meta property="og:description" content={challenge.title} />
        <meta
          property="og:url"
          content={`https://wellnesspurelife.com/challenge/21-days-fitness/${currentDay}`}
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image"
          content={`/assets/fitness/day-${currentDay}.jpg`}
        />
        <meta
          property="twitter:image"
          content={`/assets/fitness/day-${currentDay}.jpg`}
        />
      </Head>

      <main className={classes.main}>
        {isPremium && (
          <div className={classes.premiumBadge}>🏋️ Premium Access</div>
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
                💡 This is a daily fitness challenge — come back tomorrow to
                unlock the next move!
              </div>
            ) : (
              <div className={classes.lockedBox}>
                <h3 className={classes.lockedTitle}>🔒 Premium Content</h3>
                <p className={classes.lockedMessage}>
                  This day is part of the premium fitness experience.
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
                <strong>Fitness Tip:</strong> {challenge.tip}
              </blockquote>

              {/* Email Button */}
              <button
                className={`${classes.emailButton} ${
                  sending ? classes.loading : ""
                } ${sent ? classes.success : ""}`}
                disabled={sending}
                onClick={async () => {
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
                        category: "fitness", // IMPORTANT
                      }),
                    });

                    const data = await res.json();

                    setSending(false);
                    setSent(true);

                    setToast(data.message || "Email sent!");

                    setTimeout(() => setSent(false), 2000);
                  } catch (err) {
                    console.error(err);
                    setSending(false);
                    setToast("Error sending email.");
                  }
                }}
              >
                {!sending &&
                  !sent &&
                  "📩 Email me this day’s fitness challenge"}
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
                Please login or upgrade to continue your fitness journey.
              </p>
              <PremiumButton />
            </div>
          )
        ) : (
          <div className={classes.congratsBox}>
            <h2>🎉 You did it!</h2>
            <p>
              You’ve completed all 21 days of the Fitness Challenge! Take a
              moment to recognize your commitment to movement, energy, and
              growth.
            </p>
            <p>
              This isn’t the end — fitness is a lifestyle. Stay active, stay
              strong. 💪
            </p>
            <a
              href={`/api/21days-challenge?name=${encodeURIComponent(
                session?.user?.name || "Participant"
              )}&email=${encodeURIComponent(session?.user?.email || "")}`}
              className={classes.certificateButton}
            >
              🎓 Email My Certificate
            </a>
            <Link href="/" className={classes.navLink}>
              Back to Home →
            </Link>
          </div>
        )}

        {currentDay < 21 && (
          <div className={classes.navButtons}>
            {currentDay > 1 && (
              <button
                className={classes.navLink}
                onClick={() =>
                  router.push(`/challenge/21-days-fitness/${currentDay - 1}`)
                }
              >
                ← Previous
              </button>
            )}
            {currentDay < 21 && (
              <button
                className={classes.navLink}
                onClick={() => {
                  const nextDay = currentDay + 1;
                  const today = new Date();
                  const start = new Date(
                    session?.user?.challenge_21_fitness?.startedAt || new Date()
                  );
                  const daysSince = Math.floor(
                    (today - start) / (1000 * 60 * 60 * 24)
                  );
                  const allowed = Math.min(daysSince + 1, 21);

                  if (!isPremium && nextDay > allowed) {
                    setShowPremium(true);
                    return;
                  }
                  router.push(`/challenges/21-days-fitness/${nextDay}`);
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
            onClick={() => window.print()}
          >
            🖨️ Print This Challenge
          </button>
          <ShareButton
            title="I completed the 21 Days of Fitness Challenge!"
            text="I just completed a 21-day fitness journey with Wellness Pure Life. Try it for yourself!"
            url={`https://wellnesspurelife.com${router.asPath}`}
          />
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { day } = context.params;
  const dayNumber = Number.isInteger(Number(day)) ? parseInt(day) : null;

  if (!dayNumber || dayNumber < 1 || dayNumber > 21) {
    return { notFound: true };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  let userStartDate = null;
  if (session?.user?.email) {
    const userRecord = await db
      .collection("users")
      .findOne({ email: session.user.email });
    userStartDate = userRecord?.challenge_21_fitness?.startedAt || new Date();

    if (!userRecord?.challenge_21_fitness?.startedAt) {
      await db.collection("users").updateOne(
        { email: session.user.email },
        {
          $set: {
            "challenge_21_fitness.startedAt": new Date(),
            "challenge_21_fitness.lastEmailSentDay": 0,
          },
        },
        { upsert: true }
      );
    }
  } else {
    userStartDate = new Date();
  }

  const today = new Date();
  const daysSinceStart = Math.floor(
    (today - new Date(userStartDate)) / (1000 * 60 * 60 * 24)
  );
  const allowedDay = Math.min(daysSinceStart + 1, 21);
  const isInvalidFutureDay = dayNumber > allowedDay;

  const collection = db.collection("challenges_21_fitness");
  const challenge = await collection.findOne({ day: dayNumber });
  await client.close();

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
}
