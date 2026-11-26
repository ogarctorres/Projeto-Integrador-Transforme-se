// =========================================================================
// SCRIPT DA ÁREA LOGADA (PAINEL DO USUÁRIO) — CONECTA MAIS (CONECTA+)
// =========================================================================

const usuarioAtual = pegarUsuarioLogado();

// Se não estiver logado, volta para o Login
if (!usuarioAtual) {
  window.location.href = "login.html";
}

let vagaSelecionadaParaCandidatura = null;
let filtroAtivoPainel = "todas";

// 1. Preenche cabeçalho, iniciais, saudação, barra da meta e dados do perfil
function carregarDadosUsuario() {
  const partes = usuarioAtual.nome.trim().split(" ");
  const primeiroNome = partes[0];
  const iniciais = partes.slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join("");

  document.getElementById("badgeNomeUsuario").textContent = primeiroNome;
  document.getElementById("avatarIniciais").textContent = iniciais;
  document.getElementById("avatarGrande").textContent = iniciais;
  document.getElementById("saudacaoUsuario").textContent = "Olá, " + primeiroNome + "! 👋";
  document.getElementById("resumoRotina").textContent =
    "Pronto para turbinar sua renda extra hoje? Você tem " + listarOportunidades().length + " oportunidades compatíveis.";

  const meta = Number(usuarioAtual.metaMensal) || 1250;
  const porcentagem = Math.min(100, Math.round((850 / meta) * 100));
  document.getElementById("badgePorcentagemMeta").textContent = "Meta " + porcentagem + "%";
  document.getElementById("barraMetaFill").style.width = porcentagem + "%";
  document.getElementById("metaValorTexto").textContent =
    "Meta definida: R$ " + meta.toLocaleString("pt-BR") + "/mês • Média de R$ 35 a R$ 55/hora";

  document.getElementById("perfilNome").textContent = usuarioAtual.nome;
  document.getElementById("perfilEmail").textContent = usuarioAtual.email;
  document.getElementById("perfilEscolaridade").textContent = usuarioAtual.escolaridade || "Estudante";
  document.getElementById("perfilDispositivo").textContent = usuarioAtual.dispositivo || "Celular / Notebook";
  document.getElementById("novaMetaInput").value = meta;

  renderizarEditoresPerfil();
}

// Renderiza os botões clicáveis de habilidades e dias em "Meu Perfil" (Tela 05 do Figma)
const TODAS_HABILIDADES_OPCOES = ["Edição de vídeo", "Redes sociais", "Canva", "Notion", "ABNT", "Organização", "Atendimento", "Suporte"];
const TODOS_DIAS_OPCOES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function renderizarEditoresPerfil() {
  const boxHabs = document.getElementById("perfilEditarHabilidades");
  const boxDias = document.getElementById("perfilEditarDias");

  boxHabs.innerHTML = "";
  TODAS_HABILIDADES_OPCOES.forEach(function (hab) {
    const marcada = usuarioAtual.habilidades.includes(hab);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-toggle" + (marcada ? " ativa" : "");
    btn.textContent = (marcada ? "✓ " : "+ ") + hab;

    btn.addEventListener("click", function () {
      const idx = usuarioAtual.habilidades.indexOf(hab);
      if (idx >= 0) {
        usuarioAtual.habilidades.splice(idx, 1);
      } else {
        usuarioAtual.habilidades.push(hab);
      }
      renderizarEditoresPerfil();
    });
    boxHabs.appendChild(btn);
  });

  boxDias.innerHTML = "";
  TODOS_DIAS_OPCOES.forEach(function (dia) {
    const marcado = usuarioAtual.diasLivres.includes(dia);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-toggle" + (marcado ? " dia-ativo" : "");
    btn.textContent = (marcado ? "✓ " : "") + dia;

    btn.addEventListener("click", function () {
      const idx = usuarioAtual.diasLivres.indexOf(dia);
      if (idx >= 0) {
        usuarioAtual.diasLivres.splice(idx, 1);
      } else {
        usuarioAtual.diasLivres.push(dia);
      }
      renderizarEditoresPerfil();
    });
    boxDias.appendChild(btn);
  });
}

// Função auxiliar para trocar de aba
function abrirAbaPainel(idSecao) {
  document.querySelectorAll(".menu-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.sec === idSecao);
  });
  document.querySelectorAll(".painel-sec").forEach(function (s) {
    s.classList.toggle("active", s.id === idSecao);
  });
}

