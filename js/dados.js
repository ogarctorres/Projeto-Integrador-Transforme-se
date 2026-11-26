// =========================================================================
// DADOS DE DEMONSTRAÇÃO — CONECTA MAIS (CONECTA+)
// =========================================================================
// Por enquanto usamos o "localStorage" do navegador para simular o salvamento
// de dados entre as páginas (Home -> Cadastro -> Login -> Painel).
// Na próxima etapa do projeto, estas funções serão conectadas ao Firebase
// (Firebase Authentication + Cloud Firestore).
// =========================================================================

const OPORTUNIDADES_PADRAO = [
  // --- TAREFAS CURTAS ---
  {
    id: 1,
    tipo: "curtos",
    titulo: "Edição de Cortes TikTok & Reels",
    empresa: "Estúdio PodCortes Digital",
    tempo: "Até 2h/dia",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "98%",
    valor: "R$ 60 – R$ 90/pacote",
    pagamento: "Pagamento por pacote entregue via PIX",
    entregas: [
      "Selecionar 5 trechos de destaque de cada vídeo",
      "Adicionar legendas dinâmicas no CapCut (9:16)",
      "Exportar em HD e enviar na pasta compartilhada"
    ],
    descricao: "Selecione momentos importantes de vídeos longos e crie cortes curtos com legendas no CapCut.",
    habilidades: ["Edição de vídeo", "CapCut"],
    corFundo: "art-one"
  },
  {
    id: 2,
    tipo: "curtos",
    titulo: "Formatação Rápida nas Normas ABNT",
    empresa: "Rede Universitária Apoio Acadêmico",
    tempo: "Até 2h/dia",
    formato: "Remoto",
    nivel: "Intermediário",
    compatibilidade: "96%",
    valor: "R$ 70 – R$ 130/trabalho",
    pagamento: "Pagamento por trabalho entregue via PIX",
    entregas: [
      "Aplicar margens, fonte e estilos oficiais ABNT",
      "Gerar sumário automático e revisar referências",
      "Entregar o arquivo revisado em Word e PDF em até 48h"
    ],
    descricao: "Formate trabalhos universitários no Word, organize sumários automáticos e padronize referências.",
    habilidades: ["Organização", "ABNT"],
    corFundo: "art-two"
  },
  {
    id: 3,
    tipo: "curtos",
    titulo: "Artes Semanais no Canva",
    empresa: "Cafeteria & Bistrô Vila Nova",
    tempo: "Até 2h/dia",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "95%",
    valor: "R$ 80 – R$ 150/semana",
    pagamento: "Pagamento semanal via PIX após entrega",
    entregas: [
      "Criar 3 artes promocionais no Canva usando o kit de cores da cafeteria",
      "Adaptar as artes para o formato Feed (4:5) e Stories (9:16)",
      "Enviar os links editáveis e arquivos PNG prontos para postar"
    ],
    descricao: "Crie artes promocionais para redes sociais seguindo os templates da cafeteria do bairro.",
    habilidades: ["Canva", "Redes sociais"],
    corFundo: "art-three"
  },
  {
    id: 4,
    tipo: "curtos",
    titulo: "Painel de Estudos no Notion",
    empresa: "Comunidade Estudantes Pro",
    tempo: "Flexível",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "93%",
    valor: "R$ 80 – R$ 150/painel",
    pagamento: "Pagamento por painel entregue via PIX",
    entregas: [
      "Estruturar calendário de provas, entregas e leituras no Notion",
      "Configurar lista de tarefas com filtros por matéria e prioridade",
      "Compartilhar o template duplicável com um mini guia de uso"
    ],
    descricao: "Monte um espaço organizado no Notion para estudantes acompanharem provas, tarefas e prazos.",
    habilidades: ["Notion", "Organização"],
    corFundo: "art-four"
  },

  // --- PROJETOS MÉDIOS ---
  {
    id: 5,
    tipo: "medios",
    titulo: "Suporte e Atendimento via WhatsApp",
    empresa: "Loja UrbanStyle E-commerce",
    tempo: "Noite / Sáb",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "94%",
    valor: "R$ 500 – R$ 850/mês",
    pagamento: "Fixo mensal via PIX + bônus por avaliação",
    entregas: [
      "Responder dúvidas frequentes de clientes usando catálogo e mensagens rápidas prontas",
      "Consultar código de rastreio e prazos de entrega no painel simplificado da loja",
      "Encaminhar casos especiais de troca ou devolução para a supervisão"
    ],
    descricao: "Responda dúvidas de clientes sobre entregas e tamanhos pelo WhatsApp usando mensagens prontas.",
    habilidades: ["Atendimento", "Suporte"],
    corFundo: "art-three"
  },
  {
    id: 6,
    tipo: "medios",
    titulo: "Legendagem de Vídeos Educativos",
    empresa: "Canal Jovem Tech",
    tempo: "6h / semana",
    formato: "Remoto",
    nivel: "Intermediário",
    compatibilidade: "92%",
    valor: "R$ 250 – R$ 380/semana",
    pagamento: "Pagamento semanal via PIX por lote de vídeos",
    entregas: [
      "Revisar legendas geradas automaticamente corrigindo acentuação e termos técnicos",
      "Sincronizar o tempo de entrada e saída de cada fala no editor",
      "Exportar os arquivos .SRT ou vídeos legendados em 1080p"
    ],
    descricao: "Revise e sincronize legendas em português para vídeos curtos publicados no YouTube e Instagram.",
    habilidades: ["Edição de vídeo", "Organização"],
    corFundo: "art-one"
  },
  {
    id: 7,
    tipo: "medios",
    titulo: "Cadastro de Produtos em Loja Virtual",
    empresa: "Papelaria Criativa Sol",
    tempo: "5h / semana",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "91%",
    valor: "R$ 200 – R$ 320/lote",
    pagamento: "Pagamento por lote cadastrado via PIX",
    entregas: [
      "Organizar fotos enviadas pela papelaria em pastas por categoria",
      "Preencher título, preço, descrição simples e tags no painel da loja",
      "Conferir estoque inicial e revisar se todos os produtos estão visíveis"
    ],
    descricao: "Suba fotos, títulos e descrições de produtos escolares no sistema online da papelaria.",
    habilidades: ["Organização", "Digitação"],
    corFundo: "art-four"
  },
  {
    id: 8,
    tipo: "medios",
    titulo: "Pacote de Posts + Stories Semanal",
    empresa: "Doceria Bela Vista",
    tempo: "6h / semana",
    formato: "Híbrido",
    nivel: "Fácil",
    compatibilidade: "90%",
    valor: "R$ 280 – R$ 400/semana",
    pagamento: "Pagamento semanal via PIX • Flexível",
    entregas: [
      "Criar 4 artes semanais no Canva destacando os doces em promoção",
      "Montar 6 sequências de Stories com enquetes para engajar clientes do bairro",
      "Entregar tudo organizado no Google Drive até quinta-feira"
    ],
    descricao: "Produza 4 posts e 6 stories semanais no Canva divulgando o cardápio da doceria do bairro.",
    habilidades: ["Redes sociais", "Canva"],
    corFundo: "art-two"
  },

  // --- PROJETOS LONGOS (MENSAIS) ---
  {
    id: 9,
    tipo: "longos",
    titulo: "Social Media para Comércio Local",
    empresa: "Cafeteria & Bistrô Vila Nova",
    tempo: "6h / semana",
    formato: "Remoto",
    nivel: "Intermediário",
    compatibilidade: "98%",
    valor: "R$ 450 – R$ 700/mês",
    pagamento: "Pagamento quinzenal via PIX • Contrato flexível",
    entregas: [
      "Montar 3 posts semanais no Canva com a identidade da cafeteria",
      "Editar 2 Reels curtos (15s a 30s) com legendas e músicas em alta",
      "Agendar publicações e responder comentários básicos"
    ],
    descricao: "Organize o calendário mensal do Instagram com 3 artes no Canva e 2 Reels curtos por semana.",
    habilidades: ["Redes sociais", "Edição de vídeo"],
    corFundo: "art-one"
  },
  {
    id: 10,
    tipo: "longos",
    titulo: "Atendimento Digital no Contraturno",
    empresa: "Clínica Sorriso & Bem-Estar",
    tempo: "Noite (Seg–Sex)",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "96%",
    valor: "R$ 550 – R$ 850/mês",
    pagamento: "Pagamento quinzenal via PIX • 100% Remoto",
    entregas: [
      "Enviar lembretes e confirmar horários de consultas pelo WhatsApp Web",
      "Responder dúvidas básicas sobre endereço, convênios e preparo de exames",
      "Registrar remarcações simples na agenda compartilhada da clínica"
    ],
    descricao: "Confirme agendamentos e tire dúvidas iniciais de pacientes pelo WhatsApp das 18h30 às 21h.",
    habilidades: ["Atendimento", "Suporte"],
    corFundo: "art-three"
  },
  {
    id: 11,
    tipo: "longos",
    titulo: "Assistente de Organização no Google Drive",
    empresa: "Escritório Contábil Horizonte",
    tempo: "8h / semana",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "94%",
    valor: "R$ 500 – R$ 780/mês",
    pagamento: "Pagamento mensal via PIX • Horários livres",
    entregas: [
      "Classificar notas fiscais e comprovantes digitais em pastas por mês/cliente",
      "Padronizar nomes de arquivos PDF seguindo o manual do escritório",
      "Atualizar checklist de documentos recebidos em planilha do Google Sheets"
    ],
    descricao: "Organize pastas digitais, renomeie documentos enviados por clientes e atualize planilhas simples.",
    habilidades: ["Organização", "Planilhas"],
    corFundo: "art-four"
  },
  {
    id: 12,
    tipo: "longos",
    titulo: "Moderação de Comunidade Estudantil",
    empresa: "Escola Digital Futuro Jovem",
    tempo: "8h / semana",
    formato: "Remoto",
    nivel: "Fácil",
    compatibilidade: "93%",
    valor: "R$ 500 – R$ 750/mês",
    pagamento: "Pagamento quinzenal via PIX • Remoto",
    entregas: [
      "Dar boas-vindas a novos estudantes nos canais da comunidade",
      "Organizar perguntas frequentes e direcionar dúvidas aos mentores",
      "Publicar lembretes semanais de lives, desafios e materiais gratuitos"
    ],
    descricao: "Acolha novos alunos, organize canais de dúvidas e compartilhe avisos semanais na comunidade.",
    habilidades: ["Atendimento", "Redes sociais"],
    corFundo: "art-two"
  }
];

