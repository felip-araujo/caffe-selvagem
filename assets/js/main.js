const form = document.getElementById("form-contato");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const button = form.querySelector("button[type='submit']");

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();
        const quantidade = document.getElementById("quantidade").value;

        if (!nome || !email || !mensagem || !quantidade) {
            alert("Preencha todos os campos.");
            return;
        }

        if (typeof grecaptcha === "undefined") {
            alert("O reCAPTCHA ainda não carregou. Aguarde alguns segundos e tente novamente.");
            return;
        }

        const token = grecaptcha.getResponse();

        if (!token) {
            alert("Confirme o captcha.");
            return;
        }

        button.disabled = true;
        button.innerText = "Enviando...";

        try {
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

            const data = await res.json();

            if (!res.ok) {
                console.error("Erro retornado pela API:", data);
                alert(data.error || "Erro ao enviar formulário.");
                grecaptcha.reset();
                return;
            }

            alert("Mensagem enviada com sucesso!");
            form.reset();
            grecaptcha.reset();

        } catch (error) {
            console.error("Erro no front:", error);
            alert("Erro ao enviar formulário. Verifique sua conexão e tente novamente.");
            grecaptcha.reset();

        } finally {
            button.disabled = false;
            button.innerText = "Solicitar Proposta";
        }
    });
}

function scrollSobreCards(value) {
    const container = document.getElementById('sobreCardsContainer');

    if (!container) return;

    container.scrollBy({
        left: value,
        behavior: 'smooth'
    });
}