const form = document.getElementById("form-contato");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Confirme o captcha");
        return;
    }

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;
    const quantidade = document.getElementById("quantidade").value;

    const res = await fetch("/api/contato", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            email,
            mensagem,
            quantidade,
            token
        })
    });

    if (res.ok) {
        alert("Mensagem enviada!");
        form.reset();
        grecaptcha.reset();
    } else {
        alert("Erro ao enviar");
    }
});