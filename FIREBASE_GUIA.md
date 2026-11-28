# 🔥 Guia Atualizado: Firebase + `.env` + Vercel no Conecta Mais

O código do **Conecta Mais (`Conecta+`)** já está **100% integrado ao Firebase SDK** (`Firebase Authentication` + `Cloud Firestore`) e configurado para ler suas chaves via **`.env`** (no computador) e **Environment Variables** (na Vercel), sem expor nenhuma chave no GitHub.

Enquanto você não preencher o `.env` / variáveis da Vercel, o site funciona automaticamente no **Modo Demonstração Local (`localStorage`)** para nunca quebrar a apresentação.

---

## Parte 1 — Configurar no Firebase Console (Interface Nova)

### Passo 1 — Criar o projeto
1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com) com sua conta Google.
2. Clique em **Criar um novo projeto do Firebase** (ou **Começar a usar um projeto do Firebase**).
3. Digite o nome **`conecta-mais`** → clique em **Continuar**.
4. **Gemini no Firebase** / **Google Analytics**: pode desativar (não precisa para o projeto) → clique em **Criar projeto** → **Continuar**.

### Passo 2 — Ativar o Login (Authentication)
1. No menu lateral esquerdo, expanda **Criação** (*Build*) → clique em **Authentication**.
2. Clique em **Vamos começar** (*Get started*).
3. Na aba **Sign-in method** (*Método de login*):
   - Clique em **E-mail/senha** → ative a primeira chave (**E-mail/senha**) → clique em **Salvar**.
   - *(Opcional para o botão "Continuar com Google")*: clique em **Adicionar novo provedor** → **Google** → ative → escolha seu e-mail de suporte → **Salvar**.
4. **Importante para a Vercel:** ainda em **Authentication**, clique na aba **Settings** (*Configurações*) → **Authorized domains** (*Domínios autorizados*) → **Adicionar domínio** → cole:
   ```text
   conecta-mais-three.vercel.app
   ```

### Passo 3 — Criar o Banco de Dados (Cloud Firestore)
1. No menu lateral esquerdo, em **Criação** (*Build*) → clique em **Firestore Database**.
2. Clique em **Criar banco de dados** (*Create database*).
3. Se pedir para escolher a edição, escolha **Standard Edition** (gratuita no plano Spark).
4. Em **Local** (*Location*), escolha **`southamerica-east1 (São Paulo)`** → **Próxima**.
5. Escolha **Iniciar no modo de produção** (ou **modo de teste**) → clique em **Criar**.
6. Depois de criado, abra a aba **Regras** (*Rules*), apague o conteúdo padrão, cole exatamente o conteúdo do arquivo **`firestore.rules`** deste repositório e clique em **Publicar**.

### Passo 4 — Pegar as 6 chaves do App Web
1. No topo do menu esquerdo, clique em **Visão geral do projeto** (ou na engrenagem ⚙️ → **Configurações do projeto** → aba **Geral**).
2. Clique no ícone Web **`</>`** (ou em **Seus aplicativos** → **Adicionar app** → **`</>`**).
3. Digite o apelido **`conecta-mais-web`** (não precisa marcar Firebase Hosting, pois usamos Vercel) → clique em **Registrar app**.
4. O Firebase vai mostrar um bloco `firebaseConfig` com 6 campos:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket` *(nos projetos novos termina com `.firebasestorage.app`)*
   - `messagingSenderId`
   - `appId`

---

## Parte 2 — Usar com `.env` no seu computador (sem subir pro GitHub)

Os arquivos `.env` e `js/firebase-env.js` já estão no **`.gitignore`**, então suas chaves nunca serão enviadas para o GitHub.

1. Na raiz do projeto, crie um arquivo chamado **`.env`** (você pode copiar o `.env.example`) com os seus 6 valores reais:

```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=conecta-mais-xxxx.firebaseapp.com
FIREBASE_PROJECT_ID=conecta-mais-xxxx
FIREBASE_STORAGE_BUCKET=conecta-mais-xxxx.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

2. No terminal do VS Code (dentro da pasta do projeto), rode:

```powershell
node scripts/gerar-env.js
```

Isso gera o arquivo local `js/firebase-env.js` (que o Git ignora automaticamente). Pronto — ao abrir o site no Live Server, o selo no rodapé do Painel mudará para **`☁️ Conectado ao Firebase (Auth + Firestore)`**!

---

## Parte 3 — Subir as variáveis na Vercel (Produção)

O arquivo `vercel.json` já está configurado para rodar `node scripts/gerar-env.js` automaticamente em todo deploy! Você só precisa cadastrar as 6 variáveis no painel da Vercel:

1. Acesse [https://vercel.com](https://vercel.com) → abra o projeto **`conecta-mais`**.
2. Clique em **Settings** → **Environment Variables**.
3. Adicione as **6 chaves** uma por uma (mesmos nomes do `.env`), marcando **Production**, **Preview** e **Development**:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
4. Clique em **Save**.
5. Vá na aba **Deployments** → clique nos **3 pontinhos (`...`)** do último deploy → **Redeploy** (ou faça um `git push`).

---

## Coleções criadas automaticamente no Firestore
- **`usuarios`**: perfil completo do estudante (`nome`, `email`, `habilidades`, `diasLivres`, `turnos`, `metaMensal`, `dispositivo`).
- **`favoritos`**: vínculo entre `usuarioId` e `oportunidadeId`.
- **`candidaturas`**: candidaturas enviadas com mensagem, link de portfólio, data e status.
- **`mensagens_chat`**: histórico das mensagens enviadas no Chat Direto.
