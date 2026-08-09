import type { Messages } from './en'

export const es: Messages = {
  selectExe: {
    title: 'Encontremos tu juego',
    subtitle: 'Indícame tu balatro.exe y yo me encargo del resto.',
    continueWith: 'Continuar con {{path}}',
    browse: 'Buscar balatro.exe',
    invalidTitle: 'No es un ejecutable válido de Balatro',
    genericInvalid: 'Esto no parece ser un balatro.exe válido.',
  },
  decks: {
    loading: 'Cargando mazos…',
    title: 'Elige un mazo',
    subtitle: 'Elige un mazo para personalizar sus reglas iniciales.',
    customized: 'Personalizado',
    default: 'Predeterminado',
  },
  deckEditor: {
    back: 'Atrás',
  },
  numericFields: {
    dollars: 'Dinero Inicial',
    jokerSlot: 'Espacios de Joker',
    consumableSlot: 'Espacios de Consumible',
    addedToBase: 'Se suma al valor base del juego.',
    resetField: 'Restablecer {{label}}',
    warning:
      'Este valor no ha sido probado (rango seguro hasta ±{{limit}}) y podría hacer que el juego deje de funcionar.',
  },
  consumables: {
    label: 'Consumibles Iniciales',
    searchPlaceholder: 'Buscar Tarots, Planetas, Spectrals…',
    resetLabel: 'Restablecer Consumibles Iniciales',
    removeLabel: 'Quitar {{name}}',
    warning:
      'Esta lista no ha sido probada por encima de {{limit}} elementos y podría hacer que el juego deje de funcionar.',
  },
  save: {
    button: 'Guardar',
    confirmBody: 'Esto escribirá directamente en tu balatro.exe. Cierra Balatro antes de continuar.',
    confirmYes: 'Sí, guardar',
    cancel: 'Cancelar',
    success: 'Guardado con éxito.',
    genericError: 'No se pudo guardar — inténtalo de nuevo.',
  },
  restore: {
    button: 'Restaurar Predeterminado',
    confirmBody:
      'Esto deshará todas las personalizaciones de este juego — todos los mazos vuelven a sus valores predeterminados. Cierra Balatro antes de continuar.',
    confirmYes: 'Sí, restaurar',
    cancel: 'Cancelar',
  },
}
