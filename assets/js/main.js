console.log("teste")

const form = document.getElementById("form-contato");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // impede reload

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const mensagem = document.getElementById("mensagem").value;

  const res = await fetch("/api/contato", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, mensagem })
  });

  if (res.ok) {
    alert("Mensagem enviada!");
    form.reset();
  } else {
    alert("Erro ao enviar");
  }
});