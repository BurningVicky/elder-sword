/* ==========================================================================
   dashboard.js
   Módulo responsável pela tela inicial, exibe a
   ficha do personagem do jogador logado e trata o encerramento da sessão.
   ========================================================================== */

/**
 * Formata um valor numérico de ouro no padrão "1.234" para melhor leitura.
 * @param {number} valor
 * @returns {string}
 */
function formatarOuro(valor) {
  return valor.toLocaleString('pt-BR');
}

/**
 * Preenche a ficha do personagem na tela com os dados do usuário informado.
 * @param {Object} usuario registro completo do usuário (vindo do storage)
 */
function preencherFichaPersonagem(usuario) {
  const personagem = usuario.personagem;

  document.getElementById('dado-nome').textContent = usuario.usuario;
  document.getElementById('dado-classe').textContent = personagem.classe;
  document.getElementById('dado-nivel').textContent = personagem.nivel;
  document.getElementById('dado-ouro').textContent = formatarOuro(personagem.ouro) + ' moedas';

  const icone = ICONES_POR_CLASSE[personagem.classe] || '🛡';
  document.getElementById('icone-classe').textContent = icone;
}

/**
 * Conduz o jogador autenticado até a tela inicial do jogo, carregando
 * o personagem previamente salvo no LocalStorage.
 * @param {string} nomeUsuario
 */
function entrarNoJogo(nomeUsuario) {
  const usuario = buscarUsuarioPorNome(nomeUsuario);

  if (!usuario) {
    // Caso o usuário não seja encontrado, significa que houve algum problema
    // usuário inexistente, encerra a sessão e retorna ao login.
    encerrarSessao();
    mostrarTela('tela-login');
    return;
  }

  preencherFichaPersonagem(usuario);
  mostrarTela('tela-dashboard');

  const areaMensagem = document.getElementById('mensagem-dashboard');
  areaMensagem.textContent = `Nos encontramos novamente, ${usuario.usuario}!`;
  areaMensagem.className = 'mensagem sucesso';
}

/**
 * Encerra a sessão do jogador e retorna à tela de login.
 */
function processarLogout() {
  encerrarSessao();

  const areaMensagemDashboard = document.getElementById('mensagem-dashboard');
  areaMensagemDashboard.textContent = '';
  areaMensagemDashboard.className = 'mensagem';

  mostrarTela('tela-login');
  exibirMensagemLogin('Você saiu!', 'sucesso');
}

/**
 * Liga o evento do botão de logout.
 */
function inicializarDashboard() {
  document.getElementById('btn-logout').addEventListener('click', processarLogout);
}

document.addEventListener('DOMContentLoaded', inicializarDashboard);
