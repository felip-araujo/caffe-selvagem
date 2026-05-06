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

        if (!process.env.RECAPTCHA_SECRET) {
            console.error("RECAPTCHA_SECRET não configurado");
            return res.status(500).json({ error: "RECAPTCHA_SECRET não configurado no servidor" });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("EMAIL_USER ou EMAIL_PASS não configurado");
            return res.status(500).json({ error: "Credenciais de e-mail não configuradas no servidor" });
        }

        // Validação do reCAPTCHA
        const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET,
                response: token
            }).toString()
        });

        const captchaData = await verify.json();

        if (!captchaData.success) {
            console.error("ERRO RECAPTCHA:", captchaData);

            return res.status(400).json({
                error: "Captcha inválido",
                details: captchaData["error-codes"] || []
            });
        }

        // Transporte Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Testa credenciais antes de enviar
        await transporter.verify();

        await transporter.sendMail({
            from: `"Café Selvagem" <${process.env.EMAIL_USER}>`,
            to: [
                "felipedgart@gmail.com",
                "comercial@cafeselvagem.com.br"
            ],
            replyTo: email,
            subject: "Novo Contato do Site",
            text: `
Novo contato recebido pelo site Café Selvagem:

Nome/Razão Social: ${nome}
E-mail: ${email}
Quantidade de Hectares: ${quantidade}

Mensagem:
${mensagem}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
                    <h2>Novo contato recebido pelo site Café Selvagem</h2>

                    <p><strong>Nome/Razão Social:</strong> ${nome}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Quantidade de Hectares:</strong> ${quantidade}</p>

                    <p><strong>Mensagem:</strong></p>
                    <p>${mensagem}</p>
                </div>
            `
        });

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error("ERRO REAL:", error);

        if (
            error.code === "EAUTH" ||
            error.responseCode === 535 ||
            String(error.message).includes("Username and Password not accepted")
        ) {
            return res.status(500).json({
                error: "Erro de autenticação do e-mail. Verifique EMAIL_USER e EMAIL_PASS na Vercel."
            });
        }

        return res.status(500).json({
            error: error.message || "Erro interno ao enviar mensagem"
        });
    }
};