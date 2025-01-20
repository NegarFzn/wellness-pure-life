import classes from "./news.module.css";

export default function News({ articles }) {
  return (
    <div className={classes.newsPage}>
      <h1 className={classes.newsHeader}>Latest Health News</h1>
      {articles.length > 0 ? (
        <ul className={classes.newsList}>
          {articles.map((article) => (
            <li key={article.id}>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available at the moment.</p>
      )}
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
    }));

    return { props: { articles } };
  } catch (error) {
    console.error("Error fetching news data:", error.message);
    return { props: { articles: [] } };
  }
}