// Notificações de exemplo (Tela 05 do Figma)
const NOTIFICACOES_PADRAO = [
  {
    titulo: "Novo Match de 98% encontrado!",
    texto: "A vaga 'Social Media para Comércio Local' combina com suas habilidades em Redes sociais e Edição de vídeo.",
    tempo: "Agora"
  },
  {
    titulo: "Ana Clara (Cafeteria Vila Nova) respondeu",
    texto: "Olá Richard! Adoramos seu perfil no Conecta+. Quando podemos conversar sobre os posts da semana?",
    tempo: "Há 15 min"
  },
  {
    titulo: "Você está em 68% da sua meta mensal!",
    texto: "Com potencial estimado de R$ 850/mês, falta apenas 1 projeto curto para atingir sua meta de R$ 1.250.",
    tempo: "Hoje"
  }
];

// Inicializa os dados no navegador caso ainda não existam
function inicializarDados() {
  if (!localStorage.getItem("conecta_usuarios_v2")) {
    const usuariosIniciais = [
      {
        id: 1,
        nome: "Richard Mendes",
        email: "richard.mendes@estudante.br",
        senha: "123456",
        escolaridade: "Ensino Superior em andamento",
        dispositivo: "Notebook e Celular com Wi-Fi",
        habilidades: ["Edição de vídeo", "Redes sociais", "Organização", "Atendimento"],
        diasLivres: ["Seg", "Qua", "Sex", "Sáb"],
        metaMensal: 1250
      }
    ];
    localStorage.setItem("conecta_usuarios_v2", JSON.stringify(usuariosIniciais));
  }

  localStorage.setItem("conecta_oportunidades_v2", JSON.stringify(OPORTUNIDADES_PADRAO));

  if (!localStorage.getItem("conecta_favoritos_v2")) {
    localStorage.setItem("conecta_favoritos_v2", JSON.stringify([{ usuarioId: 1, oportunidadeId: 9 }]));
  }

  if (!localStorage.getItem("conecta_candidaturas_v2")) {
    localStorage.setItem("conecta_candidaturas_v2", JSON.stringify([]));
  }
}

