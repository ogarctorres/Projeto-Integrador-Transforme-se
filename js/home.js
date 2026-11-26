// =========================================================================
// SCRIPT DA PÁGINA INICIAL (HOME PÚBLICA) — CONECTA MAIS
// =========================================================================

const containerVagas = document.getElementById("jobs");
const tituloLista = document.getElementById("listTitle");
const subtituloLista = document.getElementById("listSubtitle");
const mensagemSemResultados = document.getElementById("noResults");
const inputBuscaCentral = document.getElementById("searchInput");
const inputBuscaTopo = document.getElementById("topSearch");
const botaoBuscar = document.getElementById("searchButton");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const botaoFecharModal = document.getElementById("closeModal");

let tipoAtual = "curtos";

const textosAbas = {
  curtos: {
    titulo: "Tarefas Curtas (Até 2h/dia)",
    subtitulo: "Atividades rápidas para encaixar na sua rotina e conquistar uma renda extra."
  },
  medios: {
    titulo: "Projetos Médios (Semanal)",
    subtitulo: "Projetos flexíveis de 5h a 6h por semana com pagamento rápido por entrega."
  },
  longos: {
    titulo: "Projetos Longos (Mensal)",
    subtitulo: "Oportunidades recorrentes para garantir uma renda mensal fixa no contraturno."
  }
};

// 1. Se já existir usuário logado, mostra "Meu Painel" + botão "Sair" no topo
function atualizarBotoesCabecalho() {
  const usuario = pegarUsuarioLogado();
  const areaBotoes = document.getElementById("headerButtons");

  if (usuario) {
    areaBotoes.innerHTML =
      '<a class="btn-link login" href="pages/painel.html">Meu Painel (' + usuario.nome.split(" ")[0] + ')</a>' +
      '<button type="button" class="btn-link logout-mini" id="btnSairHome">Sair</button>';

    document.getElementById("btnSairHome").addEventListener("click", function () {
      sairDaConta();
      areaBotoes.innerHTML =
        '<a class="btn-link login" href="pages/login.html">Entrar</a>' +
        '<a class="btn-link register" href="pages/cadastro.html">Cadastre-se</a>';
    });
  } else {
    areaBotoes.innerHTML =
      '<a class="btn-link login" href="pages/login.html">Entrar</a>' +
      '<a class="btn-link register" href="pages/cadastro.html">Cadastre-se</a>';
  }
}

// 2. Mostra os cards de oportunidades da aba selecionada
function mostrarOportunidades() {
  const todasAsVagas = listarOportunidades();
  const textoBusca = inputBuscaCentral.value.trim().toLowerCase();

  containerVagas.innerHTML = "";
  let quantidadeMostrada = 0;

  todasAsVagas.forEach(function (vaga) {
    const mesmoTipo = vaga.tipo === tipoAtual;
    const textoCompleto = (
      vaga.titulo + " " +
      vaga.empresa + " " +
      vaga.descricao + " " +
      vaga.habilidades.join(" ")
    ).toLowerCase();

    const bateComBusca = textoBusca === "" || textoCompleto.includes(textoBusca);

    if (mesmoTipo && bateComBusca) {
      quantidadeMostrada++;

      const card = document.createElement("article");
      card.className = "job";

      let tagsHtml = "";
      vaga.habilidades.forEach(function (hab) {
        tagsHtml += "<span>" + hab + "</span>";
      });

      card.innerHTML =
        '<div class="job-art ' + vaga.corFundo + '">' +
          '<span class="pill green">✓ ' + vaga.compatibilidade + ' Match</span>' +
          '<span class="pill dark">' + vaga.tempo + '</span>' +
          '<strong>' + vaga.valor + '</strong>' +
        '</div>' +
        '<h3>' + vaga.titulo + '</h3>' +
        '<div class="job-company">' + vaga.empresa + ' • ' + vaga.formato + '</div>' +
        '<p>' + vaga.descricao + '</p>' +
        '<div class="tags">' + tagsHtml + '</div>' +
        '<button class="apply" type="button">Ver Projeto / Aplicar →</button>';

      card.querySelector(".apply").addEventListener("click", function () {
        abrirModalVaga(vaga);
      });

      containerVagas.appendChild(card);
    }
  });

  mensagemSemResultados.hidden = quantidadeMostrada > 0;
}

// 3. Modal de Prévia da Vaga (Tela 001 do Figma)
function abrirModalVaga(vaga) {
  const usuario = pegarUsuarioLogado();

  let botoesModal = "";
  if (usuario) {
    botoesModal = '<a class="login" href="pages/painel.html">Abrir no Meu Painel →</a>';
  } else {
    botoesModal =
      '<a class="login" href="pages/login.html">Entrar para Aplicar →</a>' +
      '<a class="register" href="pages/cadastro.html">Criar Conta Grátis</a>';
  }

  modalBody.innerHTML =
    "<h2>" + vaga.titulo + "</h2>" +
    "<p><strong>Empresa:</strong> " + vaga.empresa + " (" + vaga.formato + ")</p>" +
    "<p>" + vaga.descricao + "</p>" +
    '<div class="modal-info-box">' +
      "<strong>Valor estimado:</strong> " + vaga.valor + "<br>" +
      "<strong>Compatibilidade:</strong> " + vaga.compatibilidade + " • <strong>Tempo:</strong> " + vaga.tempo +
    "</div>" +
    "<p>Faça login ou crie sua conta gratuita no <strong>Conecta+</strong> para se candidatar em 1 clique.</p>" +
    '<div class="modal-actions">' + botoesModal + "</div>";

  modal.showModal();
}

