import nodemailer from "nodemailer";
require("dotenv").config();

export function sendEmail(email: string, subject: string, message: string) {
  console.log(process.env.MAIL_HOST);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  console.log(email);
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions);
}
