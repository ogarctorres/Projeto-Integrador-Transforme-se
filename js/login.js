// =========================================================================
// SCRIPT DA TELA DE LOGIN — CONECTA MAIS (CONECTA+)
// =========================================================================

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const feedback = document.getElementById("feedback");
const togglePassword = document.getElementById("toggle-password");

// 1. Mostrar e ocultar senha
togglePassword.addEventListener("click", function () {
  const senhaOculta = passwordInput.type === "password";
  passwordInput.type = senhaOculta ? "text" : "password";
  togglePassword.textContent = senhaOculta ? "Ocultar" : "Mostrar";
});

// 2. Validar formulário e abrir o Painel Logado
form.addEventListener("submit", function (event) {
  event.preventDefault();

  feedback.style.color = "#b42318";

  if (!emailInput.validity.valid) {
    feedback.textContent = "Digite um e-mail válido.";
    emailInput.focus();
    return;
  }

  if (passwordInput.value.length < 6) {
    feedback.textContent = "A senha precisa ter pelo menos 6 caracteres.";
    passwordInput.focus();
    return;
  }

  const resultado = validarLoginUsuario(emailInput.value.trim(), passwordInput.value);

  if (!resultado.sucesso) {
    feedback.textContent = resultado.mensagem + " (Conta teste: richard.mendes@estudante.br / 123456)";
    return;
  }

  feedback.style.color = "#079b6b";
  feedback.textContent = "Login realizado! Abrindo seu painel...";

  setTimeout(function () {
    window.location.href = "painel.html";
  }, 600);
});

// 3. Links informativos (planejados para Firebase Authentication)
document.getElementById("forgot-link").addEventListener("click", function (event) {
  event.preventDefault();
  feedback.style.color = "#2864e8";
  feedback.textContent = "Recuperação de senha será integrada via Firebase Authentication.";
});

document.getElementById("google-button").addEventListener("click", function () {
  feedback.style.color = "#2864e8";
  feedback.textContent = "Login com Google será conectado via Firebase Authentication.";
});

document.getElementById("linkedin-button").addEventListener("click", function () {
  feedback.style.color = "#2864e8";
  feedback.textContent = "Login com LinkedIn será conectado na próxima fase do projeto.";
});
