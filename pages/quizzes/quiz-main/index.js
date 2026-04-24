import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DailyRitual from "../../../components/DailyRitual";
import MultiStartQuiz from "../../../components/Quiz/QuizPlan/1_StartQuiz";
import { gaEvent } from "../../../lib/gtag";
import ResultCTA from "../../../components/UI/ResultCTA";
import classes from "./index.module.css";
import { connectToDatabase } from "../../../utils/mongodb";

export default function QuizMainPage({ initialQuizzes = [] }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [quizzes] = useState(initialQuizzes);
  const [loading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const planTypes = [
    { type: "fitness", label: "💪 Fitness Plan" },
    { type: "mindfulness", label: "🧘 Mindfulness Plan" },
    { type: "nourish", label: "🥗 Nourish Plan" },
  ];

  // VIEW EVENT (NORMAL + ANOMALY)
  useEffect(() => {
    gaEvent("quiz_list_view", { page: "quiz-main" });
    gaEvent("key_quiz_list_view", { page: "quiz-main" });
  }, []);

  // MODAL STATE
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

  // DAILY RITUAL VIEW (NORMAL + ANOMALY)
  useEffect(() => {
    gaEvent("daily_ritual_view", {
      isPremium: user?.isPremium || false,
    });
    gaEvent("key_daily_ritual_view", {
      isPremium: user?.isPremium || false,
    });
  }, [user]);

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
        {/* HERO */}
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

        {/* QUIZ DISCOVERY */}
        <h2 className={classes.heading}>Explore Your Wellness Profile</h2>

        <div className={classes.stickyBar}>
          <input
            type="text"
            placeholder="Search quizzes..."
            className={classes.searchInput}
            value={searchTerm}
            onChange={(e) => {
              const term = e.target.value;

              gaEvent("quiz_search", { term });
              gaEvent("key_quiz_search", { term });

              setSearchTerm(term);
            }}
          />

          <div className={classes.categoryBar}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`${classes.categoryButton} ${
                  activeCategory === cat.value ? classes.active : ""
                }`}
                onClick={() => {
                  gaEvent("quiz_filter_category", {
                    category: cat.value,
                  });
                  gaEvent("key_quiz_filter_category", {
                    category: cat.value,
                  });

                  setActiveCategory(cat.value);
                }}
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
                  gaEvent("quiz_filters_cleared", {
                    from: "quiz-main",
                  });
                  gaEvent("key_quiz_filters_cleared", {
                    from: "quiz-main",
                  });

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
                    onClick={() => {
                      gaEvent("quiz_select", {
                        slug: quiz.slug,
                        title: quiz.title,
                        category: quiz.category,
                      });
                      gaEvent("key_quiz_select", {
                        slug: quiz.slug,
                        title: quiz.title,
                        category: quiz.category,
                      });
                    }}
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

        <ResultCTA
          planTypes={planTypes}
          onOpenModal={(type) => setActiveQuiz(type)}
        />

        {/* DAILY RITUAL */}
        <section className={classes.dailyRitualWrapper}>
          <h3 className={classes.dailyRitualTitle}>Your Daily Ritual System</h3>

          <DailyRitual isPremium={user?.isPremium} />
        </section>

        {/* QUIZ MODAL */}
        {activeQuiz && (
          <div
            className={classes.modalOverlay}
            onClick={() => closeQuizModal()}
          >
            <div
              className={classes.modalContent}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                className={classes.closeModal}
                onClick={() => closeQuizModal()}
              >
                ×
              </button>

              <MultiStartQuiz slug={`${activeQuiz}-plan`} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { db } = await connectToDatabase();
    const data = await db
      .collection("quiz_main_questions")
      .find({}, { projection: { _id: 0, slug: 1, title: 1, category: 1 } })
      .toArray();

    const normalizeCategory = (cat) => {
      if (!cat) return "";
      if (cat === "nourish") return "nutrition";
      return cat.toLowerCase();
    };

    const quizzes = data.map((q) => ({
      title: q.title || q.slug,
      slug: q.slug,
      category: normalizeCategory(q.category),
    }));

    return { props: { initialQuizzes: quizzes } };
  } catch {
    return { props: { initialQuizzes: [] } };
  }
}
