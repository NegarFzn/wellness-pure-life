import { sendEmail } from "../../utils/email"; // adjust path as needed
import { createContactEmail } from "../../emails/emailCreator"; // adjust path as needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const { subject, body } = createContactEmail(name, email, message);
    await sendEmail(process.env.RECEIVER_EMAIL, subject, body);

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}
