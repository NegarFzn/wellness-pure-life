import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import classes from "./Step.module.css";

export default function MultiSummaryStep({ onBack, onNext, answers, slug}) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    fitnessLevel,
    activityPreference,
    timeCommitment,
    challenges = "", // single value, not array
  } = answers;

  const [labelMap, setLabelMap] = useState({});

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();
        const quiz = data.find((q) => q.slug === "fitness-plan");

        const map = {};
        quiz?.questions?.forEach((q) => {
          q.options.forEach((opt) => {
            map[opt.value] = opt.label;
          });
        });

        setLabelMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch label map:", err);
      }
    };

    fetchLabels();
  }, []);

  const formatLabel = (val) => {
    return labelMap[val] || val;
  };

  const handleGeneratePlan = async () => {
    try {
      console.log("Submitting plan:", answers);

      localStorage.setItem("fitness_plan_answers", JSON.stringify(answers));

      if (session?.user?.email) {
        const response = await fetch("/api/quiz/quiz-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: "fitness-plan",
            answers,
            category: "fitness",
             email: session.user.email,
          }),
        });

        const text = await response.text();
        console.log("API response:", response.status, text);

        if (!response.ok) throw new Error(text);
      }

      router.push(`/quizzes/quiz-plan/${slug}`);
    } catch (err) {
      console.error("Error saving plan:", err.message || err);
      alert("Something went wrong while generating your plan.");
    }
  };

  return (
    <div className={classes.stepContainer}>
      <h2 className={classes.heading}>Review Your Fitness Plan Summary</h2>
      <p className={classes.subheading}>Here’s what you’ve shared with us:</p>

      <ul className={classes.summaryList}>
        <li>
          <strong>Fitness Level:</strong> {formatLabel(fitnessLevel)}
        </li>
        <li>
          <strong>Preferred Activity:</strong> {formatLabel(activityPreference)}
        </li>
        <li>
          <strong>Time Commitment:</strong> {formatLabel(timeCommitment)}
        </li>
        <li>
          <strong>Challenge:</strong>{" "}
          {challenges ? formatLabel(challenges) : "None"}
        </li>
      </ul>

      <div className={classes.navigation}>
        <button onClick={onBack} className={classes.button}>
          Back
        </button>
        <button onClick={handleGeneratePlan} className={classes.button}>
          Generate My Plan →
        </button>
      </div>
    </div>
  );
}
