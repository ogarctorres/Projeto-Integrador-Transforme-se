// =========================================================================
// SERVIÇO FIREBASE (AUTHENTICATION) — CONECTA MAIS (CONECTA+)
// =========================================================================
// Centraliza cadastro, login com e-mail/senha, login com Google,
// recuperação de senha e logout.
// Quando o Firebase está configurado em js/firebase-config.js, usa a nuvem
// real do Google; caso contrário, usa automaticamente js/dados.js (local).
// =========================================================================

async function servicoCadastrarUsuario(novoUsuario) {
  if (firebaseEstaConfigurado() && firebaseAuth && firebaseDb) {
    try {
      const credencial = await firebaseAuth.createUserWithEmailAndPassword(
        novoUsuario.email,
        novoUsuario.senha
      );

      const uid = credencial.user.uid;
      const perfilLimpo = {
        id: uid,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        escolaridade: novoUsuario.escolaridade || "Estudante",
        dispositivo: novoUsuario.dispositivo || "Celular / Notebook",
        idiomas: novoUsuario.idiomas || "Português",
        informatica: novoUsuario.informatica || "Intermediário",
        turnos: novoUsuario.turnos || ["Noite", "Finais de semana"],
        formaPagamento: novoUsuario.formaPagamento || "PIX",
        portfolio: novoUsuario.portfolio || "",
        habilidades: novoUsuario.habilidades || [],
        diasLivres: novoUsuario.diasLivres || [],
        metaMensal: Number(novoUsuario.metaMensal) || 1250,
        criadoEm: new Date().toISOString()
      };

      await firebaseDb.collection("usuarios").doc(uid).set(perfilLimpo);
      localStorage.setItem("conecta_usuario_logado_v2", JSON.stringify(perfilLimpo));
      return { sucesso: true, usuario: perfilLimpo, modo: "firebase" };
    } catch (erro) {
      let msg = "Não foi possível criar sua conta no Firebase.";
      if (erro.code === "auth/email-already-in-use") msg = "Este e-mail já está cadastrado.";
      if (erro.code === "auth/weak-password") msg = "A senha deve ter pelo menos 6 caracteres.";
      if (erro.code === "auth/invalid-email") msg = "Digite um e-mail válido.";
      return { sucesso: false, mensagem: msg };
    }
  }

  // Fallback local (Modo Demonstração)
  const resp = cadastrarNovoUsuario(novoUsuario);
  if (resp.sucesso) {
    validarLoginUsuario(novoUsuario.email, novoUsuario.senha);
  }
  return resp;
}

async function servicoLoginEmailSenha(email, senha) {
  if (firebaseEstaConfigurado() && firebaseAuth && firebaseDb) {
    try {
      const credencial = await firebaseAuth.signInWithEmailAndPassword(email, senha);
      const uid = credencial.user.uid;
      const doc = await firebaseDb.collection("usuarios").doc(uid).get();

      const usuario = doc.exists
        ? doc.data()
        : {
            id: uid,
            nome: credencial.user.displayName || email.split("@")[0],
            email: email,
            habilidades: ["Edição de vídeo", "Redes sociais"],
            diasLivres: ["Seg", "Qua", "Sex", "Sáb"],
            metaMensal: 1250
          };

      localStorage.setItem("conecta_usuario_logado_v2", JSON.stringify(usuario));
      return { sucesso: true, usuario: usuario, modo: "firebase" };
    } catch (erro) {
      return { sucesso: false, mensagem: "E-mail ou senha incorretos no Firebase." };
    }
  }

  return validarLoginUsuario(email, senha);
}

async function servicoLoginGoogle() {
  if (firebaseEstaConfigurado() && firebaseAuth && firebaseDb) {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const resultado = await firebaseAuth.signInWithPopup(provider);
      const user = resultado.user;
      const docRef = firebaseDb.collection("usuarios").doc(user.uid);
      const doc = await docRef.get();

      let perfil = null;
      if (doc.exists) {
        perfil = doc.data();
      } else {
        perfil = {
          id: user.uid,
          nome: user.displayName || "Estudante Conecta+",
          email: user.email,
          foto: user.photoURL || "",
          escolaridade: "Estudante",
          dispositivo: "Celular / Notebook",
          idiomas: "Português",
          informatica: "Intermediário",
          turnos: ["Noite", "Finais de semana"],
          formaPagamento: "PIX",
          portfolio: "",
          habilidades: ["Redes sociais", "Organização"],
          diasLivres: ["Seg", "Qua", "Sex", "Sáb"],
          metaMensal: 1250,
          criadoEm: new Date().toISOString()
        };
        await docRef.set(perfil);
      }

      localStorage.setItem("conecta_usuario_logado_v2", JSON.stringify(perfil));
      return { sucesso: true, usuario: perfil, modo: "firebase" };
    } catch (erro) {
      console.error("Erro no Login com Google:", erro.code, erro.message);
      let msg = "Não foi possível concluir o login com Google.";
      if (erro.code === "auth/popup-closed-by-user") {
        msg = "Janela do Google fechada antes de concluir o login.";
      } else if (erro.code === "auth/popup-blocked") {
        msg = "Seu navegador bloqueou o pop-up do Google. Libere pop-ups e tente de novo.";
      } else if (erro.code === "auth/unauthorized-domain") {
        msg = "Domínio não autorizado no Firebase Auth. Adicione este domínio em Authentication > Configurações > Domínios autorizados.";
      } else if (erro.code === "auth/operation-not-allowed") {
        msg = "Ative o provedor Google em Firebase Console > Authentication > Método de login.";
      }
      return { sucesso: false, mensagem: msg };
    }
  }

  return {
    sucesso: false,
    mensagem: "Configure suas chaves do Firebase no .env / Vercel para ativar o Login com Google!"
  };
}