inicializarDados();

// =========================================================================
// FUNÇÕES DE LEITURA E ESCRITA (ESTRUTURA PRONTA PARA MIGRAR AO FIREBASE)
// =========================================================================

function listarOportunidades() {
  return JSON.parse(localStorage.getItem("conecta_oportunidades_v2")) || [];
}

function listarUsuarios() {
  return JSON.parse(localStorage.getItem("conecta_usuarios_v2")) || [];
}

function cadastrarNovoUsuario(novoUsuario) {
  const usuarios = listarUsuarios();

  const jaExiste = usuarios.find(function (u) {
    return u.email.toLowerCase() === novoUsuario.email.toLowerCase();
  });

  if (jaExiste) {
    return { sucesso: false, mensagem: "Este e-mail já está cadastrado." };
  }

  novoUsuario.id = usuarios.length + 1;
  usuarios.push(novoUsuario);
  localStorage.setItem("conecta_usuarios_v2", JSON.stringify(usuarios));

  return { sucesso: true, usuario: novoUsuario };
}

function validarLoginUsuario(email, senha) {
  const usuarios = listarUsuarios();

  const encontrado = usuarios.find(function (u) {
    return u.email.toLowerCase() === email.toLowerCase() && u.senha === senha;
  });

  if (encontrado) {
    localStorage.setItem("conecta_usuario_logado_v2", JSON.stringify(encontrado));
    return { sucesso: true, usuario: encontrado };
  }

  return { sucesso: false, mensagem: "E-mail ou senha incorretos." };
}

