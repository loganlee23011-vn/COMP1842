const { isMailConfigured, sendMail } = require("../../config/mailer");

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.MAIL_FROM || process.env.SMTP_USER;

exports.send_contact_message = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please complete all contact fields." });
    }

    if (!isMailConfigured() || !SUPPORT_EMAIL) {
      return res.status(500).json({ message: "Support email is not configured." });
    }

    await sendMail({
      to: SUPPORT_EMAIL,
      subject: `[Helpdesk Contact] ${subject.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.toLowerCase().trim()}\n\nMessage:\n${message.trim()}`,
      html: `
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.toLowerCase().trim()}</p>
        <p><strong>Subject:</strong> ${subject.trim()}</p>
        <p><strong>Message:</strong></p>
        <p>${message.trim().replace(/\n/g, "<br>")}</p>
      `
    });

    return res.json({ message: "Your support message has been sent successfully." });
  } catch (err) {
    return res.status(500).send(err);
  }
};