async function servicoRecuperarSenha(email) {
  if (firebaseEstaConfigurado() && firebaseAuth) {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      return { sucesso: true, mensagem: "E-mail de recuperação enviado! Verifique sua caixa de entrada." };
    } catch (erro) {
      return { sucesso: false, mensagem: "Digite um e-mail cadastrado válido para recuperar a senha." };
    }
  }

  return {
    sucesso: false,
    mensagem: "Configure suas chaves do Firebase no .env / Vercel para enviar e-mails reais pelo Firebase Auth."
  };
}

async function servicoSairDaConta() {
  if (firebaseEstaConfigurado() && firebaseAuth) {
    try {
      await firebaseAuth.signOut();
    } catch (erro) {
      // ignora erro de signOut offline
    }
  }
  sairDaConta();
}

// =========================================================================
// OPERAÇÕES NO CLOUD FIRESTORE (PERFIL, FAVORITOS, CANDIDATURAS E CHAT)
// =========================================================================

async function servicoAtualizarPerfil(usuarioAtualizado) {
  atualizarUsuarioLogado(usuarioAtualizado);

  if (firebaseEstaConfigurado() && firebaseDb && usuarioAtualizado.id) {
    try {
      await firebaseDb.collection("usuarios").doc(String(usuarioAtualizado.id)).set(usuarioAtualizado, { merge: true });
    } catch (erro) {
      console.warn("Aviso Firestore (perfil):", erro.message);
    }
  }
}

async function servicoAlternarFavorito(usuarioId, oportunidadeId) {
  const salvoAgora = alternarFavorito(usuarioId, oportunidadeId);

  if (firebaseEstaConfigurado() && firebaseDb) {
    const docId = String(usuarioId) + "_" + String(oportunidadeId);
    try {
      if (salvoAgora) {
        await firebaseDb.collection("favoritos").doc(docId).set({
          usuarioId: String(usuarioId),
          oportunidadeId: Number(oportunidadeId),
          salvoEm: new Date().toISOString()
        });
      } else {
        await firebaseDb.collection("favoritos").doc(docId).delete();
      }
    } catch (erro) {
      console.warn("Aviso Firestore (favoritos):", erro.message);
    }
  }

  return salvoAgora;
}

async function servicoEnviarCandidatura(usuarioId, oportunidadeId, mensagem, portfolio) {
  const resultado = salvarCandidatura(usuarioId, oportunidadeId, mensagem, portfolio);

  if (resultado.sucesso && firebaseEstaConfigurado() && firebaseDb) {
    try {
      await firebaseDb.collection("candidaturas").add({
        usuarioId: String(usuarioId),
        oportunidadeId: Number(oportunidadeId),
        mensagem: mensagem,
        portfolio: portfolio || "",
        status: "Enviada",
        criadoEm: new Date().toISOString()
      });
    } catch (erro) {
      console.warn("Aviso Firestore (candidaturas):", erro.message);
    }
  }

  return resultado;
}

async function servicoCancelarCandidatura(usuarioId, candidaturaId) {
  removerCandidaturaLocal(usuarioId, candidaturaId);
}

async function servicoSalvarMensagemChat(usuarioId, contatoId, autor, texto, hora) {
  if (firebaseEstaConfigurado() && firebaseDb) {
    try {
      await firebaseDb.collection("mensagens_chat").add({
        usuarioId: String(usuarioId),
        contatoId: contatoId,
        autor: autor,
        texto: texto,
        hora: hora,
        criadoEm: new Date().toISOString()
      });
    } catch (erro) {
      console.warn("Aviso Firestore (chat):", erro.message);
    }
  }
}

function obterStatusConexaoBanco() {
  if (firebaseEstaConfigurado()) {
    return { online: true, texto: "☁️ Conectado ao Firebase (Auth + Firestore)" };
  }
  return { online: false, texto: "💾 Modo Demonstração Local (pronto para chaves do Firebase)" };
}