// Botões de ação rápida, sino de alertas e chip do usuário no topo
document.querySelectorAll("[data-go]").forEach(function (btn) {
  btn.addEventListener("click", function () { abrirAbaPainel(btn.dataset.go); });
});
document.getElementById("btnAbrirAlertas").addEventListener("click", function () {
  abrirAbaPainel("sec-notificacoes");
});
document.getElementById("btnAbrirPerfilTopo").addEventListener("click", function () {
  abrirAbaPainel("sec-perfil");
});
document.getElementById("btnAbrirSimuladorTopo").addEventListener("click", function () {
  abrirAbaPainel("sec-financeiro");
});
document.getElementById("cardMetaFinanceiro").addEventListener("click", function () {
  abrirAbaPainel("sec-financeiro");
});

// Simulador Financeiro Interativo (Tela 02.1 do Figma)
function calcularSimuladorPainel() {
  let somaValor = 0;
  let somaHoras = 0;

  document.querySelectorAll("#listaSimuladorPainel input:checked").forEach(function (item) {
    somaValor += Number(item.value);
    somaHoras += Number(item.dataset.horas);
  });

  document.getElementById("simTotalReais").innerHTML =
    "R$ " + somaValor.toLocaleString("pt-BR") + ",00 <small>/ mês</small>";
  document.getElementById("simTotalHoras").textContent =
    "Carga semanal estimada: " + somaHoras + "h / semana";

  return somaValor;
}

document.querySelectorAll("#listaSimuladorPainel input").forEach(function (cb) {
  cb.addEventListener("change", calcularSimuladorPainel);
});

document.getElementById("btnAplicarMetaSimulada").addEventListener("click", function () {
  const total = calcularSimuladorPainel();
  if (total > 0) {
    usuarioAtual.metaMensal = total;
    atualizarUsuarioLogado(usuarioAtual);
    carregarDadosUsuario();
    document.getElementById("msgSimulador").textContent = "Meta atualizada para R$ " + total.toLocaleString("pt-BR") + "/mês! ✓";
  }
});

// 2. Cria um card de vaga
function criarCardVaga(vaga) {
  const favoritos = listarFavoritosDoUsuario(usuarioAtual.id);
  const estaFavoritada = favoritos.some(function (f) {
    return f.oportunidadeId === vaga.id;
  });

  const card = document.createElement("article");
  card.className = "vaga-card";

  let tagsHtml = "";
  vaga.habilidades.forEach(function (hab) {
    tagsHtml += "<span>" + hab + "</span>";
  });

  card.innerHTML =
    '<div class="vaga-topo">' +
      '<span class="tag-verde">✓ ' + vaga.compatibilidade + ' • ' + vaga.tempo + '</span>' +
      '<button class="btn-fav ' + (estaFavoritada ? "salvo" : "") + '" title="Favoritar">' +
        (estaFavoritada ? "♥" : "♡") +
      '</button>' +
    '</div>' +
    '<h3>' + vaga.titulo + '</h3>' +
    '<div class="vaga-empresa">' + vaga.empresa + ' • ' + vaga.formato + '</div>' +
    '<p class="vaga-desc">' + vaga.descricao + '</p>' +
    '<div class="vaga-tags">' + tagsHtml + '</div>' +
    '<div class="vaga-rodape">' +
      '<div class="vaga-preco-box">' +
        '<small>Retorno estimado</small>' +
        '<div class="vaga-valor">' + vaga.valor + '</div>' +
      '</div>' +
      '<button class="btn-azul btn-candidatar" type="button">Ver Detalhes →</button>' +
    '</div>';

  card.querySelector(".btn-fav").addEventListener("click", function () {
    alternarFavorito(usuarioAtual.id, vaga.id);
    renderizarTudo();
  });

  card.querySelector(".btn-candidatar").addEventListener("click", function () {
    abrirModalCandidatura(vaga);
  });

  return card;
}

