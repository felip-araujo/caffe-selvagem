
const formContato = document.getElementById("form-contato");

formContato.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const button = formContato.querySelector("button[type='submit']");

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const quantidade = document.getElementById("quantidade").value;
    const mensagem = document.getElementById("mensagem").value.trim();

    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Por favor, confirme o reCAPTCHA.");
        return;
    }

    button.disabled = true;
    button.innerText = "Enviando...";

    try {
        const response = await fetch("/api/contato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                quantidade,
                mensagem,
                token
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Erro ao enviar formulário.");
            grecaptcha.reset();
            return;
        }

        alert("Mensagem enviada com sucesso!");
        formContato.reset();
        grecaptcha.reset();

    } catch (error) {
        console.error(error);
        alert("Erro ao enviar formulário.");
        grecaptcha.reset();

    } finally {
        button.disabled = false;
        button.innerText = "Solicitar Proposta";
    }
});
