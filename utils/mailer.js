const nodemailer=require('nodemailer');
const transporter = nodemailer.createTransport({
  service: "gmail", // you can use Gmail, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email app password
  },
});

exports.sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Bike Rental" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(" Email sent to:", to);
  } catch (err) {
    console.error(" Email error:", err.message);
  }
};