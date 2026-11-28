// =========================================================================
// GERADOR DE VARIÁVEIS DO FIREBASE (.env / VERCEL -> js/firebase-env.js)
// =========================================================================
// Como HTML/JS puro no navegador não lê arquivos ".env" diretamente,
// este script lê o ".env" (no seu PC) ou as Environment Variables (no Vercel)
// e gera o arquivo "js/firebase-env.js" na hora do deploy.
// Assim suas chaves reais NUNCA ficam expostas no GitHub!
// =========================================================================

const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const caminhoEnv = path.join(raiz, ".env");
const caminhoSaida = path.join(raiz, "js", "firebase-env.js");

// Lê o arquivo .env local se ele existir (no Vercel ele usa process.env)
const varsLocal = {};
if (fs.existsSync(caminhoEnv)) {
  const linhas = fs.readFileSync(caminhoEnv, "utf-8").split(/\r?\n/);
  linhas.forEach(function (linha) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith("#")) return;
    const idx = limpa.indexOf("=");
    if (idx > 0) {
      const chave = limpa.slice(0, idx).trim();
      const valor = limpa.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      varsLocal[chave] = valor;
    }
  });
}

function pegarVar(nome) {
  return process.env[nome] || varsLocal[nome] || "";
}

const config = {
  apiKey: pegarVar("FIREBASE_API_KEY"),
  authDomain: pegarVar("FIREBASE_AUTH_DOMAIN"),
  projectId: pegarVar("FIREBASE_PROJECT_ID"),
  storageBucket: pegarVar("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: pegarVar("FIREBASE_MESSAGING_SENDER_ID"),
  appId: pegarVar("FIREBASE_APP_ID")
};

const conteudoJs =
  "// Arquivo gerado automaticamente por scripts/gerar-env.js (ignorado pelo Git)\n" +
  "window.__FIREBASE_ENV__ = " + JSON.stringify(config, null, 2) + ";\n";

fs.writeFileSync(caminhoSaida, conteudoJs, "utf-8");
console.log("js/firebase-env.js gerado com sucesso!");
