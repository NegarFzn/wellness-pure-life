import classes from "./news.module.css";

export default function News({ articles }) {
  return (
    <div className={classes.newsPage}>
      <h1 className={classes.newsHeader}>Latest Health & Wellness News</h1>

      <div className={classes.newsContainer}>
        {/* News List */}
        {articles.length > 0 ? (
          <ul className={classes.newsList}>
            {articles.map((article) => (
              <li key={article.id} className={classes.newsItem}>
                <img
                  src={article.image}
                  alt={article.title}
                  className={classes.newsImage}
                />
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className={classes.noNews}>
            <img
              src="/no-news.svg"
              alt="No news"
              className={classes.noNewsImage}
            />
            <h2>No News Available</h2>
            <p>
              There are no new health articles at this moment. Please check back
              later.
            </p>
          </div>
        )}

        {/* Sidebar Ad */}
        <div className={classes.sidebarAd}>
          <p>Advertisement</p>
          <img src="https://via.placeholder.com/300x600" alt="Sidebar Ad" />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?topic=health&&lang=en&token=${process.env.GNEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news data");
    }

    const data = await response.json();
    /* console.log("API Response:", data);
    console.log("API Key:", process.env.GNEWS_API_KEY); */

    const articles = data.articles.map((item, index) => ({
      id: index,
      title: item.title,
      summary: item.description,
      link: item.url,
      image: item.image || "https://via.placeholder.com/150",
    }));

    return { props: { articles } };
  } catch (error) {
    console.error("Error fetching news data:", error.message);
    return { props: { articles: [] } };
  }
}
