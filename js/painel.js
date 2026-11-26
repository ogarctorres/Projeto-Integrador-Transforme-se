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

  // Calcula o nível de preenchimento do perfil (Tela 05 do Figma)
  let pontos = 55;
  if (usuarioAtual.habilidades.length >= 2) pontos += 15;
  if (usuarioAtual.habilidades.length >= 4) pontos += 10;
  if (usuarioAtual.diasLivres.length >= 2) pontos += 10;
  if (usuarioAtual.diasLivres.length >= 4) pontos += 10;
  const pctPerfil = Math.min(100, pontos);
  document.getElementById("perfilNivelBadge").textContent = "Perfil " + pctPerfil + "% completo";
  document.getElementById("perfilBarraFill").style.width = pctPerfil + "%";

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
    abrirPaginaDetalhesVaga(vaga);
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
    container.innerHTML =
      '<div class="empty-state-card">' +
        '<div class="empty-state-icon">🤍</div>' +
        '<h3>Nenhuma oportunidade salva ainda</h3>' +
        '<p>Clique no ícone de coração (♡) nas vagas que combinam com você para acessá-las rapidamente aqui.</p>' +
        '<button type="button" class="btn-azul" id="btnEmptyExplorar">Explorar Oportunidades →</button>' +
      '</div>';

    document.getElementById("btnEmptyExplorar").addEventListener("click", function () {
      abrirAbaPainel("sec-vagas");
    });
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
  const todasLidas = localStorage.getItem("conecta_notif_lidas") === "sim";
  const badge = document.getElementById("contNotif");

  badge.textContent = todasLidas ? "0" : String(NOTIFICACOES_PADRAO.length);
  badge.style.display = todasLidas ? "none" : "inline";
  container.innerHTML = "";

  NOTIFICACOES_PADRAO.forEach(function (n) {
    const div = document.createElement("div");
    div.className = "item-candidatura";
    div.style.opacity = todasLidas ? "0.75" : "1";
    div.innerHTML =
      "<div><strong>" + n.titulo + "</strong><br><small>" + n.texto + "</small></div>" +
      '<span class="tag-verde">' + (todasLidas ? "✓ Lida" : n.tempo) + '</span>';
    container.appendChild(div);
  });
}

document.getElementById("btnMarcarLidas").addEventListener("click", function () {
  localStorage.setItem("conecta_notif_lidas", "sim");
  renderizarNotificacoes();
});

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

// 4. PÁGINA COMPLETA DE DETALHES DA VAGA (03.1–03.3), CANDIDATURA (03.4) E SUCESSO (03.5)
let telaOrigemDetalhes = "sec-vagas";

function atualizarBotoesFavoritoDetalhe() {
  if (!vagaSelecionadaParaCandidatura) return;
  const favoritos = listarFavoritosDoUsuario(usuarioAtual.id);
  const salva = favoritos.some(function (f) {
    return f.oportunidadeId === vagaSelecionadaParaCandidatura.id;
  });

  const texto = salva ? "♥ Salva nos Favoritos" : "♡ Salvar nos Favoritos";
  document.getElementById("btnFavDetalheTopo").textContent = texto;
  document.getElementById("btnFavDetalheLateral").textContent = texto;
}