// 3. Renderiza vagas, favoritos, candidaturas e notificações
function renderizarVagas() {
  const container = document.getElementById("listaVagasPainel");
  const busca = document.getElementById("buscaPainel").value.trim().toLowerCase();
  const vagas = listarOportunidades();

  container.innerHTML = "";
  let totalMostrado = 0;

  vagas.forEach(function (vaga) {
    const texto = (vaga.titulo + " " + vaga.empresa + " " + vaga.habilidades.join(" ")).toLowerCase();
    const bateBusca = busca === "" || texto.includes(busca);

    let bateFiltro = true;
    if (filtroAtivoPainel === "match95") {
      bateFiltro = parseInt(vaga.compatibilidade, 10) >= 95;
    } else if (filtroAtivoPainel === "remoto") {
      bateFiltro = vaga.formato === "Remoto";
    } else if (filtroAtivoPainel === "curto") {
      bateFiltro = vaga.tipo === "curtos";
    }

    if (bateBusca && bateFiltro) {
      totalMostrado++;
      container.appendChild(criarCardVaga(vaga));
    }
  });

  if (totalMostrado === 0) {
    container.innerHTML = '<div class="vazio-box">Nenhuma vaga encontrada com esse filtro.</div>';
  }
}

// Clique nos chips de filtro rápido
document.querySelectorAll(".chip-filtro").forEach(function (chip) {
  chip.addEventListener("click", function () {
    document.querySelectorAll(".chip-filtro").forEach(function (c) { c.classList.remove("active"); });
    chip.classList.add("active");
    filtroAtivoPainel = chip.dataset.filtro;
    renderizarVagas();
  });
});

function renderizarFavoritos() {
  const container = document.getElementById("listaFavoritosPainel");
  const favoritos = listarFavoritosDoUsuario(usuarioAtual.id);
  const todasVagas = listarOportunidades();

  document.getElementById("contFav").textContent = favoritos.length;
  container.innerHTML = "";

  if (favoritos.length === 0) {
    container.innerHTML = '<div class="vazio-box">Você ainda não salvou favoritos. Clique no coração (♡) em qualquer vaga!</div>';
    return;
  }

  favoritos.forEach(function (fav) {
    const vaga = todasVagas.find(function (v) { return v.id === fav.oportunidadeId; });
    if (vaga) container.appendChild(criarCardVaga(vaga));
  });
}

function renderizarCandidaturas() {
  const container = document.getElementById("listaCandidaturasPainel");
  const candidaturas = listarCandidaturasDoUsuario(usuarioAtual.id);
  const todasVagas = listarOportunidades();

  document.getElementById("contCand").textContent = candidaturas.length;
  container.innerHTML = "";

  if (candidaturas.length === 0) {
    container.innerHTML = '<div class="vazio-box">Nenhuma candidatura enviada ainda. Escolha uma oportunidade e candidate-se!</div>';
    return;
  }

  candidaturas.forEach(function (cand) {
    const vaga = todasVagas.find(function (v) { return v.id === cand.oportunidadeId; });
    if (!vaga) return;

    const item = document.createElement("div");
    item.className = "item-candidatura";
    item.innerHTML =
      "<div>" +
        "<strong>" + vaga.titulo + "</strong> — " + vaga.empresa + "<br>" +
        "<small>Enviada em " + cand.data + " • Mensagem: \"" + cand.mensagem + "\"</small>" +
      "</div>" +
      '<span class="tag-verde">✓ ' + cand.status + '</span>';

    container.appendChild(item);
  });
}

function renderizarNotificacoes() {
  const container = document.getElementById("listaNotificacoesPainel");
  document.getElementById("contNotif").textContent = NOTIFICACOES_PADRAO.length;
  container.innerHTML = "";

  NOTIFICACOES_PADRAO.forEach(function (n) {
    const div = document.createElement("div");
    div.className = "item-candidatura";
    div.innerHTML =
      "<div><strong>" + n.titulo + "</strong><br><small>" + n.texto + "</small></div>" +
      '<span class="tag-verde">' + n.tempo + '</span>';
    container.appendChild(div);
  });
}

// Renderiza apenas as Top 3 sugestões na aba Início (Tela 02 do Figma)
function renderizarTop3Inicio() {
  const container = document.getElementById("listaTop3Inicio");
  if (!container) return;

  const vagas = listarOportunidades();
  // Destaca as 3 principais vagas do Figma: Social Media (9), Formatação ABNT (2) e Suporte WhatsApp (5)
  const idsDestaque = [9, 2, 5];
  const selecionadas = idsDestaque
    .map(function (id) { return vagas.find(function (v) { return v.id === id; }); })
    .filter(Boolean);

  container.innerHTML = "";
  selecionadas.forEach(function (vaga) {
    container.appendChild(criarCardVaga(vaga));
  });
}

function renderizarTudo() {
  renderizarTop3Inicio();
  renderizarVagas();
  renderizarFavoritos();
  renderizarCandidaturas();
  renderizarNotificacoes();
}

