export function emailTemplate(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Wellness Plan</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">

            <!-- 🔷 Branding Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://wellnesspurelife.com/images/logo.jpg" alt="Wellness Pure Life"  style="max-width: 70px; height: auto; display: block; margin: 0 auto 20px auto;" />
            </div>

            <!-- 🔹 Main Content -->
            ${content}

            <!-- 🔻 Footer -->
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;" />
            <p style="font-size: 12px; color: #888888; text-align: center; line-height: 1.6;">
              This message was sent by <strong>Wellness Pure Life</strong>.<br />
              If you have any questions, please contact us at
              <a href="mailto:support@wellnesspurelife.com" style="color: #4b006e;">support@wellnesspurelife.com</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
