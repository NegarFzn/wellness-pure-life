const express = require("express");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const cors = require("cors");
const { generateEmailContent } = require("./contentGenerator");
const { emailTemplate } = require("./emailTemplate");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK
initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Subscribe endpoint to Firebase
app.post("/subscribe", async (req, res) => {
  const { name, email } = req.body;

  try {
    const docRef = db.collection("subscribers").doc(email);
    const doc = await docRef.get();

    if (doc.exists) {
      return res.status(409).send({
        success: true,
        message: "✅ You're already subscribed.",
      });
    }

    await docRef.set({ name, email });

    const transporter = nodemailer.createTransport({
      host: "mail.robotscapital.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@wellnesspurelife.com",
        pass: "mK3CmVABnzWmWk",
      },
    });

    const { subject, body } = generateEmailContent();
    const mailOptions = {
      from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
      to: email,
      subject: subject || "Welcome to Wellness Pure Life! 🌿",
      html: emailTemplate(name, body),
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("❌ Welcome Email Error:", err);
        return res.status(500).send({
          success: false,
          message: "Email sending failed.",
        });
      }

      console.log("✅ Welcome Email Sent:", email);
      return res.status(201).send({
        success: true,
        message: "✅ Subscribed & email sent!",
      });
    });
  } catch (err) {
    console.error("❌ Subscription Error:", err);
    return res.status(500).send({ success: false, message: "Server error." });
  }
});

// ✅ Send newsletter to all Firebase subscribers
async function sendNewsletter() {
  try {
    const snapshot = await db.collection("subscribers").get();

    if (snapshot.empty) {
      console.log("📭 No subscribers found.");
      return;
    }

    const { subject, body } = generateEmailContent();

    const transporter = nodemailer.createTransport({
      host: "mail.robotscapital.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@wellnesspurelife.com",
        pass: "mK3CmVABnzWmWk",
      },
    });

    snapshot.forEach((doc) => {
      const { name, email } = doc.data();

      const mailOptions = {
        from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
        to: email,
        subject,
        html: emailTemplate(name, body),
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("❌ Email failed for", email, err.message);
        } else {
          console.log("✅ Email sent to:", email);
        }
      });
    });
  } catch (err) {
    console.error("❌ Newsletter Error:", err);
  }
}


// Cron schedule: Tuesday, Friday, Sunday at 9 AM
cron.schedule("0 9 * * 2,5,0", sendNewsletter);

// Test route
app.get("/send-test", (req, res) => {
  sendNewsletter();
  res.send("✅ Test emails triggered.");
});

app.listen(PORT, () =>
  console.log(`📡 Email server running at http://localhost:${PORT}`)
);
