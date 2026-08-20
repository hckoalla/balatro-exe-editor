import type { Messages } from './en'

export const ptBR: Messages = {
  selectExe: {
    title: 'Vamos encontrar seu jogo',
    subtitle: 'Aponte pro seu balatro.exe e eu cuido do resto.',
    continueWith: 'Continuar com {{path}}',
    browse: 'Procurar o balatro.exe',
    invalidTitle: 'Não é um executável válido do Balatro',
    genericInvalid: 'Isso não parece ser um balatro.exe válido.',
    detectSteam: 'Detectar automaticamente (Steam)',
    steamNotFound: 'Não encontrei o Balatro pela Steam — tenta procurar manualmente.',
  },
  decks: {
    loading: 'Carregando baralhos…',
    title: 'Escolha um baralho',
    subtitle: 'Escolha um baralho pra customizar as regras iniciais dele.',
    customized: 'Customizado',
    default: 'Padrão',
  },
  deckEditor: {
    back: 'Voltar',
  },
  numericFields: {
    dollars: 'Dinheiro Inicial',
    jokerSlot: 'Slots de Joker',
    consumableSlot: 'Slots de Consumível',
    addedToBase: 'Somado ao valor base do jogo.',
    resetField: 'Restaurar {{label}}',
    warning:
      '{{label}}: esse valor ainda não foi testado (faixa segura até ±{{limit}}) e pode fazer o jogo parar de funcionar.',
  },
  consumables: {
    label: 'Consumíveis Iniciais',
    searchPlaceholder: 'Buscar Tarots, Planetas, Spectrals…',
    resetLabel: 'Restaurar Consumíveis Iniciais',
    removeLabel: 'Remover {{name}}',
    warning:
      'Essa lista ainda não foi testada acima de {{limit}} itens e pode fazer o jogo parar de funcionar.',
  },
  save: {
    button: 'Salvar',
    confirmBody: 'Isso vai gravar direto no seu balatro.exe. Feche o Balatro antes de continuar.',
    confirmYes: 'Sim, salvar',
    cancel: 'Cancelar',
    success: 'Salvo com sucesso.',
    genericError: 'Não foi possível salvar — tente de novo.',
    possiblyPreEditedWarning:
      'Atenção: esse arquivo já tinha valores fora do padrão antes do primeiro backup deste app — o backup pode não refletir os valores originais do jogo.',
  },
  restore: {
    button: 'Restaurar Padrão',
    confirmBody:
      'Isso vai desfazer todas as customizações desse jogo — todos os baralhos voltam pros valores padrão. Feche o Balatro antes de continuar.',
    confirmYes: 'Sim, restaurar',
    cancel: 'Cancelar',
  },
  settings: {
    button: 'Configurações',
    language: 'Idioma',
  },
}
