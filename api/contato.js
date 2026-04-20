
const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método não permitido" });
    }

    const { nome, email, mensagem } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "felipedgart@gmail.com",
            subject: "Novo contato do site",
            text: `
Nome: ${nome}
Email: ${email}
Quantidade: ${quantidade}
Mensagem: ${mensagem}
      `
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao enviar email" });
    }
};


const fetch = require("node-fetch");

const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
});

const data = await verify.json();

if (!data.success) {
    return res.status(400).json({ error: "reCAPTCHA inválido" });
}