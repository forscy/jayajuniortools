import transport from "../config/smtp.config";

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await transport.sendMail({
      from: "jjt@gmail.com",
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    throw error;
  }
};