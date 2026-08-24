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
    challengeDeckDollarsNote:
      'O desafio Imposto de Luxo encolhe o tamanho da mão conforme esse dinheiro se acumula — um valor alto aqui pode tornar esse desafio impossível de jogar.',
    challengeDeckJokerSlotNote:
      'Alguns desafios (Decolar, Saque de Cinco Cartas, Crueldade, Sem Curinga, Estereótipo) forçam sua própria quantidade de slots de joker e ignoram esse valor.',
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
      'Isso vai desfazer todas as customizações desse jogo — todos os baralhos e níveis de mão de pôquer voltam pros valores padrão. Feche o Balatro antes de continuar.',
    confirmYes: 'Sim, restaurar',
    cancel: 'Cancelar',
    decksButton: 'Restaurar Baralhos',
    decksConfirmBody:
      'Isso vai desfazer as customizações dos baralhos — todos os baralhos voltam pro padrão. Os níveis de mão de pôquer não são afetados. Feche o Balatro antes de continuar.',
    decksConfirmYes: 'Sim, restaurar baralhos',
    pokerHandsButton: 'Restaurar Mãos de Pôquer',
    pokerHandsConfirmBody:
      'Isso vai desfazer as customizações das mãos de pôquer — todas as mãos voltam pro padrão. Os baralhos não são afetados. Feche o Balatro antes de continuar.',
    pokerHandsConfirmYes: 'Sim, restaurar mãos de pôquer',
  },
  settings: {
    language: 'Idioma',
  },
  tabs: {
    deckEditor: 'Edição de Baralho',
    batchEdit: 'Edição de Baralho por Lote',
    settings: 'Configurações',
    pokerHands: 'Edição de Mão de Pôquer',
  },
  batchEdit: {
    selectTitle: 'Selecione os baralhos pra editar',
    selectSubtitle: 'Escolha um ou mais baralhos pra aplicar o mesmo setup.',
    continue: 'Continuar',
    continueWithCount: 'Continuar ({{count}} selecionados)',
    setupTitle: 'Configure os valores a aplicar',
    setupSubtitle:
      'Esses valores serão aplicados aos {{count}} baralhos selecionados, substituindo o que cada um já tinha — incluindo os Consumíveis Iniciais, que são substituídos como lista inteira.',
    applyButton: 'Aplicar a {{count}} baralhos',
    confirmBody:
      'Isso vai sobrescrever Dinheiro Inicial, Slots de Joker, Slots de Consumível e Consumíveis Iniciais em {{count}} baralhos, substituindo os valores atuais deles. Isso vai gravar direto no seu balatro.exe. Feche o Balatro antes de continuar.',
    confirmYes: 'Sim, aplicar a {{count}} baralhos',
  },
  pokerHands: {
    title: 'Níveis de mão de pôquer',
    subtitle: 'Edite os chips/mult base e o crescimento por nível de cada mão de pôquer.',
    sMult: 'Mult Base',
    sChips: 'Chips Base',
    lMult: 'Mult por Nível',
    lChips: 'Chips por Nível',
    warning:
      'Essa faixa de ±{{limit}} ainda não foi confirmada por teste — é um chute provisório, e ir além pode fazer o jogo parar de funcionar.',
  },
}
