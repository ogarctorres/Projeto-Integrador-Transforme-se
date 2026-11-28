// =========================================================================
// SCRIPT DA TELA DE CADASTRO POR ETAPAS — CONECTA MAIS (CONECTA+)
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

const btnAnterior = document.getElementById("btnEtapaAnterior");
const btnProximo = document.getElementById("btnProximaEtapa");
const btnFinalizar = document.getElementById("btnFinalizarCadastro");

let etapaAtual = 1;
const totalEtapas = 4;

const textosEtapas = {
  1: { titulo: "Dados Pessoais", sub: "Comece informando seus dados básicos de acesso gratuito." },
  2: { titulo: "Perfil Acadêmico & Inclusão", sub: "Conte como você estuda e qual dispositivo utiliza." },
  3: { titulo: "Habilidades & Disponibilidade", sub: "Marque o que você já sabe fazer e os dias livres." },
  4: { titulo: "Finalização & Proteção de Dados (LGPD)", sub: "Revise os termos e conclua seu cadastro gratuito no Conecta+." }
};

// 1. Atualiza qual etapa está visível na tela
function mostrarEtapa(numero) {
  etapaAtual = numero;
  feedback.textContent = "";

  // Mostra só o bloco da etapa atual
  document.querySelectorAll(".etapa-bloco").forEach(function (bloco) {
    const ehAtual = Number(bloco.dataset.etapa) === etapaAtual;
    bloco.classList.toggle("ativa", ehAtual);
  });

  // Atualiza textos e barra de progresso
  document.getElementById("badgeEtapa").textContent = "ETAPA " + etapaAtual + " DE " + totalEtapas;
  document.getElementById("tituloEtapa").textContent = textosEtapas[etapaAtual].titulo;
  document.getElementById("subtituloEtapa").textContent = textosEtapas[etapaAtual].sub;
  document.getElementById("barraProgresso").style.width = (etapaAtual * 25) + "%";

  // Controla visibilidade dos botões
  btnAnterior.hidden = etapaAtual === 1;
  btnProximo.hidden = etapaAtual === totalEtapas;
  btnFinalizar.hidden = etapaAtual !== totalEtapas;

  if (etapaAtual === 4) {
    const habs = [];
    document.querySelectorAll("#grupo-habilidades input:checked").forEach(function (i) { habs.push(i.value); });
    const dias = [];
    document.querySelectorAll("#grupo-dias input:checked").forEach(function (i) { dias.push(i.value); });
    const resumoBox = document.getElementById("resumoCadastroBox");
    if (resumoBox) {
      resumoBox.innerHTML =
        "<strong>📋 Resumo do seu perfil:</strong><br>" +
        "Nome: " + (campoNome.value.trim() || "Não informado") + " • Meta: R$ " + (campoMeta.value || "1250") + "/mês<br>" +
        "Habilidades: " + habs.join(", ") + "<br>" +
        "Dias livres: " + dias.join(", ");
    }
  }
}

// 2. Avançar etapa com validação simples
btnProximo.addEventListener("click", function () {
  feedback.style.color = "#b42318";

  if (etapaAtual === 1) {
    if (campoNome.value.trim().length < 2) {
      feedback.textContent = "Digite seu nome completo.";
      campoNome.focus();
      return;
    }
    if (!campoEmail.validity.valid) {
      feedback.textContent = "Digite um e-mail válido.";
      campoEmail.focus();
      return;
    }
    if (campoSenha.value.length < 6) {
      feedback.textContent = "A senha precisa ter pelo menos 6 caracteres.";
      campoSenha.focus();
      return;
    }
  }

  if (etapaAtual === 3) {
    const habs = document.querySelectorAll("#grupo-habilidades input:checked").length;
    const dias = document.querySelectorAll("#grupo-dias input:checked").length;
    if (habs === 0 || dias === 0) {
      feedback.textContent = "Selecione pelo menos 1 habilidade e 1 dia disponível.";
      return;
    }
  }

  mostrarEtapa(etapaAtual + 1);
});

// 3. Voltar etapa
btnAnterior.addEventListener("click", function () {
  if (etapaAtual > 1) {
    mostrarEtapa(etapaAtual - 1);
  }
});

