import nodemailer from "nodemailer";

export default async function handler(req, res) {
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
            to: "felipedgart@gmail.com" ,
            subject: "Novo contato do site",
            text: `
        Nome: ${nome}
        Email: ${email}
        Mensagem: ${mensagem}
      `
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao enviar email" });
    }
}