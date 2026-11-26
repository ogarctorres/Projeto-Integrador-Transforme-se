// =========================================================================
// SCRIPT DA TELA DE CADASTRO — CONECTA MAIS (CONECTA+)
// =========================================================================

const formCadastro = document.getElementById("cadastro-form");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("password");
const campoEscolaridade = document.getElementById("escolaridade");
const campoDispositivo = document.getElementById("dispositivo");
const campoMeta = document.getElementById("meta");
const feedback = document.getElementById("feedback");
const togglePassword = document.getElementById("toggle-password");

// 1. Mostrar e ocultar senha
togglePassword.addEventListener("click", function () {
  const senhaOculta = campoSenha.type === "password";
  campoSenha.type = senhaOculta ? "text" : "password";
  togglePassword.textContent = senhaOculta ? "Ocultar" : "Mostrar";
});

// 2. Enviar cadastro e entrar no painel
formCadastro.addEventListener("submit", function (event) {
  event.preventDefault();

  feedback.style.color = "#b42318";

  const habilidadesSelecionadas = [];
  document.querySelectorAll("#grupo-habilidades input:checked").forEach(function (item) {
    habilidadesSelecionadas.push(item.value);
  });

  const diasSelecionados = [];
  document.querySelectorAll("#grupo-dias input:checked").forEach(function (item) {
    diasSelecionados.push(item.value);
  });

  if (habilidadesSelecionadas.length === 0) {
    feedback.textContent = "Selecione pelo menos 1 habilidade.";
    return;
  }

  if (diasSelecionados.length === 0) {
    feedback.textContent = "Selecione pelo menos 1 dia disponível.";
    return;
  }

  const novoUsuario = {
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    senha: campoSenha.value,
    escolaridade: campoEscolaridade.value.trim(),
    dispositivo: campoDispositivo.value.trim(),
    habilidades: habilidadesSelecionadas,
    diasLivres: diasSelecionados,
    metaMensal: Number(campoMeta.value) || 1250
  };

  const resposta = cadastrarNovoUsuario(novoUsuario);

  if (!resposta.sucesso) {
    feedback.textContent = resposta.mensagem;
    return;
  }

  validarLoginUsuario(novoUsuario.email, novoUsuario.senha);

  feedback.style.color = "#079b6b";
  feedback.textContent = "Cadastro concluído! Abrindo seu painel...";

  setTimeout(function () {
    window.location.href = "painel.html";
  }, 700);
});
