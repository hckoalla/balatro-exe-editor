// Textos de descrição do jogo usam uma marcação própria pra cor/escala/ícone (`{C:tarot}...{}`,
// `{s:0.8,C:tarot}...{s:0.8}`, `{X:mult,C:white}`, etc.) — confirmado por amostragem que nenhuma
// tag tem chave aninhada, então remover qualquer `{...}` de forma plana já limpa tudo, sem
// precisar entender o significado de cada uma (ver bee5-tooltip-consumiveis).
export function stripBalatroMarkup(text: string): string {
  return text.replace(/\{[^}]*\}/g, '')
}
