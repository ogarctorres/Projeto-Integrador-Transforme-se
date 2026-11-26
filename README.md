# ✦ Conecta Mais (`Conecta+`) — Projeto Integrador PROA

Plataforma web desenvolvida por jovens no **Instituto PROA** para conectar habilidades cotidianas e tempo livre no contraturno a oportunidades reais de renda extra — de forma **100% gratuita para estudantes**.

🔗 **Protótipo Oficial no Figma:** [Prototipo PROA (22 Telas Desktop)](https://www.figma.com/design/Fk9t2TqetfQP7emQocf9vF/Prototipo-PROA)

---

## 📂 Estrutura de Pastas do Projeto

```text
projeto-integrador/
├── index.html          # Página Inicial (Home Pública Sem Login — Tela 00A do Figma)
├── pages/
│   ├── login.html      # Tela de Login (Tela Login do Figma)
│   ├── cadastro.html   # Tela de Cadastro gratuito com habilidades, dias livres e LGPD
│   └── painel.html     # Área Logada (Oportunidades, Favoritos, Candidaturas, Chat, Alertas e Perfil)
├── css/
│   ├── home.css        # Estilos da página inicial
│   ├── auth.css        # Estilos das páginas de Login e Cadastro
│   └── painel.css      # Estilos da área logada
├── js/
│   ├── dados.js        # Dados demonstrativos em localStorage (pronto para migrar ao Firebase)
│   ├── home.js         # Interações da Home (3 abas, busca, simulador e modal de prévia)
│   ├── login.js        # Validação do Login e mostrar/ocultar senha
│   ├── cadastro.js     # Salvamento do novo cadastro
│   └── painel.js       # Oportunidades, favoritos, candidaturas, chat direto e perfil
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Documentação do repositório
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
- **Próxima Etapa (Banco de Dados):** Migração dos dados demonstrativos (`js/dados.js`) para o **Firebase** (*Firebase Authentication* + *Cloud Firestore*).

---

© 2026 **Conecta+** • Conectando pessoas a novas oportunidades.
