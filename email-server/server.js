const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateEmailContent } = require('./contentGenerator');
const { emailTemplate } = require('./emailTemplate');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Use existing subscribe.json in /data folder
const subscriberPath = '../data/subscribe.json';
let users = JSON.parse(fs.readFileSync(subscriberPath, 'utf-8'));

// ✅ Subscribe endpoint
app.post('/subscribe', (req, res) => {
  const { name, email } = req.body;
  const exists = users.find(u => u.email === email);

  if (!exists) {
    users.push({ name, email });
    fs.writeFileSync(subscriberPath, JSON.stringify(users, null, 2));

    // ✅ Send welcome email
    const transporter = nodemailer.createTransport({
      host: 'mail.robotscapital.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@wellnesspurelife.com',
        pass: 'mK3CmVABnzWmWk',
      },
    });

    const { subject, body } = generateEmailContent();
    const mailOptions = {
      from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
      to: email,
      subject: `Welcome to Wellness Pure Life! 🌿`,
      html: emailTemplate(name, body),
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('❌ Welcome Email Error:', err);
      else console.log('✅ Welcome Email Sent:', email);
    });
  }

  res.send({ success: true });
});

// ✅ Email sender logic (Weekly Newsletter)
function sendNewsletter() {
  const content = generateEmailContent();

  const transporter = nodemailer.createTransport({
    host: 'mail.robotscapital.com',
    port: 465,
    secure: true,
    auth: {
      user: 'info@wellnesspurelife.com',
      pass: 'mK3CmVABnzWmWk',
    },
  });

  users.forEach(user => {
    const mailOptions = {
      from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
      to: user.email,
      subject: content.subject,
      html: emailTemplate(user.name, content.body),
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('❌ Error:', err);
      else console.log('✅ Sent to:', user.email);
    });
  });
}

// ✅ Auto send: Every Tuesday + Friday at 9 AM
cron.schedule('0 9 * * 1,3,5', sendNewsletter);

// ✅ Test endpoint
app.get('/send-test', (req, res) => {
  sendNewsletter();
  res.send('Emails sent!');
});

app.listen(PORT, () => console.log(`📡 Email server running at http://localhost:${PORT}`));
