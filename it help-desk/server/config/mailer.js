const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM
} = process.env;

function isMailConfigured() {
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && MAIL_FROM);
}

function getTransporter() {
  if (!isMailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function sendMail({ to, subject, text, html }) {
  const transporter = getTransporter();

  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html
  });

  return true;
}

module.exports = {
  isMailConfigured,
  sendMail
};
