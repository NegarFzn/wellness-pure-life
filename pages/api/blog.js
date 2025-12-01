import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    const { db } = await connectToDatabase();
    const { slug } = query;

    // ✅ GET SINGLE POST
    if (method === "GET" && slug) {
      const post = await db.collection("blog_posts").findOne(
        { slug, type: "blog" },
        { projection: { type: 0 } }
      );

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // ---------------------------------------
      // ✅ FETCH OTHER POSTS FOR RECOMMENDATIONS
      // ---------------------------------------
      const others = await db
        .collection("blog_posts")
        .find({ type: "blog", slug: { $ne: slug } })
        .sort({ createdAt: -1 })
        .limit(14)
        .project({
          slug: 1,
          title: 1,
          image: 1,
          excerpt: 1,
        })
        .toArray();

      // ---------------------------------------
      // ✅ PROVIDE RECOMMENDED LIST AS JSON
      // ---------------------------------------
      post.recommended = others || [];

      // ❌ DO NOT modify post.content
      // We no longer append HTML lists

      return res.status(200).json(post);
    }

    // ✅ GET ALL POSTS
    if (method === "GET") {
      const posts = await db
        .collection("blog_posts")
        .find({ type: "blog" })
        .sort({ createdAt: -1, _id: -1 })
        .project({ type: 0 })
        .toArray();

      return res.status(200).json(posts);
    }

    // ❌ Writers not allowed
    return res.status(403).json({ error: "Forbidden" });

  } catch (error) {
    console.error("Public Blog API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
