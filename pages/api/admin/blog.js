import { connectToDatabase } from "../../../utils/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = ["negar@wellnesspurelife.com", "negar.fozooni@gmail.com"];

export default async function handler(req, res) {
  const { method } = req;

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { db } = await connectToDatabase();

    // ✅ Normalizer
    const normalizeSlug = (text = "") =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

    /* =======================
       CREATE POST
    ======================= */
    if (method === "POST") {
      const { title, slug, excerpt, content, image } = req.body;

      const finalSlug = normalizeSlug(slug || title);

      if (!title || !finalSlug) {
        return res.status(400).json({ error: "Title and slug are required" });
      }

      if (!content || content === "<p><br></p>") {
        return res.status(400).json({ error: "Content cannot be empty" });
      }

      const exists = await db
        .collection("blog_posts")
        .findOne({ slug: finalSlug });

      if (exists) {
        return res.status(409).json({ error: "Slug already exists" });
      }

      const result = await db.collection("blog_posts").insertOne({
        type: "blog",
        title,
        slug: finalSlug,
        excerpt: excerpt || "",
        content,
        image: image || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).json({
        message: "Post created",
        id: result.insertedId,
        slug: finalSlug,
      });
    }

    /* =======================
       UPDATE POST
    ======================= */
    if (method === "PUT") {
      const { title, excerpt, content, image, slug, originalSlug } = req.body;

      const finalSlug = normalizeSlug(slug || originalSlug);

      if (!finalSlug) {
        return res.status(400).json({ error: "Slug missing" });
      }

      const update = {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(image !== undefined && { image }),
        ...(content !== undefined && { content }),
        updatedAt: new Date(),
      };

      const result = await db
        .collection("blog_posts")
        .updateOne(
          { slug: originalSlug || finalSlug, type: "blog" },
          { $set: update }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // ✅ If slug changed, update it
      if (slug && slug !== originalSlug) {
        await db
          .collection("blog_posts")
          .updateOne({ slug: originalSlug }, { $set: { slug: finalSlug } });
      }

      return res.status(200).json({ message: "Post updated" });
    }

    /* =======================
       DELETE POST
    ======================= */
    if (method === "DELETE") {
      const { slug } = req.body;

      if (!slug) {
        return res.status(400).json({ error: "Slug required" });
      }

      const result = await db.collection("blog_posts").deleteOne({
        slug,
        type: "blog",
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted" });
    }

    /* =======================
       ADMIN GET
    ======================= */
    if (method === "GET") {
      const posts = await db
        .collection("blog_posts")
        .find({ type: "blog" })
        .sort({ createdAt: -1, _id: -1 })
        .toArray();

      return res.status(200).json(posts);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin blog API error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
