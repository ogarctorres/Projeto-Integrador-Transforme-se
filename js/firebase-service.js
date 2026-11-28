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
          escolaridade: "Estudante",
          dispositivo: "Celular / Notebook",
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
      return { sucesso: false, mensagem: "Não foi possível concluir o login com Google." };
    }
  }

  return {
    sucesso: false,
    mensagem: "Cole suas chaves reais em js/firebase-config.js para ativar o Login com Google!"
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
    mensagem: "Cole suas chaves reais em js/firebase-config.js para enviar e-mails reais pelo Firebase Auth."
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
