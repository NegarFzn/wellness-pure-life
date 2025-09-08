import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import classes from "./feedback.module.css";

const ADMIN_EMAILS = ["negar@wellnesspurelife.com", "negar.fozooni@gmail.com"];

export default function AdminFeedbackPage() {
  const { data: session, status } = useSession();
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [voteType, setVoteType] = useState("all"); // NEW STATE
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0 });

  const isAdmin = session?.user && ADMIN_EMAILS.includes(session.user.email);

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      fetchFeedback();
    }
  }, [status, isAdmin]);

  const fetchFeedback = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (voteType === "positive") queryParams.push("voteType=positive");
      if (voteType === "negative") queryParams.push("voteType=negative");

      const query = queryParams.length ? `?${queryParams.join("&")}` : "";

      const res = await fetch(`/api/admin/feedback${query}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.feedback)) {
        setFeedback(data.feedback);
        setStats(data.summary || { total: 0, positive: 0, negative: 0 });
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError("Failed to fetch feedback.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      ["Page", "Vote", "Comment", "Time"],
      ...feedback.map((f) => [
        f.pageSlug,
        f.isPositive ? "👍" : "👎",
        f.comment?.replace(/\n/g, " ").replace(/\"/g, '"') || "",
        new Date(f.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (status === "loading")
    return <p className={classes.centerText}>Loading session...</p>;
  if (status === "unauthenticated")
    return (
      <p className={`${classes.centerText} ${classes.error}`}>
        🔒 Please login to access this page.
      </p>
    );
  if (!isAdmin)
    return (
      <p className={`${classes.centerText} ${classes.error}`}>
        🚫 You do not have permission to access this admin page.
      </p>
    );

  const countByPage = feedback.reduce((acc, f) => {
    if (!acc[f.pageSlug]) acc[f.pageSlug] = { up: 0, down: 0 };
    if (f.isPositive) acc[f.pageSlug].up += 1;
    else acc[f.pageSlug].down += 1;
    return acc;
  }, {});

  const totalLikes = feedback.filter((f) => f.isPositive).length;
  const totalDislikes = feedback.filter((f) => !f.isPositive).length;
  const totalFeedback = feedback.length;

  return (
    <div className={classes.container}>
      <h1 className={classes.header}>📊 Admin Feedback Dashboard</h1>

      <div className={classes.filterRow}>
        <div className={classes.filterBlock}>
          <label className={classes.label}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={classes.input}
          />
        </div>
        <div className={classes.filterBlock}>
          <label className={classes.label}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={classes.input}
          />
        </div>
        <div className={classes.filterBlock}>
          <label className={classes.label}>Vote Type</label>
          <select
            value={voteType}
            onChange={(e) => setVoteType(e.target.value)}
            className={classes.input}
          >
            <option value="all">All</option>
            <option value="positive">👍 Positive</option>
            <option value="negative">👎 Negative</option>
          </select>
        </div>
        <button
          onClick={fetchFeedback}
          className={classes.button}
          disabled={loading}
        >
          {loading ? "💫 Filtering..." : "🔍 Filter"}
        </button>
      </div>

      {error && <p className={classes.error}>❌ {error}</p>}

      <h2 className={classes.subHeader}>📝 Feedback Entries (with Stats)</h2>

      <button
        onClick={downloadCSV}
        className={`${classes.button} ${classes.mb}`}
      >
        📥 Download CSV
      </button>

      <div className={classes.tableWrapper}>
        <table className={classes.table}>
          <thead className={classes.thead}>
            <tr>
              <th className={classes.th}>#</th>
              <th className={classes.th}>Page</th>
              <th className={classes.th}>Vote</th>
              <th className={classes.th}>Comment</th>
              <th className={classes.th}>Time</th>
              <th className={classes.th}>👍 Likes</th>
              <th className={classes.th}>👎 Dislikes</th>
              <th className={classes.th}>📊 % Positive</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => {
              const { up, down } = countByPage[f.pageSlug] || {
                up: 0,
                down: 0,
              };
              const total = up + down;
              const percent = total ? ((up / total) * 100).toFixed(1) : "0.0";
              return (
                <tr key={i} className={classes.tr}>
                  <td className={classes.td}>{i + 1}</td>
                  <td className={classes.tdSlug}>
                    <a
                      href={`https://wellnesspurelife.com/${f.pageSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                    >
                      {f.pageSlug}
                    </a>
                  </td>
                  <td className={classes.tdCenter}>
                    {f.isPositive ? "👍" : "👎"}
                  </td>
                  <td className={classes.td}>{f.comment || "-"}</td>
                  <td className={classes.td}>
                    {new Date(f.createdAt).toLocaleString()}
                  </td>
                  <td className={classes.tdCenter}>{up}</td>
                  <td className={classes.tdCenter}>{down}</td>
                  <td className={classes.tdCenter}>{percent}%</td>
                </tr>
              );
            })}
            <tr className={`${classes.tr} ${classes.totalRow}`}>
              <td className={classes.td}>TOTAL</td>
              <td colSpan={4} className={classes.totalStatsCell}>
                ({stats.total} |{" "}
                <span className={classes.positive}>👍 {stats.positive}</span> |{" "}
                <span className={classes.negative}>👎 {stats.negative}</span>)
              </td>
              <td className={classes.tdCenter}>{totalLikes}</td>
              <td className={classes.tdCenter}>{totalDislikes}</td>
              <td className={classes.tdCenter}>
                {totalFeedback
                  ? ((totalLikes / totalFeedback) * 100).toFixed(1) + "%"
                  : "0.0%"}
              </td>
            </tr>
          </tbody>
        </table>

        {feedback.length === 0 && !loading && (
          <p className={classes.noData}>
            📭 No feedback found for this date range and filter.
          </p>
        )}
      </div>
    </div>
  );
}
