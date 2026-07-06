/* ==========================================================================
   storage.js
   Módulo responsável por toda a persistência de dados via LocalStorage.
   Nenhum outro arquivo deve acessar "localStorage" diretamente 
   ========================================================================== */

// Chaves usadas no LocalStorage
const CHAVE_USUARIOS = 'eldersword_usuarios';
const CHAVE_SESSAO = 'eldersword_sessao';

/**
 * Lê a lista de usuários cadastrados no LocalStorage.
 * @returns {Array<Object>} lista de usuários
 */
function obterUsuarios() {
  const dadosBrutos = localStorage.getItem(CHAVE_USUARIOS);

  if (!dadosBrutos) {
    return [];
  }

  try {
    return JSON.parse(dadosBrutos);
  } catch (erro) {
    // Caso os dados estejam corrompidos, reinicia a lista
    console.error('Falha ao ler usuários do LocalStorage:', erro);
    return [];
  }
}

/**
 * Salva a lista completa de usuários no LocalStorage.
 * @param {Array<Object>} listaDeUsuarios
 */
function salvarUsuarios(listaDeUsuarios) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(listaDeUsuarios));
}

/**
 * Verifica se já existe um usuário cadastrado com o nome informado.
 * A comparação ignora maiúsculas/minúsculas para evitar duplicidade.
 * @param {string} nomeUsuario
 * @returns {boolean}
 */
function usuarioExiste(nomeUsuario) {
  const usuarios = obterUsuarios();
  return usuarios.some(
    (usuario) => usuario.usuario.toLowerCase() === nomeUsuario.toLowerCase()
  );
}

/**
 * Adiciona um novo jogador à lista de usuários, já com seus atributos de
 * personagem sorteados (classe, nível e ouro), e persiste no LocalStorage.
 * @param {string} nomeUsuario
 * @param {string} senha
 * @returns {Object} o registro do usuário recém-criado
 */
function adicionarUsuario(nomeUsuario, senha) {
  const usuarios = obterUsuarios();

  const novoUsuario = {
    usuario: nomeUsuario,
    senha: senha,
    personagem: gerarPersonagemAleatorio(),
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  return novoUsuario;
}

/**
 * Busca um usuário pelo nome, retornando o registro completo ou null.
 * @param {string} nomeUsuario
 * @returns {Object|null}
 */
function buscarUsuarioPorNome(nomeUsuario) {
  const usuarios = obterUsuarios();
  return (
    usuarios.find(
      (usuario) => usuario.usuario.toLowerCase() === nomeUsuario.toLowerCase()
    ) || null
  );
}

/**
 * Salva a sessão do jogador atualmente logado no LocalStorage.
 * @param {string} nomeUsuario
 */
function salvarSessao(nomeUsuario) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ usuario: nomeUsuario }));
}

/**
 * Recupera os dados da sessão ativa (jogador logado no momento).
 * @returns {Object|null}
 */
function obterSessao() {
  const dadosBrutos = localStorage.getItem(CHAVE_SESSAO);

  if (!dadosBrutos) {
    return null;
  }

  try {
    return JSON.parse(dadosBrutos);
  } catch (erro) {
    console.error('Falha ao ler sessão do LocalStorage:', erro);
    return null;
  }
}

/**
 * Encerra a sessão atual, removendo os dados de login do LocalStorage.
 */
function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
}
