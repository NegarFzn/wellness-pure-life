function emailTemplate(name, body) {
  return `
      <div style="font-family:sans-serif; padding:20px; max-width:600px; margin:auto;">
        <h1>Hi ${name},</h1>
        ${body}
        <hr/>
        <p style="font-size:0.9em; color:gray;">
          You’re receiving this email because you subscribed to Wellness Pure Life.
        </p>
      </div>
    `;
}

module.exports = { emailTemplate };
