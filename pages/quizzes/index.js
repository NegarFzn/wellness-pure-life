import { useEffect, useState } from "react";
import Link from "next/link";
import classes from "./index.module.css";

export default function QuizzesIndex() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch("/api/quizzes")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((quiz) => quiz.title && quiz.slug);
        const mapped = filtered.map(({ title, slug }) => ({
          title,
          slug,
        }));
        setQuizzes(mapped);
      });
  }, []);

  return (
    <div className={classes.container}>
    <h1 className={classes.heading}>All Quizzes</h1>
    <ul className={classes.quizList}>
      {quizzes.map((quiz) => (
        <li className={classes.quizItem} key={quiz.slug}>
          <Link href={`/quizzes/${quiz.slug}`} className={classes.quizLink}>
            <span className={classes.icon}>
              {quiz.slug.includes("mind") ? "🧠" :
               quiz.slug.includes("fitness") ? "🏋️‍♀️" :
               quiz.slug.includes("nutrition") ? "🥗" :
               quiz.slug.includes("stress") ? "😌" :
               quiz.slug.includes("balance") ? "⚖️" :
               "📊"}
            </span>
            <span className={classes.quizTitle}>{quiz.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  
  );
}
