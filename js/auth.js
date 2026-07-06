/* ==========================================================================
   auth.js
   Módulo responsável pela tela de Login, pela validação de credenciais e
   pela navegação entre as três telas do sistema.
   ========================================================================== */

/**
 * Alterna a tela visível da aplicação.
 * Remove a classe "ativa" de todas as telas e a aplica somente na tela alvo.
 * @param {string} idDaTela - id do elemento <section> a ser exibido
 */
function mostrarTela(idDaTela) {
  const todasAsTelas = document.querySelectorAll('.tela');
  todasAsTelas.forEach((tela) => tela.classList.remove('ativa'));

  const telaAlvo = document.getElementById(idDaTela);
  if (telaAlvo) {
    telaAlvo.classList.add('ativa');
  }
}

/**
 * Exibe uma mensagem de feedback (sucesso ou erro) na tela de login.
 * @param {string} texto
 * @param {'erro'|'sucesso'} tipo
 */
function exibirMensagemLogin(texto, tipo) {
  const areaMensagem = document.getElementById('mensagem-login');
  areaMensagem.textContent = texto;
  areaMensagem.className = 'mensagem ' + tipo;
}

/**
 * Limpa a mensagem de feedback da tela de login.
 */
function limparMensagemLogin() {
  const areaMensagem = document.getElementById('mensagem-login');
  areaMensagem.textContent = '';
  areaMensagem.className = 'mensagem';
}

/**
 * Verifica se as credenciais informadas correspondem a um usuário cadastrado.
 * @param {string} nomeUsuario
 * @param {string} senha
 * @returns {{sucesso: boolean, mensagem: string}}
 */
function validarCredenciais(nomeUsuario, senha) {
  if (!nomeUsuario || !senha) {
    return { sucesso: false, mensagem: 'Informe usuário e senha para entrar.' };
  }

  const usuarioEncontrado = buscarUsuarioPorNome(nomeUsuario);

  if (!usuarioEncontrado) {
    return { sucesso: false, mensagem: 'Usuário não encontrado. Verifique o nome ou cadastre-se.' };
  }

  if (usuarioEncontrado.senha !== senha) {
    return { sucesso: false, mensagem: 'Senha incorreta. Tente novamente, aventureiro.' };
  }

  return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
}

/**
 * Processa o envio do formulário de login: valida credenciais, cria a
 * sessão do jogador e o conduz até a tela inicial do jogo.
 * @param {Event} evento
 */
function processarLogin(evento) {
  evento.preventDefault();
  limparMensagemLogin();

  const nomeUsuario = document.getElementById('login-usuario').value.trim();
  const senha = document.getElementById('login-senha').value;

  const resultado = validarCredenciais(nomeUsuario, senha);

  if (!resultado.sucesso) {
    exibirMensagemLogin(resultado.mensagem, 'erro');
    return;
  }

  exibirMensagemLogin(resultado.mensagem, 'sucesso');
  salvarSessao(nomeUsuario);

  // Pequena pausa para o jogador ver a confirmação antes de entrar no jogo
  setTimeout(() => {
    document.getElementById('form-login').reset();
    limparMensagemLogin();
    entrarNoJogo(nomeUsuario);
  }, 900);
}

/**
 * Ao carregar a página, verifica se já existe uma sessão ativa. Caso exista,
 * o jogador é levado direto para o dashboard.
 */
function verificarSessaoExistente() {
  const sessao = obterSessao();

  if (sessao && sessao.usuario) {
    entrarNoJogo(sessao.usuario);
  }
}

/**
 * Liga os eventos da tela de login (envio do formulário e navegação
 * para a tela de cadastro).
 */
function inicializarAutenticacao() {
  document.getElementById('form-login').addEventListener('submit', processarLogin);

  document.getElementById('btn-ir-cadastro').addEventListener('click', () => {
    limparMensagemLogin();
    mostrarTela('tela-cadastro');
  });

  verificarSessaoExistente();
}

document.addEventListener('DOMContentLoaded', inicializarAutenticacao);
