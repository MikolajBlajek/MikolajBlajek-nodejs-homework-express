import nodemailer from 'nodemailer';
import dotenv from 'dotenv';  

//--------------zmiana na importy

dotenv.config();

const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false, 
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

export const sendVerificationEmail = async (html, subject, to) => {
  try {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <hw06test@gmail.com>', 
      to, 
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// main('Hello, this is a test email!', 'Test Subject', 'mikolajblajek@gmail.com')
//   .catch(console.error);

// module.exports = main;
 