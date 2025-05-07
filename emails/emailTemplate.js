export function emailTemplate(content) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
        ${content}
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="font-size: 12px; color: #888888; text-align: center; line-height: 1.6;">
          This message was sent by <strong>Wellness Pure Life</strong>.<br />
          If you have any questions, please contact us at <a href="mailto:support@wellnesspurelife.com" style="color: #4b006e;">support@wellnesspurelife.com</a>.
        </p>
      </div>
    </div>
  `;
}
