import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 5000;

// Where contact-form messages should land. Defaults to your own inbox.
const TO_EMAIL = process.env.TO_EMAIL || "shreyas.surve02@gmail.com";

// Allow the deployed client's origin to call this API. In local dev, Vite's
// proxy makes this a non-issue, but CORS still matters once both are deployed.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
app.use(express.json());

// --- very small in-memory rate limiter (per IP) to deter spam/abuse ---
const rateLimitWindowMs = 60 * 1000;
const rateLimitMax = 5;
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, start: now };
  if (now - entry.start > rateLimitWindowMs) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  hits.set(ip, entry);
  if (entry.count > rateLimitMax) {
    return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
  }
  next();
}

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password, not your regular password
    },
  });
  return transporter;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, emailConfigured: Boolean(getTransporter()) });
});

app.post("/api/contact", rateLimit, async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const mailer = getTransporter();
  if (!mailer) {
    console.error(
      "Email not sent — EMAIL_USER / EMAIL_PASS are missing. See server/.env.example."
    );
    return res.status(500).json({
      error: "Email is not configured on the server yet. Please email me directly instead.",
    });
  }

  const safeSubject = subject && subject.trim() ? subject.trim() : "New portfolio contact";

  try {
    await mailer.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${safeSubject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height:1.6;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    res.status(500).json({ error: "Failed to send the message. Please try again shortly." });
  }
});

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(PORT, () => {
  console.log(`Portfolio contact API running on http://localhost:${PORT}`);
  if (!getTransporter()) {
    console.warn(
      "Warning: EMAIL_USER / EMAIL_PASS not set — /api/contact will return an error until configured (see .env.example)."
    );
  }
});
