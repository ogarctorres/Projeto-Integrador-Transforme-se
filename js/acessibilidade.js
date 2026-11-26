// =========================================================================
// ACESSIBILIDADE (WCAG 2.1) — CONECTA MAIS (CONECTA+)
// Recursos incluídos:
// 1) Widget oficial do VLibras (tradução para Libras)
// 2) Botões flutuantes para Aumentar/Diminuir Fonte (A+ / A-)
// 3) Modo Alto Contraste (salvo no navegador)
// =========================================================================

(function iniciarAcessibilidade() {
  // 1. Injeta o CSS da barra de acessibilidade e do modo Alto Contraste
  const estilo = document.createElement("style");
  estilo.textContent =
    ".a11y-bar {" +
      "position: fixed; left: 16px; bottom: 16px; z-index: 999;" +
      "display: flex; align-items: center; gap: 6px;" +
      "background: #0f172a; color: #ffffff; padding: 7px 10px;" +
      "border-radius: 99px; box-shadow: 0 8px 24px rgba(15,23,42,0.28);" +
      "font-family: 'Inter', Arial, sans-serif; font-size: 12px;" +
    "}" +
    ".a11y-btn {" +
      "border: 1px solid #334155; background: #1e293b; color: #ffffff;" +
      "border-radius: 99px; padding: 5px 10px; font-size: 12px; font-weight: 700; cursor: pointer;" +
    "}" +
    ".a11y-btn:hover { background: #2563eb; border-color: #60a5fa; }" +
    "@media (max-width: 600px) {" +
      ".a11y-bar { left: 10px; bottom: 10px; padding: 5px 8px; gap: 4px; }" +
      ".a11y-btn { padding: 4px 8px; font-size: 11px; }" +
    "}" +
    "body.alto-contraste { background: #000000 !important; color: #ffffff !important; }" +
    "body.alto-contraste header, body.alto-contraste .header, body.alto-contraste .top-bar," +
    "body.alto-contraste .job, body.alto-contraste .vaga-card, body.alto-contraste .auth-card," +
    "body.alto-contraste .welcome-card, body.alto-contraste .perfil-box, body.alto-contraste .match-card," +
    "body.alto-contraste .match-grid, body.alto-contraste .search-box, body.alto-contraste .partner-item," +
    "body.alto-contraste .item-candidatura, body.alto-contraste .micro-card, body.alto-contraste .tips article {" +
      "background: #111111 !important; color: #ffffff !important; border: 2px solid #ffd04b !important;" +
    "}" +
    "body.alto-contraste a, body.alto-contraste h1, body.alto-contraste h2, body.alto-contraste h3," +
    "body.alto-contraste p, body.alto-contraste small, body.alto-contraste label, body.alto-contraste span {" +
      "color: #ffffff !important;" +
    "}" +
    "body.alto-contraste .btn-primary, body.alto-contraste .apply, body.alto-contraste .btn-azul," +
    "body.alto-contraste .login, body.alto-contraste .btn-verde {" +
      "background: #ffd04b !important; color: #000000 !important; border: 2px solid #ffffff !important;" +
    "}";
  document.head.appendChild(estilo);

  // 2. Cria a barra discreta no canto inferior esquerdo
  const barra = document.createElement("div");
  barra.className = "a11y-bar";
  barra.setAttribute("role", "region");
  barra.setAttribute("aria-label", "Controles de acessibilidade");
  barra.innerHTML =
    '<span title="Acessibilidade">♿</span>' +
    '<button type="button" class="a11y-btn" id="a11yDiminuir" title="Diminuir fonte">A-</button>' +
    '<button type="button" class="a11y-btn" id="a11yAumentar" title="Aumentar fonte">A+</button>' +
    '<button type="button" class="a11y-btn" id="a11yContraste" title="Alternar Alto Contraste">Contraste</button>';
  document.body.appendChild(barra);

  // 3. Controle de tamanho de fonte (escala entre 90% e 120%)
  let escalaFonte = Number(localStorage.getItem("conecta_fonte_escala")) || 100;
  function aplicarFonte() {
    document.documentElement.style.fontSize = escalaFonte + "%";
    localStorage.setItem("conecta_fonte_escala", String(escalaFonte));
  }
  aplicarFonte();

  document.getElementById("a11yAumentar").addEventListener("click", function () {
    if (escalaFonte < 120) {
      escalaFonte += 10;
      aplicarFonte();
    }
  });

  document.getElementById("a11yDiminuir").addEventListener("click", function () {
    if (escalaFonte > 90) {
      escalaFonte -= 10;
      aplicarFonte();
    }
  });

  // 4. Controle de Alto Contraste
  if (localStorage.getItem("conecta_alto_contraste") === "sim") {
    document.body.classList.add("alto-contraste");
  }

  document.getElementById("a11yContraste").addEventListener("click", function () {
    document.body.classList.toggle("alto-contraste");
    const ativo = document.body.classList.contains("alto-contraste");
    localStorage.setItem("conecta_alto_contraste", ativo ? "sim" : "nao");
  });

  // 5. Widget Oficial do VLibras (Governo Federal - Libras)
  const vwDiv = document.createElement("div");
  vwDiv.setAttribute("vw", "");
  vwDiv.className = "enabled";
  vwDiv.innerHTML =
    '<div vw-access-button class="active"></div>' +
    '<div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
  document.body.appendChild(vwDiv);

  const scriptVLibras = document.createElement("script");
  scriptVLibras.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  scriptVLibras.onload = function () {
    if (window.VLibras) {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    }
  };
  document.body.appendChild(scriptVLibras);
})();