function pegarUsuarioLogado() {
  const texto = localStorage.getItem("conecta_usuario_logado_v2");
  return texto ? JSON.parse(texto) : null;
}

function atualizarUsuarioLogado(usuarioAtualizado) {
  const usuarios = listarUsuarios();
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === usuarioAtualizado.id) {
      usuarios[i] = usuarioAtualizado;
    }
  }
  localStorage.setItem("conecta_usuarios_v2", JSON.stringify(usuarios));
  localStorage.setItem("conecta_usuario_logado_v2", JSON.stringify(usuarioAtualizado));
}

function sairDaConta() {
  localStorage.removeItem("conecta_usuario_logado_v2");
}

function listarFavoritosDoUsuario(usuarioId) {
  const todos = JSON.parse(localStorage.getItem("conecta_favoritos_v2")) || [];
  return todos.filter(function (fav) {
    return fav.usuarioId === usuarioId;
  });
}

function alternarFavorito(usuarioId, oportunidadeId) {
  const todos = JSON.parse(localStorage.getItem("conecta_favoritos_v2")) || [];
  const indice = todos.findIndex(function (fav) {
    return fav.usuarioId === usuarioId && fav.oportunidadeId === oportunidadeId;
  });

  if (indice >= 0) {
    todos.splice(indice, 1);
    localStorage.setItem("conecta_favoritos_v2", JSON.stringify(todos));
    return false;
  } else {
    todos.push({ usuarioId: usuarioId, oportunidadeId: oportunidadeId });
    localStorage.setItem("conecta_favoritos_v2", JSON.stringify(todos));
    return true;
  }
}

function listarCandidaturasDoUsuario(usuarioId) {
  const todas = JSON.parse(localStorage.getItem("conecta_candidaturas_v2")) || [];
  return todas.filter(function (cand) {
    return cand.usuarioId === usuarioId;
  });
}

function salvarCandidatura(usuarioId, oportunidadeId, mensagem) {
  const todas = JSON.parse(localStorage.getItem("conecta_candidaturas_v2")) || [];
  const jaExiste = todas.find(function (c) {
    return c.usuarioId === usuarioId && c.oportunidadeId === oportunidadeId;
  });

  if (jaExiste) {
    return { sucesso: false, mensagem: "Você já enviou candidatura para esta vaga!" };
  }

  const nova = {
    id: todas.length + 1,
    usuarioId: usuarioId,
    oportunidadeId: oportunidadeId,
    mensagem: mensagem,
    data: new Date().toLocaleDateString("pt-BR"),
    status: "Enviada"
  };

  todas.push(nova);
  localStorage.setItem("conecta_candidaturas_v2", JSON.stringify(todas));
  return { sucesso: true, candidatura: nova };
}
