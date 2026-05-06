const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Método não permitido" });
        }

        const { nome, email, mensagem, quantidade, token } = req.body;

        if (!nome || !email || !mensagem || !quantidade || !token) {
            return res.status(400).json({ error: "Dados incompletos" });
        }

        const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET,
                response: token
            })
        });

        const data = await verify.json();

        if (!data.success) {
            console.log("ERRO RECAPTCHA:", data);
            return res.status(400).json({ error: "Captcha inválido" });
        }

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
            from: `"Café Selvagem" <${process.env.EMAIL_USER}>`,
            to: [
                "felipedgart@gmail.com",
                "comercial@cafeselvagem.com.br"
            ],
            replyTo: email,
            subject: "Novo Contato do Site",
            text: `Nome: ${nome}\nEmail: ${email}\nQuantidade: ${quantidade}\nMensagem: ${mensagem}`
        });

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error("ERRO REAL:", error);
        return res.status(500).json({ error: error.message });
    }
};