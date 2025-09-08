import { sendEmail } from "../../../utils/email";
import { generateEmailPlanContent } from "../../../emails/PlanContentGenerator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, answers, category, matchedPlan } = req.body;

  // ✅ Validate input
  if (
    !email ||
    !category ||
    !answers ||
    typeof answers !== "object" ||
    typeof email !== "string"
  ) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const normalizedCategory = category.replace(/-plan$/, "").toLowerCase();

    // ✅ Generate email content with actual plan
    const { subject, body: htmlBody } = generateEmailPlanContent({
      answers,
      category: normalizedCategory,
      matchedPlan,
    });

    await sendEmail(email, subject, htmlBody);

    return res.status(200).json({ message: "Email sent successfully." });
  } catch (err) {
    console.error("❌ Failed to send email:", err.message, err.stack);
    return res.status(500).json({ error: "Email send failed." });
  }
}
