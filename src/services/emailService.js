const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.NODE_ENV === "production",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  // Notifica usuário premium sobre exclusão de produto
  sendProductDeletionEmail: async (email, username, productName) => {
    await transporter.sendMail({
      from: `"E-commerce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Seu produto foi removido",
      html: `
            <h2>Olá ${username},</h2>
            <p>O produto "${productName}" que você cadastrou foi removido por um administrador.</p>
            <p>Caso tenha dúvidas, entre em contato conosco.</p>
          `,
    });
  },

  // Notifica usuário inativo
  sendInactivityEmail: async (email) => {
    await transporter.sendMail({
      from: `"E-commerce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Conta removida por inatividade",
      text: "Sua conta foi excluída por ficar inativa por mais de 2 dias.",
    });
  },
};
