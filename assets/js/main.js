alert("teste")

async function enviarFormulario(nome, email, mensagem) {
  const res = await fetch("/api/contato", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      email,
      mensagem
    })
  });

  if (res.ok) {
    alert("Enviado com sucesso!");
  } else {
    alert("Erro ao enviar");
  }
}