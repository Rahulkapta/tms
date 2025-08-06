// utils/mail.utils.ts
import nodemailer from "nodemailer";

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for Login",
    text: `Your OTP is ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}
