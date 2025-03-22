import { useState, useEffect } from "react";
import { fetchNews } from "../utils/fetch";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Modal from "../components/UI/Modal"; // Ensure the correct import path
import classes from "./index.module.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const news = await fetchNews();
      setNewsArticles(news.slice(0, 2)); // get only 2 articles
    };

    getNews();
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowModal(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <>
      <Head>
        <title>Healthy Living - Mind & Body Wellness</title>
        <meta
          name="description"
          content="Achieve a balanced and healthier life with fitness, mindfulness, and nourishing food tips."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      {/* Home Page Content */}
      <main className={classes.container}>
        {newsArticles.length > 0 && (
          <section className={classes.latestNewsSection}>
            <div className={classes.newsGrid}>
              {newsArticles.map((item) => (
                <div key={item.id} className={classes.newsCard}>
                  <img
                    src={
                      item.image && item.image.trim()
                        ? item.image
                        : "/images/defaultNews.jpg"
                    }
                    alt={item.title || "News image"}
                    className={classes.image}
                    width="400"
                    height="250"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/defaultNews.jpg";
                    }}
                  />
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.readMore}
                  >
                    Read More →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
        <h1 className={classes.title}>EXPLORE BY</h1>
        <br />
        <div className={classes.grid}>
          {/* Fitness Section */}
          <Link href="/fitness" className={classes.card}>
            <Image
              src="/images/fitness.jpg"
              alt="People exercising"
              width={400}
              height={250}
              className={classes.image}
              priority
            />
            <h2>Fitness & Exercise</h2>
          </Link>
          {/* Mindfulness Section */}
          <Link href="/mindfulness" className={classes.card}>
            <Image
              src="/images/mindfulness.jpg"
              alt="Person meditating on grass"
              width={400}
              height={250}
              className={classes.image}
              priority
            />
            <h2>Mindfulness & calm</h2>
          </Link>
          {/* Nourish Section */}
          <Link href="/nourish" className={classes.card}>
            <Image
              src="/images/nourish.jpg"
              alt="Healthy food on a table"
              width={400}
              height={250}
              className={classes.image}
              priority
            />
            <h2>Healthy eating</h2>
          </Link>
        </div>
      </main>
    </>
  );
}
