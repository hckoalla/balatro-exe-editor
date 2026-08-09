---
id: bee5-tela-selecao-baralho
title: "Tela de seleção de baralho"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee5-tela-selecao-baralho · Tela de seleção de baralho

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee3-selecionar-arquivo-exe](../bee3-selecionar-arquivo-exe/item.md) e
> [bee4-parser-bloco-baralhos](../bee4-parser-bloco-baralhos/item.md).

> Como usuário, quero ver a lista dos 15 baralhos do Balatro (+ desafio) e escolher qual quero
> editar, para ir direto pro formulário do baralho certo.

## Contexto
Primeira tela depois de selecionar o `.exe` válido. Lista os baralhos parseados de
`bee4-parser-bloco-baralhos`.

## Critérios de aceitação
- Lista os 15 baralhos jogáveis + `b_challenge`, pelo nome real (ex: "Red Deck", "Magic Deck").
- Indica visualmente quais baralhos já têm algum valor customizado (diferente do padrão do jogo).
- Selecionar um baralho leva pro formulário de edição (`bee5-formulario-valores-numericos` +
  `bee5-editor-consumiveis-iniciais`).

## Progresso
Concluído em 09/ago/26:
- Movi `DeckConfig`/`ParsedDeck` de `electron/deck-config/deck-entry.ts` pra `src/shared/
  deck-schema.ts` — o renderer também precisa desses tipos pro contrato de IPC, então viram
  fonte única compartilhada (main reexporta de lá).
- `getDecksFromExe` (main) + canal IPC `deck:get-all`: lê o `.exe`, extrai `game.lua`, parseia o
  bloco de baralhos — reaproveita tudo do BEE-4 sem duplicar lógica.
- `DecksScreen`: grid de 16 cards (nome do baralho + badge "Default"/"Customized" conforme
  `config` tá vazio ou não), com estilo do protótipo. `App.tsx` liga `SelectExeScreen` →
  `DecksScreen` → placeholder de edição (tela real vem em `bee5-formulario-valores-numericos`).
- 5 testes novos (2 main + 3 componente).