function abrirPaginaDetalhesVaga(vaga) {
  // Lembra de qual aba o usuário veio (Início, Oportunidades ou Favoritos)
  const ativa = document.querySelector(".painel-sec.active");
  if (ativa && ["sec-inicio", "sec-vagas", "sec-favoritos"].includes(ativa.id)) {
    telaOrigemDetalhes = ativa.id;
  }

  vagaSelecionadaParaCandidatura = vaga;

  document.getElementById("detTituloVaga").textContent = vaga.titulo;
  document.getElementById("detEmpresaVaga").textContent = vaga.empresa + " • ⭐ 4.9 (Contratante verificado)";
  document.getElementById("detDescricaoLonga").textContent =
    vaga.descricao + " Esta oportunidade foi estruturada especialmente para jovens estudantes conciliarem com a rotina escolar ou universitária.";

  // Badges da vaga
  document.getElementById("detBadgesRow").innerHTML =
    '<span class="tag-verde">✓ ' + vaga.compatibilidade + ' Compatível com seu perfil</span>' +
    '<span class="badge-info-azul">🏠 ' + vaga.formato + '</span>' +
    '<span class="badge-info-azul">⏱ ' + vaga.tempo + '</span>' +
    '<span class="badge-info-ambar">★ Esforço: ' + vaga.nivel + '</span>';

  // Checklist de entregas
  const entregas = vaga.entregas || [
    vaga.descricao,
    "Dedicação flexível: " + vaga.tempo + " (" + vaga.formato + ")",
    "Alinhamento direto pelo Chat do Conecta+"
  ];
  const boxEntregas = document.getElementById("detListaEntregas");
  boxEntregas.innerHTML = "";
  entregas.forEach(function (item) {
    const div = document.createElement("div");
    div.className = "entrega-item-card";
    div.innerHTML = '<span class="entrega-check">✓</span><span>' + item + '</span>';
    boxEntregas.appendChild(div);
  });

  // Tags de habilidades
  const boxTags = document.getElementById("detTagsHabilidades");
  boxTags.innerHTML = "";
  vaga.habilidades.forEach(function (hab) {
    const span = document.createElement("span");
    span.textContent = hab;
    boxTags.appendChild(span);
  });

  // Card lateral de remuneração e resumo
  document.getElementById("detValorVaga").textContent = vaga.valor;
  document.getElementById("detPagamentoVaga").textContent =
    "💰 " + (vaga.pagamento || "Pagamento combinado via PIX");
  document.getElementById("detFormatoInfo").textContent = vaga.formato;
  document.getElementById("detTempoInfo").textContent = vaga.tempo;
  document.getElementById("detNivelInfo").textContent = vaga.nivel;

  atualizarBotoesFavoritoDetalhe();
  abrirAbaPainel("sec-detalhe-vaga");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("btnVoltarDasDetalhes").addEventListener("click", function () {
  abrirAbaPainel(telaOrigemDetalhes);
});

function alternarFavNaTelaDetalhe() {
  if (!vagaSelecionadaParaCandidatura) return;
  alternarFavorito(usuarioAtual.id, vagaSelecionadaParaCandidatura.id);
  renderizarTudo();
  atualizarBotoesFavoritoDetalhe();
}

document.getElementById("btnFavDetalheTopo").addEventListener("click", alternarFavNaTelaDetalhe);
document.getElementById("btnFavDetalheLateral").addEventListener("click", alternarFavNaTelaDetalhe);

document.getElementById("btnIrChatDetalhe").addEventListener("click", function () {
  abrirAbaPainel("sec-candidaturas");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Abre a página do Formulário de Candidatura Rápida (Tela 03.4 do Figma)
document.getElementById("btnIrParaFormularioCand").addEventListener("click", function () {
  if (!vagaSelecionadaParaCandidatura) return;
  const v = vagaSelecionadaParaCandidatura;

  document.getElementById("formCandResumoVaga").innerHTML =
    "<strong>Vaga selecionada:</strong> " + v.titulo + "<br>" +
    "<small>" + v.empresa + " • " + v.valor + " • " + v.tempo + "</small>";

  document.getElementById("formCandDadosPerfil").textContent =
    usuarioAtual.nome + " (" + usuarioAtual.email + ") • Habilidades: " +
    usuarioAtual.habilidades.join(", ") + " • Dias: " + usuarioAtual.diasLivres.join(", ");

  document.getElementById("textoMensagemCand").value =
    "Olá! Tenho interesse na oportunidade de " + v.titulo +
    " e tenho disponibilidade nos dias: " + usuarioAtual.diasLivres.join(", ") + ".";
  document.getElementById("msgCandidatura").textContent = "";

  abrirAbaPainel("sec-candidatura-form");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Envia a candidatura e abre a página de Sucesso (Tela 03.5 do Figma)
document.getElementById("btnConfirmarCand").addEventListener("click", function () {
  if (!vagaSelecionadaParaCandidatura) return;
  const mensagem = document.getElementById("textoMensagemCand").value.trim();
  const resultado = salvarCandidatura(usuarioAtual.id, vagaSelecionadaParaCandidatura.id, mensagem);

  const msgEl = document.getElementById("msgCandidatura");
  if (!resultado.sucesso) {
    msgEl.style.color = "#b42318";
    msgEl.textContent = resultado.mensagem;
    return;
  }

  renderizarTudo();
  document.getElementById("sucessoTextoVaga").textContent =
    "Sua candidatura para '" + vagaSelecionadaParaCandidatura.titulo + "' na " +
    vagaSelecionadaParaCandidatura.empresa + " foi enviada com seu perfil do Conecta+!";
  document.getElementById("sucessoProtocolo").textContent =
    "Protocolo #CM-2026-0" + resultado.candidatura.id + " • Status: Enviada em " + resultado.candidatura.data;

  abrirAbaPainel("sec-candidatura-sucesso");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 5. Chat Direto simples com contratante (Tela 03.6 do Figma)
document.getElementById("btnEnviarChat").addEventListener("click", function () {
  const input = document.getElementById("inputChat");
  const texto = input.value.trim();
  if (texto === "") return;

  const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const box = document.getElementById("mensagensChat");
  const minhaMsg = document.createElement("div");
  minhaMsg.className = "msg-enviada";
  minhaMsg.innerHTML = "<strong>Você (" + hora + "):</strong> " + texto;
  box.appendChild(minhaMsg);

  input.value = "";
  box.scrollTop = box.scrollHeight;

  // Resposta simples automática para demonstração
  setTimeout(function () {
    const resp = document.createElement("div");
    resp.className = "msg-recebida";
    resp.innerHTML = "<strong>Ana Clara (" + hora + "):</strong> Perfeito! Combinado, vamos te enviar o briefing dos posts por aqui ainda hoje.";
    box.appendChild(resp);
    box.scrollTop = box.scrollHeight;
  }, 700);
});

document.getElementById("inputChat").addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    document.getElementById("btnEnviarChat").click();
  }
});

// Respostas rápidas clicáveis no Chat Direto
document.querySelectorAll(".quick-reply-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.getElementById("inputChat").value = btn.textContent;
    document.getElementById("btnEnviarChat").click();
  });
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

// 8. Leitor de Microtutoriais clicáveis no Dashboard (Início)
const MICROTUTORIAIS_PAINEL = [
  {
    titulo: "Como cobrar pelo seu 1º pacote de posts 💡",
    sub: "Monte pacotes simples e acessíveis para cafeterias, salões e comércios do bairro",
    passos: [
      "1. Ofereça um pacote fechado semanal (ex: 3 artes no Canva + 2 Reels curtos editados)",
      "2. Use templates reutilizáveis para produzir cada post em menos de 20 minutos",
      "3. Mostre ao lojista que o pacote custa menos de R$ 20 por dia e traz clientes novos"
    ],
    precos: [
      ["Pacote Básico (2 posts/sem)", "R$ 300/mês"],
      ["Pacote Local (3 posts + 2 Reels)", "R$ 550/mês"],
      ["Gestão Completa + Stories", "R$ 750/mês"]
    ],
    vagaId: 9
  },
  {
    titulo: "5 formas de monetizar organização no Notion 📘",
    sub: "Transforme sua organização de estudos em serviços rápidos e recorrentes",
    passos: [
      "1. Crie um painel universitário completo (provas, notas, leituras e TCC)",
      "2. Monte um calendário editorial simples para pequenos criadores de conteúdo",
      "3. Combine o template no Notion com formatação ABNT para aumentar seu valor por entrega"
    ],
    precos: [
      ["Template Estudantil Personalizado", "R$ 60/entrega"],
      ["Painel para Pequeno Negócio", "R$ 150/projeto"],
      ["Combo Organização + ABNT", "R$ 220/projeto"]
    ],
    vagaId: 4
  },
  {
    titulo: "Portfólio rápido mesmo sem clientes prévios 🚀",
    sub: "Conquiste sua primeira vaga criando 2 amostras demonstrativas hoje mesmo",
    passos: [
      "1. Escolha um comércio real do seu bairro e crie 2 artes ou 2 cortes demonstrativos",
      "2. Salve os arquivos organizados em uma pasta limpa no Google Drive",
      "3. Envie o link da pasta junto com sua candidatura em 1 clique no Conecta+"
    ],
    precos: [
      ["Semana Teste / Projeto Piloto", "R$ 120/sem"],
      ["Pacote Mensal Recorrente", "R$ 550/mês"],
      ["Combo Reels + Artes Feed", "R$ 700/mês"]
    ],
    vagaId: 1
  }
];

document.querySelectorAll("[data-micro]").forEach(function (card) {
  card.addEventListener("click", function () {
    const tut = MICROTUTORIAIS_PAINEL[Number(card.dataset.micro)];
    if (!tut) return;

    document.getElementById("microTituloPagina").textContent = tut.titulo;
    document.getElementById("microSubPagina").textContent = tut.sub;

    const passosEl = document.getElementById("microPassosLista");
    passosEl.innerHTML = "";
    tut.passos.forEach(function (p) {
      const div = document.createElement("div");
      div.className = "entrega-item-card";
      div.innerHTML = '<span class="entrega-check">✓</span><span>' + p + '</span>';
      passosEl.appendChild(div);
    });

    const precosEl = document.getElementById("microPrecosLista");
    precosEl.innerHTML = "";
    tut.precos.forEach(function (par) {
      const linha = document.createElement("div");
      linha.className = "resumo-linha";
      linha.innerHTML = "<span>" + par[0] + "</span><strong style='color:#047857;'>" + par[1] + "</strong>";
      precosEl.appendChild(linha);
    });

    document.getElementById("btnMicroVerVaga").onclick = function () {
      const vagaRel = listarOportunidades().find(function (v) { return v.id === tut.vagaId; });
      if (vagaRel) abrirPaginaDetalhesVaga(vagaRel);
    };

    abrirAbaPainel("sec-microtutorial");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

carregarDadosUsuario();
renderizarTudo();
