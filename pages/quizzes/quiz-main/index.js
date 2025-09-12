import { useEffect, useState } from "react";
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
        const quizzes = Array.isArray(data)
          ? data.map((q) => ({
              title: q.title || q.slug,
              slug: q.slug,
              category: q.category || q.slug, // ✅ Include category for filtering
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
    const categoryMatch =
      activeCategory === "all" ||
      (quiz.category &&
        quiz.category.toLowerCase() === activeCategory.toLowerCase());

    const titleMatch = (quiz.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return categoryMatch && titleMatch;
  });

  const showClear = searchTerm || activeCategory !== "all";

  return (
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
  );
}
