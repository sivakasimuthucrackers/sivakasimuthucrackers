import nodemailer from "nodemailer";

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("Email skipped: EMAIL_USER or EMAIL_PASS missing");
    return { success: false, skipped: true };
  }

  try {
    const result = await transporter.sendMail({
      from: `"Sivakasi Muthu Crackers" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return { success: false, error: error.message };
  }
}