// 4. Trocar as abas (Projetos Longos | Médios | Tarefas Curtas)
const botoesAbas = document.querySelectorAll(".tab");
botoesAbas.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesAbas.forEach(function (b) { b.classList.remove("active"); });
    botao.classList.add("active");

    tipoAtual = botao.dataset.type;
    tituloLista.textContent = textosAbas[tipoAtual].titulo;
    subtituloLista.textContent = textosAbas[tipoAtual].subtitulo;

    mostrarOportunidades();
  });
});

// 5. Busca central e busca do topo
botaoBuscar.addEventListener("click", mostrarOportunidades);
inputBuscaCentral.addEventListener("input", mostrarOportunidades);

inputBuscaTopo.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    inputBuscaCentral.value = inputBuscaTopo.value;
    document.getElementById("oportunidades").scrollIntoView({ behavior: "smooth" });
    mostrarOportunidades();
  }
});

// 6. Rolar para a prévia de habilidades e horários
document.getElementById("filterButton").addEventListener("click", function () {
  document.getElementById("habilidades").scrollIntoView({ behavior: "smooth" });
});

// 7. Atualizar texto do Match na prévia (com singular e plural corretos)
function atualizarResumoMatch() {
  const qtdHabilidades = document.querySelectorAll("#previewSkills input:checked").length;
  const qtdDias = document.querySelectorAll("#previewDays input:checked").length;
  const textoHab = qtdHabilidades === 1 ? "habilidade" : "habilidades";
  const textoDia = qtdDias === 1 ? "dia selecionado" : "dias selecionados";

  document.getElementById("matchResumoTexto").textContent =
    "✓ " + qtdHabilidades + " " + textoHab + " e " + qtdDias + " " + textoDia + " — perfeito para vagas no contraturno!";
}

document.querySelectorAll("#previewSkills input, #previewDays input").forEach(function (cb) {
  cb.addEventListener("change", atualizarResumoMatch);
});

// 8. Simulador de renda (6h, 12h, 18h — fiel ao Figma)
const ganhosPorHora = {
  6: 480,
  12: 850,
  18: 1320
};

const botoesHoras = document.querySelectorAll("[data-hours]");
botoesHoras.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesHoras.forEach(function (b) { b.classList.remove("selected"); });
    botao.classList.add("selected");

    const valorEstimado = ganhosPorHora[botao.dataset.hours];
    document.getElementById("estimate").innerHTML =
      "R$ " + valorEstimado.toLocaleString("pt-BR") + " <small>/ mês</small>";
  });
});

// 9. Microtutoriais clicáveis
const conteudosDicas = [
  {
    titulo: "Como cobrar pelo 1º pacote de posts",
    texto: "Ofereça um pacote simples para comércios do bairro (3 artes no Canva + 2 Reels curtos por semana) cobrando entre R$ 350 e R$ 550 por mês."
  },
  {
    titulo: "5 formas de monetizar o Notion",
    texto: "Crie e venda: 1) Painel universitário, 2) Controle financeiro, 3) Calendário de posts, 4) Organizador de vestibular e 5) Gestão de tarefas para pequenas lojas."
  },
  {
    titulo: "Portfólio rápido sem clientes prévios",
    texto: "Escolha 2 negócios do bairro, crie amostras demonstrativas de posts ou cortes de vídeo e salve tudo em uma pasta organizada no Google Drive."
  }
];

document.querySelectorAll(".tip-card").forEach(function (card) {
  card.addEventListener("click", function () {
    const dica = conteudosDicas[Number(card.dataset.tip)];
    modalBody.innerHTML =
      "<h2>" + dica.titulo + "</h2>" +
      "<p>" + dica.texto + "</p>" +
      '<div class="modal-actions">' +
        '<a class="login" href="pages/cadastro.html">Criar Conta Grátis →</a>' +
      "</div>";
    modal.showModal();
  });
});

// 10. Fechar modal (no X ou clicando fora) e menu mobile
botaoFecharModal.addEventListener("click", function () { modal.close(); });

modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    modal.close();
  }
});

document.getElementById("mobileMenu").addEventListener("click", function () {
  document.getElementById("nav").classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(function (link) {
  link.addEventListener("click", function () {
    document.getElementById("nav").classList.remove("open");
  });
});

atualizarBotoesCabecalho();
mostrarOportunidades();
atualizarResumoMatch();
