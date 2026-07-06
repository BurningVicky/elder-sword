/* ==========================================================================
   cadastro.js
   Módulo responsável pela tela de Cadastro: validação dos campos e criação
   de uma nova conta de jogador.
   ========================================================================== */

// Listas usadas para o sorteio automático do personagem
const CLASSES_DISPONIVEIS = ['Guerreiro', 'Arqueiro', 'Mago', 'Gatuno'];
const ICONES_POR_CLASSE = {
  Guerreiro: '⚔️',
  Arqueiro: '🏹',
  Mago: '🔮',
  Gatuno: '🗡️',
};

/**
 * Sorteia um número inteiro entre um valor mínimo e máximo.
 * @param {number} minimo
 * @param {number} maximo
 * @returns {number}
 */
function sortearInteiro(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

/**
 * Sorteia uma classe aleatória dentre as disponíveis no jogo.
 * @returns {string}
 */
function sortearClasse() {
  const indiceSorteado = sortearInteiro(0, CLASSES_DISPONIVEIS.length - 1);
  return CLASSES_DISPONIVEIS[indiceSorteado];
}

/**
 * Gera os atributos iniciais de um novo personagem:
 * @returns {{classe: string, nivel: number, ouro: number}}
 */
function gerarPersonagemAleatorio() {
  return {
    classe: sortearClasse(),
    nivel: sortearInteiro(1, 99),
    ouro: sortearInteiro(100, 10000),
  };
}

/**
 * Exibe uma mensagem de feedback na tela de cadastro.
 * @param {string} texto
 * @param {'erro'|'sucesso'} tipo
 */
function exibirMensagemCadastro(texto, tipo) {
  const areaMensagem = document.getElementById('mensagem-cadastro');
  areaMensagem.textContent = texto;
  areaMensagem.className = 'mensagem ' + tipo;
}

/**
 * Limpa a mensagem de feedback da tela de cadastro.
 */
function limparMensagemCadastro() {
  const areaMensagem = document.getElementById('mensagem-cadastro');
  areaMensagem.textContent = '';
  areaMensagem.className = 'mensagem';
}

/**
 * Valida os dados informados no formulário de cadastro.
 * Retorna uma mensagem de erro (string) ou null se estiver tudo certo.
 * @param {string} nomeUsuario
 * @param {string} senha
 * @param {string} confirmarSenha
 * @returns {string|null}
 */
function validarDadosCadastro(nomeUsuario, senha, confirmarSenha) {
  if (!nomeUsuario || !senha || !confirmarSenha) {
    return 'Preencha todos os campos para criar seu personagem.';
  }

  if (nomeUsuario.length < 3) {
    return 'O nome de usuário deve ter ao menos 3 caracteres.';
  }

  if (senha.length < 4) {
    return 'A senha deve ter ao menos 4 caracteres.';
  }

  if (senha !== confirmarSenha) {
    return 'As senhas não coincidem. Tente novamente.';
  }

  if (usuarioExiste(nomeUsuario)) {
    return 'Esse nome de usuário já existe na guilda. Escolha outro.';
  }

  return null;
}

/**
 * Processa o envio do formulário de cadastro: valida, cria o usuário e
 * conduz o jogador de volta à tela de login para que ele possa entrar.
 * @param {Event} evento
 */
function processarCadastro(evento) {
  evento.preventDefault();
  limparMensagemCadastro();

  const nomeUsuario = document.getElementById('cadastro-usuario').value.trim();
  const senha = document.getElementById('cadastro-senha').value;
  const confirmarSenha = document.getElementById('cadastro-confirmar-senha').value;

  const erroDeValidacao = validarDadosCadastro(nomeUsuario, senha, confirmarSenha);

  if (erroDeValidacao) {
    exibirMensagemCadastro(erroDeValidacao, 'erro');
    return;
  }

  adicionarUsuario(nomeUsuario, senha);

  exibirMensagemCadastro('Personagem criado com sucesso! Redirecionando para o login...', 'sucesso');

  document.getElementById('form-cadastro').reset();

  // Pequena pausa para o jogador ler a mensagem antes de voltar ao login
  setTimeout(() => {
    limparMensagemCadastro();
    mostrarTela('tela-login');
  }, 1400);
}

/**
 * Liga os eventos da tela de cadastro (envio do formulário e navegação).
 */
function inicializarCadastro() {
  const formularioCadastro = document.getElementById('form-cadastro');
  formularioCadastro.addEventListener('submit', processarCadastro);

  document.getElementById('btn-voltar-login').addEventListener('click', () => {
    limparMensagemCadastro();
    formularioCadastro.reset();
    mostrarTela('tela-login');
  });
}

document.addEventListener('DOMContentLoaded', inicializarCadastro);
