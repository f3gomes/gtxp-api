import nodemailer from "nodemailer";

interface MailProps {
  email: string;
  subject: string;
  html: any;
}

export const sendMail = async ({ email, subject, html }: MailProps) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_KEY,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });
};