// 4. Modal de candidatura em 1 clique
const modalCand = document.getElementById("modalCandidatura");

function abrirModalCandidatura(vaga) {
  vagaSelecionadaParaCandidatura = vaga;
  document.getElementById("candBadgeMatch").textContent = "✓ " + vaga.compatibilidade + " Compatível • " + vaga.formato;
  document.getElementById("candTituloVaga").textContent = vaga.titulo;
  document.getElementById("candEmpresaVaga").textContent = vaga.empresa + " • " + vaga.valor;
  document.getElementById("candPagamentoInfo").textContent =
    "💰 " + (vaga.pagamento || "Pagamento combinado via PIX • " + vaga.tempo);

  const listaEntregas = document.getElementById("candListaEntregas");
  const entregas = vaga.entregas || [
    vaga.descricao,
    "Dedicação estimada: " + vaga.tempo + " (" + vaga.formato + ")",
    "Comunicação direta pelo Chat do Conecta+"
  ];
  listaEntregas.innerHTML = "";
  entregas.forEach(function (item) {
    const li = document.createElement("li");
    li.textContent = item;
    listaEntregas.appendChild(li);
  });

  document.getElementById("textoMensagemCand").value =
    "Olá! Tenho interesse nesta oportunidade e disponibilidade nos dias: " + usuarioAtual.diasLivres.join(", ") + ".";
  document.getElementById("msgCandidatura").textContent = "";
  modalCand.showModal();
}

document.getElementById("fecharModalCand").addEventListener("click", function () {
  modalCand.close();
});

document.getElementById("btnConfirmarCand").addEventListener("click", function () {
  const mensagem = document.getElementById("textoMensagemCand").value.trim();
  const resultado = salvarCandidatura(usuarioAtual.id, vagaSelecionadaParaCandidatura.id, mensagem);

  const msgEl = document.getElementById("msgCandidatura");
  if (!resultado.sucesso) {
    msgEl.style.color = "#b42318";
    msgEl.textContent = resultado.mensagem;
    return;
  }

  msgEl.style.color = "#079b6b";
  msgEl.textContent = "Candidatura enviada com sucesso! ✓";
  renderizarTudo();

  setTimeout(function () { modalCand.close(); }, 800);
});

// 5. Chat Direto simples com contratante (Tela 03.6 do Figma)
document.getElementById("btnEnviarChat").addEventListener("click", function () {
  const input = document.getElementById("inputChat");
  const texto = input.value.trim();
  if (texto === "") return;

  const box = document.getElementById("mensagensChat");
  const minhaMsg = document.createElement("div");
  minhaMsg.className = "msg-enviada";
  minhaMsg.innerHTML = "<strong>Você:</strong> " + texto;
  box.appendChild(minhaMsg);

  input.value = "";

  // Resposta simples automática para demonstração
  setTimeout(function () {
    const resp = document.createElement("div");
    resp.className = "msg-recebida";
    resp.innerHTML = "<strong>Ana Clara:</strong> Perfeito! Combinado, vamos te enviar o briefing dos posts por aqui ainda hoje.";
    box.appendChild(resp);
  }, 700);
});

// 6. Troca de abas do menu
const botoesMenu = document.querySelectorAll(".menu-btn");
botoesMenu.forEach(function (btn) {
  btn.addEventListener("click", function () {
    botoesMenu.forEach(function (b) { b.classList.remove("active"); });
    document.querySelectorAll(".painel-sec").forEach(function (s) { s.classList.remove("active"); });

    btn.classList.add("active");
    document.getElementById(btn.dataset.sec).classList.add("active");
  });
});

// 7. Busca, salvar meta e sair (volta para ../index.html)
document.getElementById("buscaPainel").addEventListener("input", renderizarVagas);

document.getElementById("btnSalvarMeta").addEventListener("click", function () {
  const novaMeta = Number(document.getElementById("novaMetaInput").value);
  if (novaMeta >= 100) {
    usuarioAtual.metaMensal = novaMeta;
    atualizarUsuarioLogado(usuarioAtual);
    carregarDadosUsuario();
    document.getElementById("msgPerfil").textContent = "Perfil, habilidades, dias e meta salvos com sucesso! ✓";
  }
});

document.getElementById("btnSair").addEventListener("click", function () {
  sairDaConta();
  window.location.href = "../index.html";
});

carregarDadosUsuario();
renderizarTudo();
