import { Resend } from "resend";

function normalizeRecipients(to) {
  if (Array.isArray(to)) {
    return to.filter(Boolean);
  }

  return to ? [to] : [];
}

function normalizeAttachments(attachments = []) {
  return attachments
    .filter((attachment) => attachment && attachment.filename)
    .map((attachment) => {
      const normalized = {
        filename: attachment.filename,
      };

      if (attachment.path) {
        normalized.path = attachment.path;
        return normalized;
      }

      if (attachment.content !== undefined && attachment.content !== null) {
        normalized.content = Buffer.isBuffer(attachment.content)
          ? attachment.content.toString("base64")
          : String(attachment.content);
      }

      return normalized;
    });
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    const message =
      "Email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is missing";

    console.error(message);

    return {
      success: false,
      skipped: true,
      error: message,
    };
  }

  const recipients = normalizeRecipients(to);

  if (recipients.length === 0) {
    const message = "Email skipped: recipient address is missing";

    console.error(message);

    return {
      success: false,
      skipped: true,
      error: message,
    };
  }

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: `Sivakasi Muthu Crackers <${fromEmail}>`,
      to: recipients,
      subject,
      html,
      attachments: normalizeAttachments(attachments),
    });

    if (error) {
      console.error("Resend email failed:", error);

      return {
        success: false,
        error: error.message || JSON.stringify(error),
      };
    }

    console.log(
      `Resend email sent successfully to ${recipients.join(", ")}`
    );

    return {
      success: true,
      messageId: data?.id || null,
    };
  } catch (error) {
    console.error("Resend email failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}
