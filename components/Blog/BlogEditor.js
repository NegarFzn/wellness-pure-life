import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import classes from "./BlogEditor.module.css";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function BlogEditor({
  onSubmit,
  initialPost,
  submitLabel = "Publish Post",
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  // ✅ Load values when editing
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || "");
      setSlug(initialPost.slug || "");
      setExcerpt(initialPost.excerpt || "");
      setContent(initialPost.content || "");
      setImage(initialPost.image || "");
      setAutoSlug(false);
    } else {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setImage("");
      setAutoSlug(true);
    }
  }, [initialPost]);

  // ✅ Auto-generate slug
  useEffect(() => {
    if (!autoSlug) return;

    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    setSlug(generated);
  }, [title, autoSlug]);

  // ✅ Quill toolbar
  const modules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  // ✅ Safe slug generator
  const normalizeSlug = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleSave = () => {
    if (!content || content === "<p><br></p>" || content.trim() === "") {
      alert("Content cannot be empty");
      return;
    }

    onSubmit({
      title,
      slug: normalizeSlug(slug),
      excerpt,
      content,
      image,
    });
  };

  return (
    <div className={classes.editorContainer}>
      <h2 className={classes.heading}>
        {initialPost ? "Edit Blog Post" : "Create Blog Post"}
      </h2>

      <div className={classes.field}>
        <label className={classes.label}>Title</label>
        <input
          type="text"
          className={classes.input}
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={classes.field}>
        <label className={classes.label}>Slug</label>
        <input
          type="text"
          className={classes.input}
          placeholder="post-url-slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setAutoSlug(false);
          }}
        />
      </div>

      <div className={classes.field}>
        <label className={classes.label}>Excerpt</label>
        <input
          type="text"
          className={classes.input}
          placeholder="Short SEO description"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      <div className={classes.field}>
        <label className={classes.label}>Featured Image URL</label>
        <input
          type="text"
          className={classes.input}
          placeholder="https://image-link.jpg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className={classes.editorWrap}>
        <label className={classes.label}>Content</label>
        <QuillEditor
          value={content || ""}
          onChange={setContent}
          modules={modules}
          placeholder="Write your article content here..."
        />
      </div>

      <button
        className={classes.saveBtn}
        disabled={!title || !slug || !content || content === "<p><br></p>"}
        onClick={handleSave}
      >
        {submitLabel}
      </button>
    </div>
  );
}
