// =========================================================================
// CONFIGURAÇÃO DO FIREBASE — CONECTA MAIS (CONECTA+)
// =========================================================================
// As chaves do Firebase NÃO ficam escritas aqui (para não irem ao GitHub!).
// Elas são carregadas automaticamente do arquivo "js/firebase-env.js",
// que é gerado a partir do ".env" (local) ou das Environment Variables (Vercel)
// pelo script "scripts/gerar-env.js".
//
// Passo a passo completo no arquivo FIREBASE_GUIA.md!
// Enquanto as chaves não estiverem preenchidas, o site funciona normalmente
// no Modo Demonstração Local (localStorage) sem quebrar nenhuma página.
// =========================================================================

const ENV_FIREBASE = window.__FIREBASE_ENV__ || {};

const FIREBASE_CONFIG = {
  apiKey: ENV_FIREBASE.apiKey || "",
  authDomain: ENV_FIREBASE.authDomain || "",
  projectId: ENV_FIREBASE.projectId || "",
  storageBucket: ENV_FIREBASE.storageBucket || "",
  messagingSenderId: ENV_FIREBASE.messagingSenderId || "",
  appId: ENV_FIREBASE.appId || ""
};

// Verifica se o Firebase SDK foi carregado e se as chaves reais já foram preenchidas
function firebaseEstaConfigurado() {
  const sdkCarregado = typeof window.firebase !== "undefined";
  const apiValida =
    Boolean(FIREBASE_CONFIG.apiKey) &&
    !FIREBASE_CONFIG.apiKey.startsWith("COLE_SUA_");
  const projetoValido =
    Boolean(FIREBASE_CONFIG.projectId) &&
    FIREBASE_CONFIG.projectId !== "SEU_PROJETO";

  return sdkCarregado && apiValida && projetoValido;
}

// Inicializa o Firebase somente se as chaves reais estiverem configuradas
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

if (firebaseEstaConfigurado()) {
  if (!firebase.apps.length) {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
  } else {
    firebaseApp = firebase.app();
  }
  firebaseAuth = firebase.auth();
  firebaseDb = firebase.firestore();
}
