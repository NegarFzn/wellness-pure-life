import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import classes from "./index.module.css";

export default function QuizMainPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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
    // Special cases based on slug
    if (activeCategory === "stress-check") {
      return quiz.slug === "stress-check";
    }

    if (activeCategory === "life-balance") {
      return quiz.slug === "life-balance";
    }

    // Normal category filtering
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

        {/* Open Graph for sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content="All Wellness Quizzes | Wellness Pure Life"
        />
        <meta
          property="og:description"
          content="Browse all wellness quizzes on fitness, mindfulness, nutrition, stress and balance. Discover insights tailored to your lifestyle."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/logo.jpg"
        />
        <meta
          property="og:url"
          content="https://wellnesspurelife.com/quizzes/quiz-main"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="All Wellness Quizzes | Wellness Pure Life"
        />
        <meta
          name="twitter:description"
          content="Browse all wellness quizzes on fitness, mindfulness, nutrition, stress and balance. Discover insights tailored to your lifestyle."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/logo.jpg"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://wellnesspurelife.com/quizzes/quiz-main"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <div className={classes.container}>
        <h1 className={classes.heading}>📝 All Quizzes</h1>

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
        )}
      </div>
    </>
  );
}
