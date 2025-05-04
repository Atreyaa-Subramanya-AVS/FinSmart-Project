const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"FinSmart Auth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for FinSmart Login",
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #2d2d2d;">
        <div style="max-width: 500px; margin: auto; background-color: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid #444; color: #fff;">

          <div style="text-align: center; margin-bottom: 20px;">
            <!-- SVG for FinSmart Logo -->
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" fill-rule="evenodd" d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18" clip-rule="evenodd"/>
            </svg>
            <h2 style="color: #2e86de; margin-top: 10px;">FinSmart OTP Verification</h2>
          </div>

          <p style="text-align: center; font-size: 16px; color: #ccc;">
            Welcome to <strong>FinSmart</strong> – your intelligent companion for smarter financial decisions.
          </p>
          <p style="text-align: center; font-size: 15px; color: #bbb;">
            Use the OTP below to verify your identity and start mastering your money journey.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 18px; margin: 0;">Your One-Time Password (OTP):</p>
            <p style="font-size: 32px; font-weight: bold; color: #27ae60; margin: 10px 0;">${
              String(otp).slice(0, 3) + " - " + String(otp).slice(3)
            }</p>
            <p style="margin: 0; color: #aaa;">This OTP will expire in next <strong>2 minutes</strong>.</p>
          </div>

          <p style="color: #aaa; font-size: 14px;">If you didn't request this, please ignore this email.</p>

          <hr style="margin-top: 30px; border: none; border-top: 1px solid #555;">

          <p style="font-size: 12px; color: #888; text-align: center;">© FinSmart. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
