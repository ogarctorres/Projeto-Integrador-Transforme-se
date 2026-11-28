// =========================================================================
// SCRIPT DA TELA DE LOGIN — CONECTA MAIS (FIREBASE AUTH + FALLBACK LOCAL)
// =========================================================================

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const feedback = document.getElementById("feedback");
const togglePassword = document.getElementById("toggle-password");
const btnEntrar = form.querySelector(".btn-primary");

// 1. Mostrar e ocultar senha
togglePassword.addEventListener("click", function () {
  const senhaOculta = passwordInput.type === "password";
  passwordInput.type = senhaOculta ? "text" : "password";
  togglePassword.textContent = senhaOculta ? "Ocultar" : "Mostrar";
});

// 2. Validar formulário e autenticar via Firebase Auth (ou modo local)
form.addEventListener("submit", async function (event) {
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

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  const resultado = await servicoLoginEmailSenha(emailInput.value.trim(), passwordInput.value);

  if (!resultado.sucesso) {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar na Plataforma →";
    feedback.textContent = resultado.mensagem + " (Conta teste: richard.mendes@estudante.br / 123456)";
    return;
  }

  feedback.style.color = "#059669";
  feedback.textContent = "Login realizado! Abrindo seu painel...";

  setTimeout(function () {
    window.location.href = "painel.html";
  }, 550);
});

// 3. Recuperar senha via Firebase Auth
document.getElementById("forgot-link").addEventListener("click", async function (event) {
  event.preventDefault();
  const resp = await servicoRecuperarSenha(emailInput.value.trim());
  feedback.style.color = resp.sucesso ? "#059669" : "#2563eb";
  feedback.textContent = resp.mensagem;
});

// 4. Login com Google via Firebase Auth
const btnGoogle = document.getElementById("google-button");
btnGoogle.addEventListener("click", async function () {
  btnGoogle.disabled = true;
  feedback.style.color = "#2563eb";
  feedback.textContent = "Abrindo janela segura do Google...";
  const resp = await servicoLoginGoogle();

  if (resp.sucesso) {
    feedback.style.color = "#059669";
    feedback.textContent = "Autenticado com Google! Abrindo seu painel...";
    setTimeout(function () { window.location.href = "painel.html"; }, 550);
  } else {
    btnGoogle.disabled = false;
    feedback.style.color = "#b42318";
    feedback.textContent = resp.mensagem;
  }
});

// 5. Botão LinkedIn (informativo) e atalho da conta demonstrativa
document.getElementById("linkedin-button").addEventListener("click", function () {
  feedback.style.color = "#2563eb";
  feedback.textContent = "Login com LinkedIn disponível na próxima fase (OAuth).";
});

const btnDemo = document.getElementById("btnPreencherDemo");
if (btnDemo) {
  btnDemo.addEventListener("click", function () {
    emailInput.value = "richard.mendes@estudante.br";
    passwordInput.value = "123456";
    feedback.style.color = "#059669";
    feedback.textContent = "Conta de demonstração preenchida! Clique em Entrar na Plataforma.";
  });
}
