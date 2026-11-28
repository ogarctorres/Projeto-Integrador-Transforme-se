#  Conecta Mais (`Conecta+`) — Projeto Integrador PROA

Plataforma web desenvolvida por jovens no **Instituto PROA** para conectar habilidades cotidianas e tempo livre no contraturno a oportunidades reais de renda extra — de forma **100% gratuita para estudantes**.

🌐 **Site no Ar (Vercel):** [https://conecta-mais-three.vercel.app](https://conecta-mais-three.vercel.app)  
🔗 **Protótipo Oficial no Figma:** [Prototipo PROA (22 Telas Desktop)](https://www.figma.com/design/Fk9t2TqetfQP7emQocf9vF/Prototipo-PROA)

---

## 📂 Estrutura de Pastas do Projeto

```text
projeto-integrador/
├── index.html          # Página Inicial (Home Pública Sem Login — Tela 00A do Figma)
├── assets/
│   └── logos/          # Logos oficiais em SVG dos 8 parceiros da plataforma
├── pages/
│   ├── login.html      # Tela de Login em 2 colunas (Tela Login do Figma)
│   ├── cadastro.html   # Cadastro por etapas gratuito com habilidades, dias livres e LGPD
│   └── painel.html     # Área Logada (Oportunidades, Simulador Financeiro, Favoritos, Chat, Alertas e Perfil)
├── css/
│   ├── home.css        # Estilos da página inicial
│   ├── auth.css        # Estilos das páginas de Login e Cadastro
│   └── painel.css      # Estilos da área logada
├── js/
│   ├── firebase-config.js   # Configuração do Firebase + detecção automática de ambiente
│   ├── firebase-service.js  # Serviço completo de Firebase Authentication + Cloud Firestore
│   ├── dados.js             # Dados iniciais e fallback automático em localStorage
│   ├── home.js              # Home: 3 abas, busca, prévia do Match, simulador e FAQ
│   ├── login.js             # Login via Firebase Auth (Email/Senha, Google e Recuperar Senha)
│   ├── cadastro.js          # Cadastro por etapas (dados, idiomas, turnos, PIX, portfólio e LGPD)
│   ├── painel.js            # Match real %, filtros, ordenação, Simulador, Detalhes, Chat multi-contato e Perfil
│   └── acessibilidade.js    # VLibras, Modo Alto Contraste e ajuste de fonte (A- / A+)
├── firestore.rules          # Regras de segurança e privacidade LGPD do Cloud Firestore
├── FIREBASE_GUIA.md         # Passo a passo rápido para colar as chaves do Firebase Console
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Documentação oficial do repositório
```

---

## 🚀 Como Executar o Projeto

1. Clone ou baixe este repositório.
2. Abra o arquivo **`index.html`** diretamente no navegador (ou use a extensão **Live Server** no VS Code).
3. Para testar a área logada imediatamente, clique em **Entrar** e use a conta demonstrativa:
   - **E-mail:** `richard.mendes@estudante.br`
   - **Senha:** `123456`
   - Ou clique em **Cadastre-se** para criar sua própria conta de teste!

---

## 🛠️ Tecnologias e Metodologia

- **Front-End:** HTML5, CSS3 (Flexbox e CSS Grid) e JavaScript (Vanilla JS).
- **Design UX/UI:** Figma (Design System com fonte **Inter**, paleta Azul Royal/Marinho, Verde Esmeralda e Âmbar).
- **Metodologia:** Framework Ágil **Scrum** (*Sprints, Product Backlog, Planning, Daily, Review e Retrospective*).
- **Acessibilidade (WCAG 2.1):** Widget oficial **VLibras**, controle de tamanho de fonte (`A-` / `A+`), foco visível por teclado e **Modo Alto Contraste** em todas as telas.
- **Banco de Dados & Autenticação (Firebase):** Integrado com **Firebase SDK v10** (*Firebase Authentication* com E-mail/Senha, Google OAuth e Recuperação de Senha + *Cloud Firestore* com regras `firestore.rules` para LGPD), contando com fallback automático em `localStorage` para demonstrações offline. Veja [FIREBASE_GUIA.md](FIREBASE_GUIA.md) para ativar suas chaves em 5 minutos.

---

## 🌍 Alinhamento às ODS's da ONU

- **ODS 8 — Trabalho Decente e Crescimento Econômico:** Primeira porta de geração de renda flexível e transparente para jovens estudantes.
- **ODS 1 — Erradicação da Pobreza:** Renda complementar real no contraturno dos estudos.
- **ODS 4 — Educação de Qualidade:** Respeita horários escolares/universitários e capacita via microtutoriais práticos.
- **ODS 10 — Redução das Desigualdades:** Oportunidades por mérito prático, considerando inclusive o dispositivo e acesso à internet do estudante.

---

## 🎨 Manual de Marca & Monetização

- **Identidade Visual:** Tipografia **Inter**, símbolo `✦` (*talento e novas possibilidades*), **Azul Royal (`#2563EB`) / Marinho (`#1E3A8A`)** (confiança e tecnologia), **Verde Esmeralda (`#10B981`)** (ganhos e Match) e **Âmbar/Laranja (`#FBBF24` / `#F59E0B`)** (energia jovem).
- **Monetização Sustentável:** **100% gratuito para o jovem estudante**; receita B2B via destaque de vagas, planos para empresas/comércios, patrocínio ESG de grandes marcas parceiras e taxa administrativa sobre o contratante em projetos fechados via PIX.

---

© 2026 **Conecta+** • Conectando pessoas a novas oportunidades.
