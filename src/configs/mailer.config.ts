import nodemailer from 'nodemailer'

const mailTransporter = nodemailer.createTransport({
  // host: process.env.MAILER_HOST,
  // port: process.env.MAILER_PORT,
  service: process.env.MAILER_SERVICE, // e.g., 'Gmail' or 'SMTP'
  secure: true,
  auth: {
    user: process.env.MAILER_AUTH_USER,
    pass: process.env.MAILER_AUTH_PASS
  }
})

// Define the email options
const getMailOptions = (email: string, subject: string, otp: string) => ({
  from: 'Kahoot app',
  to: email,
  subject,
  html: `
    <p>Your OTP is </p> <h1>${otp}</h1>
    <p>All the best,</p>
    <p>The Kahoot! Team</p>
  `
})

export { mailTransporter, getMailOptions }
