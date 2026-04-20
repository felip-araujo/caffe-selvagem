const nodemailer = require("nodemailer");

// se der erro de fetch, descomenta a linha abaixo:
// const fetch = require("node-fetch");

module.exports = async (req, res) => { // ⚠️ TEM que ser async
    try {
        if (req.method !== "POST") {
            return res.status(405).end();
        }

        const { nome, email, mensagem, quantidade, token } = req.body;

        // 🔐 valida reCAPTCHA (AGORA dentro do async)
        const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
        });

        const data = await verify.json();

        if (!data.success) {
            return res.status(400).json({ error: "Captcha inválido" });
        }

        // 📩 envio de email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: [
                "felipedgart@gmail.com",
                "comercial@cafeselvagem.com.br"
            ],
            subject: "Novo Contato do Site",
            text: `Nome: ${nome}\nEmail: ${email} \nQuantidade: ${quantidade} \nMensagem: ${mensagem}`
        });

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error("ERRO REAL:", error);
        return res.status(500).json({ error: error.message });
    }
};