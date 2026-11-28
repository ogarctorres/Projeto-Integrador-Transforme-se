// =========================================================================
// CONFIGURAÇÃO DO FIREBASE — CONECTA MAIS (CONECTA+)
// =========================================================================
// Passo a passo para ativar o Firebase real (veja também FIREBASE_GUIA.md):
// 1. Acesse https://console.firebase.google.com
// 2. Crie um projeto chamado "conecta-mais"
// 3. Adicione um aplicativo Web (</>) e copie o objeto "firebaseConfig"
// 4. Substitua os valores abaixo pelas suas chaves reais
//
// Enquanto os valores abaixo estiverem como exemplo ("COLE_SUA_..."),
// o site funciona automaticamente no Modo Demonstração Local (localStorage)
// sem quebrar nenhuma página!
// =========================================================================

const FIREBASE_CONFIG = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};

// Verifica se o Firebase SDK foi carregado e se as chaves reais já foram preenchidas
function firebaseEstaConfigurado() {
  const sdkCarregado = typeof window.firebase !== "undefined";
  const chavePreenchida =
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== "COLE_SUA_API_KEY_AQUI" &&
    FIREBASE_CONFIG.projectId !== "SEU_PROJETO";

  return sdkCarregado && chavePreenchida;
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
