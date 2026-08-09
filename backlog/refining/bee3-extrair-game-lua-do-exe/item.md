---
id: bee3-extrair-game-lua-do-exe
title: "Extrair o game.lua do balatro.exe"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-3
domain_title: "Motor de Leitura/Escrita do balatro.exe"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee3-extrair-game-lua-do-exe · Extrair o game.lua

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-3](../../_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe | main |

> Depende de [bee3-localizar-zip-embutido-no-exe](../bee3-localizar-zip-embutido-no-exe/item.md).

> Como desenvolvedor, quero extrair o conteúdo de `game.lua` de dentro do ZIP embutido no `.exe`,
> para ter o texto do arquivo em memória e poder parseá-lo (BEE-4).

## Contexto
Equivalente automatizado do passo manual "abrir o `.exe` no 7-Zip e extrair o `game.lua`".

## Critérios de aceitação
- Dado o buffer de um `.exe` válido, retorna o conteúdo de `game.lua` como texto (string).
- Se `game.lua` não existir dentro do ZIP (não é o Balatro, ou é uma versão muito diferente),
  retorna um erro claro.
- Testado contra o `.exe` sintético de `bee1-setup-testes-tdd`.
