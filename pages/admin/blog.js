import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import BlogEditor from "../../components/Blog/BlogEditor";
import classes from "./AdminBlog.module.css";

// ✅ ADMIN EMAILS
const ADMIN_EMAILS = ["negar@wellnesspurelife.com", "negar.fozooni@gmail.com"];

export default function AdminBlogPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ PROTECT PAGE
  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!ADMIN_EMAILS.includes(session?.user?.email)) {
      router.push("/");
      return;
    }
  }, [sessionStatus, session, router]);

  // ✅ LOAD POSTS
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to load posts");
      setPosts(data);
    } catch (e) {
      console.error("Load posts error:", e);
    }
  };

  useEffect(() => {
    if (ADMIN_EMAILS.includes(session?.user?.email)) {
      fetchPosts();
    }
  }, [session?.user?.email]);

  if (sessionStatus === "loading") return null;
  if (!session || !ADMIN_EMAILS.includes(session?.user?.email)) return null;

  // ✅ SAVE / UPDATE POST
  const handleCreateOrUpdate = async (data) => {
    try {
      setIsSaving(true);
      setStatus(null);

      const method = selectedPost ? "PUT" : "POST";
      const url = "/api/admin/blog";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "blog",
          originalSlug: selectedPost?.slug || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");

      setStatus({
        type: "success",
        message: selectedPost
          ? "Post updated successfully."
          : "Post created successfully.",
      });

      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      console.error("Save error:", err);
      setStatus({
        type: "error",
        message: err.message || "Error saving post.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ DELETE POST
  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;

    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Delete failed");

      setStatus({ type: "success", message: "Post deleted." });

      if (selectedPost?.slug === post.slug) {
        setSelectedPost(null);
      }

      fetchPosts();
    } catch (err) {
      console.error("Delete error:", err);
      setStatus({
        type: "error",
        message: err.message || "Error deleting post.",
      });
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Blog Admin</h1>

      {status && (
        <p
          className={
            status.type === "error"
              ? `${classes.status} ${classes.statusError}`
              : `${classes.status} ${classes.statusSuccess}`
          }
        >
          {status.message}
        </p>
      )}

      {isSaving && <p className={classes.savingText}>Saving…</p>}

      <section className={classes.listSection}>
        <button
          type="button"
          className={classes.newButton}
          onClick={() => setSelectedPost(null)}
        >
          + New Post
        </button>

        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>Title</th>
                <th className={classes.th}>Slug</th>
                <th className={classes.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className={classes.row}>
                  <td className={classes.td}>{post.title}</td>
                  <td className={classes.td}>{post.slug}</td>
                  <td className={`${classes.td} ${classes.actionsCell}`}>
                    <button
                      className={`${classes.actionButton} ${classes.editButton}`}
                      onClick={() => setSelectedPost(post)}
                    >
                      Edit
                    </button>

                    <button
                      className={`${classes.actionButton} ${classes.deleteButton}`}
                      onClick={() => handleDelete(post)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {posts.length === 0 && (
                <tr>
                  <td colSpan="3" className={classes.emptyRow}>
                    No posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ✅ BLOG EDITOR */}
      <BlogEditor
        onSubmit={handleCreateOrUpdate}
        initialPost={selectedPost}
        submitLabel={selectedPost ? "Update Post" : "Publish Post"}
      />
    </div>
  );
}
