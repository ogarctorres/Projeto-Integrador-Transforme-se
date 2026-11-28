# 🔥 Guia Rápido: Como Ativar o Firebase Real no Conecta Mais

O código do **Conecta Mais (`Conecta+`)** já está **100% integrado ao Firebase SDK** (`Firebase Authentication` + `Cloud Firestore`).

Enquanto você não colar as suas chaves do Firebase, o site funciona automaticamente no **Modo Demonstração Local (`localStorage`)** para nunca quebrar a apresentação. Assim que colar as suas chaves, ele passa a salvar tudo na nuvem do Google automaticamente!

---

## Passo 1 — Criar o projeto no Firebase Console
1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com) com sua conta Google.
2. Clique em **Adicionar projeto** → digite **`conecta-mais`** → clique em **Criar projeto**.

## Passo 2 — Ativar o Login (Firebase Authentication)
1. No menu esquerdo, clique em **Criação → Authentication** → **Vamos começar**.
2. Na aba **Sign-in method**, ative:
   - **E-mail/senha** (ative e clique em Salvar)
   - **Google** (opcional, para ativar o botão "Continuar com Google" no Login!)

## Passo 3 — Criar o Banco de Dados (Cloud Firestore)
1. No menu esquerdo, clique em **Criação → Firestore Database** → **Criar banco de dados**.
2. Escolha a região **southamerica-east1 (São Paulo)** e inicie no modo de produção ou teste.
3. Na aba **Regras (Rules)**, você pode colar exatamente o conteúdo do arquivo **`firestore.rules`** deste repositório!

## Passo 4 — Colar suas chaves em `js/firebase-config.js`
1. Clique na engrenagem **⚙️ Configurações do projeto** → aba **Geral**.
2. Em **Seus aplicativos**, clique no ícone Web **`</>`**, dê o nome `conecta-mais-web` e copie o objeto `firebaseConfig`.
3. Abra o arquivo **`js/firebase-config.js`** no VS Code e substitua o bloco `FIREBASE_CONFIG`:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY_REAL",
  authDomain: "conecta-mais.firebaseapp.com",
  projectId: "conecta-mais",
  storageBucket: "conecta-mais.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

4. Salve, faça `git push` e pronto! No rodapé do Painel Logado o selo mudará automaticamente para **`☁️ Conectado ao Firebase (Auth + Firestore)`**!

---

## Coleções criadas automaticamente no Firestore
- **`usuarios`**: perfil completo do estudante (`nome`, `email`, `habilidades`, `diasLivres`, `turnos`, `metaMensal`, `dispositivo`).
- **`favoritos`**: vínculo entre `usuarioId` e `oportunidadeId`.
- **`candidaturas`**: candidaturas enviadas com mensagem, link de portfólio, data e status.
- **`mensagens_chat`**: histórico das mensagens enviadas no Chat Direto.