// 4. Mostrar/ocultar senha e indicador de força em tempo real
togglePassword.addEventListener("click", function () {
  const senhaOculta = campoSenha.type === "password";
  campoSenha.type = senhaOculta ? "text" : "password";
  togglePassword.textContent = senhaOculta ? "Ocultar" : "Mostrar";
});

const textoForca = document.getElementById("forcaSenhaTexto");
campoSenha.addEventListener("input", function () {
  const v = campoSenha.value;
  if (v.length === 0) {
    textoForca.style.color = "#475569";
    textoForca.textContent = "Use pelo menos 6 caracteres (misture letras e números).";
  } else if (v.length < 6) {
    textoForca.style.color = "#dc2626";
    textoForca.textContent = "Força da senha: Fraca (mínimo 6 caracteres)";
  } else if (/[0-9]/.test(v) && /[a-zA-Z]/.test(v) && v.length >= 8) {
    textoForca.style.color = "#059669";
    textoForca.textContent = "Força da senha: Forte ✓";
  } else {
    textoForca.style.color = "#d97706";
    textoForca.textContent = "Força da senha: Média (adicione números para ficar forte)";
  }
});

// 5. Finalizar cadastro e salvar no Firebase Auth + Firestore (ou fallback local)
formCadastro.addEventListener("submit", async function (event) {
  event.preventDefault();
  feedback.style.color = "#b42318";

  if (!document.getElementById("aceite-lgpd").checked) {
    feedback.textContent = "Você precisa concordar com os Termos e LGPD para finalizar.";
    return;
  }

  const habilidadesSelecionadas = [];
  document.querySelectorAll("#grupo-habilidades input:checked").forEach(function (item) {
    habilidadesSelecionadas.push(item.value);
  });

  const diasSelecionados = [];
  document.querySelectorAll("#grupo-dias input:checked").forEach(function (item) {
    diasSelecionados.push(item.value);
  });

  const turnosSelecionados = [];
  document.querySelectorAll("#grupo-turnos input:checked").forEach(function (item) {
    turnosSelecionados.push(item.value);
  });

  const novoUsuario = {
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    senha: campoSenha.value,
    escolaridade: campoEscolaridade.value.trim(),
    dispositivo: campoDispositivo.value.trim(),
    idiomas: document.getElementById("idiomas").value.trim(),
    informatica: document.getElementById("informatica").value,
    turnos: turnosSelecionados.length > 0 ? turnosSelecionados : ["Noite"],
    formaPagamento: document.getElementById("formaPagamento").value,
    portfolio: document.getElementById("portfolioCadastro").value.trim(),
    habilidades: habilidadesSelecionadas,
    diasLivres: diasSelecionados,
    metaMensal: Number(campoMeta.value) || 1250
  };

  btnFinalizar.disabled = true;
  btnFinalizar.textContent = "Criando conta...";

  const resposta = await servicoCadastrarUsuario(novoUsuario);

  if (!resposta.sucesso) {
    btnFinalizar.disabled = false;
    btnFinalizar.textContent = "Finalizar Cadastro Gratuito ✓";
    feedback.textContent = resposta.mensagem;
    return;
  }

  feedback.style.color = "#059669";
  feedback.textContent = "Cadastro concluído com sucesso! Abrindo seu painel...";

  setTimeout(function () {
    window.location.href = "painel.html";
  }, 650);
});

// 6. Pré-preenche habilidades e dias caso o visitante tenha testado a Prévia do Match na Home
function aplicarPreviaMatchDaHome() {
  const texto = sessionStorage.getItem("conecta_previa_match");
  if (!texto) return;
  try {
    const previa = JSON.parse(texto);
    if (Array.isArray(previa.habilidades) && previa.habilidades.length > 0) {
      document.querySelectorAll("#grupo-habilidades input").forEach(function (cb) {
        cb.checked = previa.habilidades.includes(cb.value);
      });
    }
    if (Array.isArray(previa.dias) && previa.dias.length > 0) {
      document.querySelectorAll("#grupo-dias input").forEach(function (cb) {
        cb.checked = previa.dias.includes(cb.value);
      });
    }
  } catch (e) {}
}

aplicarPreviaMatchDaHome();
mostrarEtapa(1);
