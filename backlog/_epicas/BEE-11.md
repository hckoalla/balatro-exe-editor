---
id: BEE-11
title: "Challenges (Fase 2)"
type: epic
sistema: main
created: "19/ago/26"
---
# BEE-11 · Challenges (Fase 2)

Challenges são uma estrutura de dados totalmente separada dos baralhos (`b_*`) que o MVP edita:
vivem em `challenges.lua` (arquivo próprio dentro do mesmo ZIP fusionado do `.exe`, não em
`game.lua`), e cada um dos 20 Challenges reais do jogo (`G.CHALLENGES`, ex: "The Omelette",
"Jokerless") define seu próprio conjunto de jokers/consumíveis/vouchers/regras/restrições
iniciais — mecanismo que **não existe** pra baralho comum (confirmado lendo `back.lua`, a função
`Back:apply_to_run()` tem uma lista fechada de 19 chaves, nenhuma delas `jokers`).

Nasceu do refinamento de `bee10-jokers-iniciais` (09→19/ago/26): o pedido original era escolher
jokers iniciais **por baralho**, análogo a `bee5-editor-consumiveis-iniciais`. Investigação no
código-fonte real do jogo (`balatro-exe-source-code/`, local e fora do git) confirmou que esse
mecanismo só existe pra Challenge, não pra Deck — daí a história virar Challenge, e ganhar épica
própria em vez de ficar deslocada dentro de BEE-10 (que é sobre campos de baralho).

Critérios de sucesso:
- Usuário consegue editar o conjunto inicial de jokers de um Challenge existente.
- Motor de leitura/escrita do `.exe` (BEE-3) generalizado pra ler/escrever qualquer entrada do
  ZIP por caminho, não só `game.lua` — pré-requisito técnico, hoje `GAME_LUA_ENTRY` é fixo em
  `extract-game-lua.ts`/`update-game-lua-in-exe.ts`.
