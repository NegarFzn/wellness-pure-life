import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DailyRitual from "../../../components/DailyRitual";
import MultiStartQuiz from "../../../components/Quiz/QuizPlan/1_StartQuiz";
import classes from "./index.module.css";

export default function QuizMainPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // ✅ MODAL STATE
  const [activeQuiz, setActiveQuiz] = useState(null);
  const closeQuizModal = () => setActiveQuiz(null);

  const categories = [
    { label: "All", value: "all", icon: "🌍" },
    { label: "Fitness", value: "fitness", icon: "🏋️‍♀️" },
    { label: "Mindfulness", value: "mindfulness", icon: "🧠" },
    { label: "Nutrition", value: "nutrition", icon: "🥗" },
    { label: "Stress", value: "stress-check", icon: "😌" },
    { label: "Balance", value: "life-balance", icon: "⚖️" },
  ];

  useEffect(() => {
    fetch("/api/quiz/quiz-main?mode=questions")
      .then((res) => res.json())
      .then((data) => {
        const normalizeCategory = (cat) => {
          if (!cat) return "";
          if (cat === "nourish") return "nutrition";
          return cat.toLowerCase();
        };

        const quizzes = Array.isArray(data)
          ? data.map((q) => ({
              title: q.title || q.slug,
              slug: q.slug,
              category: normalizeCategory(q.category),
            }))
          : [];

        setQuizzes(quizzes);
      })
      .catch((err) => {
        console.error("❌ Failed to load quizzes:", err);
        setQuizzes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getIconForSlug = (slug) => {
    const lower = slug.toLowerCase();
    if (lower.includes("mind")) return "🧠";
    if (lower.includes("fitness")) return "🏋️‍♀️";
    if (lower.includes("nutrition")) return "🥗";
    if (lower.includes("stress")) return "😌";
    if (lower.includes("balance")) return "⚖️";
    return "📊";
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (activeCategory === "stress-check") return quiz.slug === "stress-check";
    if (activeCategory === "life-balance") return quiz.slug === "life-balance";

    const categoryMatch =
      activeCategory === "all" ||
      quiz.category === activeCategory.toLowerCase();

    const titleMatch = (quiz.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return categoryMatch && titleMatch;
  });

  const showClear = searchTerm || activeCategory !== "all";

  return (
    <>
      <Head>
        <title>All Wellness Quizzes | Wellness Pure Life</title>
        <meta
          name="description"
          content="Browse all wellness quizzes on fitness, mindfulness, nutrition, stress and balance. Discover insights tailored to your lifestyle."
        />
        <link
          rel="canonical"
          href="https://wellnesspurelife.com/quizzes/quiz-main"
        />
      </Head>

      <div className={classes.container}>
        {/* ✅ BLOCK 1 — PREMIUM ENGINE HERO */}
        <section className={classes.premiumHero}>
          <h1>Your Personalized AI Wellness System</h1>
          <p>
            Build your weekly wellness plan, daily rituals, and long-term
            balance based on your real lifestyle.
          </p>

          <div className={classes.heroButtons}>
            <Link href="/plan/weekly-plan" className={classes.primaryCta}>
              Build My Weekly Plan
            </Link>

            <Link href="/sample/weekly-plan" className={classes.secondaryCta}>
              View Sample Plan
            </Link>
          </div>
        </section>

        {/* ✅ BLOCK 2 — FREE QUIZ DISCOVERY */}
        <h2 className={classes.heading}>Explore Your Wellness Profile</h2>

        <div className={classes.stickyBar}>
          <input
            type="text"
            placeholder="Search quizzes..."
            className={classes.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={classes.categoryBar}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`${classes.categoryButton} ${
                  activeCategory === cat.value ? classes.active : ""
                }`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <span className={classes.categoryIcon}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {searchTerm && (
          <p className={classes.searchHighlight}>
            🔍 Searching for: <strong>{searchTerm}</strong>
          </p>
        )}

        {loading ? (
          <p className={classes.loading}>⏳ Loading quizzes...</p>
        ) : filteredQuizzes.length === 0 ? (
          <>
            <p className={classes.emptyMessage}>
              😕 No quizzes match your search or category.
            </p>
            {showClear && (
              <button
                className={classes.clearFilters}
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
              >
                🔄 Clear Filters
              </button>
            )}
          </>
        ) : (
          <>
            <ul className={classes.quizList}>
              {filteredQuizzes.map((quiz) => (
                <li className={classes.quizItem} key={quiz.slug}>
                  <Link
                    href={`/quizzes/quiz-main/${quiz.slug}`}
                    className={classes.quizLink}
                  >
                    <span className={classes.icon}>
                      {getIconForSlug(quiz.slug)}
                    </span>
                    <span className={classes.quizTitle}>{quiz.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ✅ BLOCK 3 — PLAN BRIDGE (MODAL-BASED) */}
        <section className={classes.planBridgePremium}>
          <p className={classes.planBridgeTitle}>
            💡 Want to improve your wellness? Retake any plan quiz below:
          </p>

          <div className={classes.planButtonsRow}>
            <button
              className={classes.planButtonFitness}
              onClick={() => setActiveQuiz("fitness")}
            >
              💪 Fitness Plan
            </button>

            <button
              className={classes.planButtonMind}
              onClick={() => setActiveQuiz("mindfulness")}
            >
              🧘 Mindfulness Plan
            </button>
          </div>

          <div className={classes.planButtonsRowSingle}>
            <button
              className={classes.planButtonNourish}
              onClick={() => setActiveQuiz("nourish")}
            >
              🥗 Nourish Plan
            </button>
          </div>
        </section>
        {/* ✅ BLOCK 4 — DAILY RITUAL (REAL COMPONENT, PREMIUM-AWARE) */}
        <section className={classes.dailyRitualWrapper}>
          <h3 className={classes.dailyRitualTitle}>Your Daily Ritual System</h3>

          <DailyRitual isPremium={user?.isPremium} />
        </section>

        {/* ✅ BLOCK 5 — BLOG SUPPORT */}
        <section className={classes.blogSupport}>
          <p>Want to learn while deciding?</p>

          <Link href="/blog" className={classes.textLink}>
            Explore Wellness Guides →
          </Link>
        </section>

        {/* ✅ ✅ PLAN QUIZ MODAL */}
        {activeQuiz && (
          <div
            className={classes.modalOverlay}
            onClick={() => closeQuizModal()}
          >
            <div
              className={classes.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={classes.closeModal}
                onClick={() => closeQuizModal()}
              >
                ❌
              </button>

              <MultiStartQuiz slug={`${activeQuiz}-plan`} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
