const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.post("/send-mail", async (req, res) => {
  const data = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      replyTo: data.email,
      to: process.env.EMAIL_USER,
      subject: data.subject || "New Contact Form",
      html: `
        <h2>New Enquiry</h2>

        <p><b>Name:</b> ${data.fullName}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.mobile}</p>
        <p><b>Company:</b> ${data.company}</p>
        <p><b>Subject:</b> ${data.subject}</p>

        <p>
          <b>Message:</b><br/>
          ${data.message}
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, message: "Mail failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});