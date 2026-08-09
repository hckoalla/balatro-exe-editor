---
id: bee4-parser-bloco-baralhos
title: "Parser do bloco de definição dos baralhos"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-4
domain_title: "Parsing da Configuração dos Baralhos"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee4-parser-bloco-baralhos · Parser do bloco de baralhos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-4](../../_epicas/BEE-4.md) · Parsing da Configuração dos Baralhos | main |

> Depende de [bee3-extrair-game-lua-do-exe](../bee3-extrair-game-lua-do-exe/item.md).

> Como desenvolvedor, quero parsear o bloco de definição dos baralhos do `game.lua` para uma
> estrutura de dados tipada, para a UI poder ler e editar esses valores sem lidar com texto Lua
> cru.

## Contexto
Os 15 baralhos jogáveis + `b_challenge` ficam definidos num bloco contíguo do `game.lua` (uma
entrada por linha, ex: `b_red = {name = "Red Deck", ..., config = {discards = 1}, ...}`). Cada
baralho tem uma tabela `config` com chaves **opcionais** — nem todo baralho tem todas as chaves.
Não é necessário (nem desejável) um parser Lua genérico: o bloco tem um formato regular o
suficiente pra um parser dedicado, mais simples e mais fácil de manter.

## Critérios de aceitação
- Dado o texto do `game.lua`, retorna uma lista tipada com os 15 baralhos + `b_challenge`: id,
  nome, e os campos de `config` presentes (`dollars`, `hands`, `discards`, `joker_slot`,
  `consumable_slot`, `consumables`) — ausentes ficam `undefined`/não presentes, não `0`.
- Parser não quebra com baralhos que têm `config = {}` (vazio) ou com chaves de `config` não
  relacionadas às 6 conhecidas (ex: `voucher`, `remove_faces`) — essas são ignoradas, não geram
  erro.
- Testado contra o `game.lua` sintético de `bee1-setup-testes-tdd`, cobrindo baralho com todas as
  chaves, baralho com `config` vazio, e baralho com chave desconhecida.

## Fora de escopo
- Editar campos de `config` fora dos 6 conhecidos (ex: `voucher`, `remove_faces`,
  `randomize_rank_suit`) — ver [BEE-10](../../_epicas/BEE-10.md), fase 2.
