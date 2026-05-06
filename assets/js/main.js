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
            showToast(
                "warning",
                "Campos obrigatórios",
                "Preencha todos os campos antes de enviar."
            );
            return;
        }

        if (typeof grecaptcha === "undefined") {
            alert("O reCAPTCHA ainda não carregou. Aguarde alguns segundos e tente novamente.");
            return;
        }

        const token = grecaptcha.getResponse();

        if (!token) {
            showToast(
                "warning",
                "Confirme o captcha",
                "Marque a verificação antes de enviar sua mensagem."
            );
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
                showToast(
                    "error",
                    "Erro ao enviar",
                    "Não foi possível enviar sua mensagem. Tente novamente."
                );
                grecaptcha.reset();
                return;
            }

            showToast(
                "success",
                "Mensagem enviada com sucesso",
                "Nossa equipe retornará em até 24 horas úteis."
            );
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



function showToast(type, title, message) {
    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toast-icon");
    const toastTitle = document.getElementById("toast-title");
    const toastMessage = document.getElementById("toast-message");

    if (!toast || !toastIcon || !toastTitle || !toastMessage) return;

    toastTitle.innerText = title;
    toastMessage.innerText = message;

    toastIcon.className =
        "w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0";

    if (type === "success") {
        toastIcon.classList.add("bg-green-600");
        toastIcon.innerHTML = `<i class="fa-solid fa-check"></i>`;
    }

    if (type === "error") {
        toastIcon.classList.add("bg-red-600");
        toastIcon.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    }

    if (type === "warning") {
        toastIcon.classList.add("bg-yellow-500");
        toastIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    }

    toast.classList.remove("hidden");
    toast.classList.add("animate__animated", "animate__fadeInRight");

    setTimeout(() => {
        toast.classList.remove("animate__fadeInRight");
        toast.classList.add("animate__fadeOutRight");

        setTimeout(() => {
            toast.classList.add("hidden");
            toast.classList.remove("animate__animated", "animate__fadeOutRight");
        }, 500);
    }, 4000);
}