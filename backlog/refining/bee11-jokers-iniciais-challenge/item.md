---
id: bee11-jokers-iniciais-challenge
title: "Escolher jokers iniciais de um Challenge"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-11
domain_title: "Challenges (Fase 2)"
priority: P2
labels: [fase2]
created: "09/ago/26"
updated: "19/ago/26"
---
# bee11-jokers-iniciais-challenge · Escolher jokers iniciais de um Challenge

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P2 | [BEE-11](../../_epicas/BEE-11.md) · Challenges (Fase 2) | main |

> Reescrita de `bee10-jokers-iniciais` (09/ago/26 → 19/ago/26) — era sobre baralho, virou sobre
> Challenge depois da investigação abaixo. Depende de
> [bee5-imagens-consumiveis](../../ready/bee5-imagens-consumiveis/item.md) pro mecanismo de
> imagem (mesmo padrão, reaproveitado pra jokers).

> Como usuário, quero escolher quais Jokers um Challenge já começa tendo, para customizar o
> início de uma run de Challenge com Jokers específicos.

## Contexto

Pedido original (09/ago/26): jokers iniciais **por baralho**, análogo a
`bee5-editor-consumiveis-iniciais`. Investigação socrática (19/ago/26), com o código-fonte real
do jogo (`balatro-exe-source-code/`, local e fora do git — usuário extraiu do próprio
`balatro.exe`), **confirmou que esse mecanismo não existe pra baralho**:

- `back.lua`, função `Back:apply_to_run()` (linhas 174–278) — lê um conjunto **fechado** de 19
  chaves do `config` de um baralho (`dollars`, `hands`, `discards`, `joker_slot`,
  `consumable_slot`, `consumables`, `voucher`, `vouchers`, `spectral_rate`, `remove_faces`,
  `reroll_discount`, `edition`, `edition_count`, `randomize_rank_suit`, `hand_size`,
  `ante_scaling`, `no_interest`, `extra_hand_bonus`, `extra_discard_bonus`). Nenhuma delas é
  `jokers`.
- `challenges.lua`, tabela `G.CHALLENGES` (arquivo **separado** dentro do mesmo ZIP fusionado,
  não `game.lua`) — 20 Challenges reais (`c_omelette_1` "The Omelette", `c_city_1` "15 Minute
  City", etc.), cada um com sua própria lista `jokers = {{id='j_egg'}, ...}`, além de
  `consumeables`, `vouchers`, `rules`, `restrictions`, `deck`. **É aqui que jokers iniciais
  existem de verdade.**

Escopo desta história (refinado 19/ago/26, decisão explícita do usuário): **só a lista `jokers`**
de um Challenge existente — não `consumeables`/`vouchers`/`rules`/`restrictions`/`deck` do
Challenge (isso ficaria pra uma história maior de "editor de Challenge completo", se algum dia
fizer sentido — não é este item).

**Pré-requisito técnico** (ver [BEE-11](../../_epicas/BEE-11.md)): o motor do `.exe`
(`electron/exe-engine/extract-game-lua.ts`, `update-game-lua-in-exe.ts`) tem
`GAME_LUA_ENTRY = 'game.lua'` fixo — só sabe ler/escrever esse arquivo específico do ZIP.
Precisa generalizar pra aceitar qualquer caminho de entrada (`challenges.lua` incluso), sem
quebrar o uso atual pra `game.lua`.

O catálogo de jokers (id/name/pos, pra imagem) também não existe ainda no app — `game.lua` tem
148 definições `j_*` (ex. `j_joker` na linha 368), no mesmo formato que
`parseConsumableCatalog` já lê pra Tarot/Planet/Spectral. `textures/1x/Jokers.png` é o atlas
equivalente ao `Tarots.png`.

## Critérios de aceitação

- Motor do `.exe` generalizado pra ler/escrever qualquer entrada do ZIP por caminho (não só
  `game.lua`), sem regressão no fluxo de baralho existente.
- Catálogo de jokers extraído do `game.lua` (id, nome, `pos`) — mesmo padrão de
  `parseConsumableCatalog`.
- Usuário consegue escolher um dos 20 Challenges reais e editar sua lista `jokers` — reaproveita
  o padrão de `ConsumablesEditor` (busca por nome, adiciona/remove, imagem por item via o
  mecanismo de `bee5-imagens-consumiveis`, adaptado pro atlas de jokers).
- Escrita grava de volta em `challenges.lua` dentro do ZIP, preservando todo o resto do arquivo
  (mesmo cuidado que `serializeDeckBlock` já tem com `game.lua` — não pode corromper as outras
  19 Challenges nem os campos fora de `jokers` do Challenge editado).

## Fora de escopo

- `consumeables`/`vouchers`/`rules`/`restrictions`/`deck` de um Challenge — só `jokers`.
- Criar Challenges novos (só editar a lista `jokers` dos 20 existentes).
- Jokers iniciais por baralho comum — confirmado que o jogo não suporta.
