---
id: bee11-jokers-iniciais-challenge
title: "Escolher jokers iniciais de um Challenge"
type: story
status: fase3
owner: ""
sistema: main
domain: BEE-11
domain_title: "Challenges (Fase 2)"
priority: P2
labels: [fase2, fase3]
created: "09/ago/26"
updated: "20/ago/26"
---
# bee11-jokers-iniciais-challenge · Escolher jokers iniciais de um Challenge

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| fase3 | P2 | [BEE-11](../../_epicas/BEE-11.md) · Challenges (Fase 2) | main |

> **Fase 3** (20/ago/26, decisão explícita do usuário): tecnicamente viável (ver
> [Abordagem técnica](#abordagem-técnica) abaixo, já mapeada em detalhe), mas deliberadamente
> deixada por último — depois de tudo o mais em `fase2`. A análise foi feita agora pra não perder
> o raciocínio, não pra sinalizar prioridade.

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
`parseConsumableCatalog` já lê pra Tarot/Planet/Spectral. `resources/textures/1x/Jokers.png` é o
atlas equivalente ao `Tarots.png` — **atenção ao prefixo `resources/`**: `bee5-imagens-consumiveis`
usou `textures/1x/Tarots.png` (sem esse prefixo) inicialmente e o atlas nunca era encontrado no
`.exe` real; só corrigido depois de listar as entradas reais do ZIP. Não repetir o mesmo erro
aqui — confirmar o caminho contra o `.exe` de verdade antes de assumir.

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

## Abordagem técnica

Análise feita em 20/ago/26 com `challenges.lua` real (`balatro-exe-source-code/`, local e fora
do git). Confirma que é viável, e por quê é mais complexo que editar um baralho.

### Por que não dá pra reaproveitar `parseDeckBlock` direto

`parse-deck-block.ts` acha cada baralho fazendo `gameLuaSource.split('\n')` e testando **linha
por linha** — funciona porque cada baralho é uma tabela Lua de uma linha só. Cada entrada de
`challenges.lua` tem **~40 linhas** (ex.: "The Omelette" vai da linha 62 à 102 no arquivo real) —
não dá pra casar uma entrada por linha.

O que **já reaproveita 100% sem mudança**: `extractBalancedBraces(text, openIndex)`
(`electron/deck-config/deck-entry.ts`) conta chaves por **índice de caractere**, não por linha —
já é agnóstico a quebra de linha, só nunca foi exercitado assim porque `config` de um baralho
sempre coube numa linha.

### O problema novo: comentário Lua com chaves dentro

`challenges.lua` abre com um bloco `--[[ ... ]]--` de ~60 linhas (um template "TEST" comentado)
que **contém a mesma estrutura de chaves aninhadas** de uma entrada real (`rules = {...}`,
`jokers = {...}`, etc.). Um contador de chaves ingênuo, sem saber que aquilo é comentário, conta
essas chaves como se fossem uma 21ª entrada de verdade — corrompe a indexação.

Confirmado por inspeção: **todo comentário do arquivo fica dentro desse único bloco** — as 20
entradas reais (linhas 62–738) não têm nenhum `--` solto no meio. Não elimina a necessidade de
tratar comentário Lua de forma genérica (o jogo pode atualizar e adicionar/remover comentários),
mas confirma que o caso real de hoje é só esse um bloco, não comentários espalhados.

### Algoritmo proposto

1. Achar `G.CHALLENGES = {` no texto bruto do arquivo (regex) → índice do `{` de abertura.
2. Extrair o array inteiro com `extractBalancedBraces` (reaproveitado sem mudança) — dá o bloco
   completo (comentário + 20 entradas) como uma string só.
3. **Novo**: dentro desse bloco, localizar e marcar o(s) intervalo(s) de comentário Lua
   (`--[[` até `]]--`, e variantes `--[==[`/`]==]`) pra **pular** esses índices ao contar chaves —
   não apagar o texto (evita desalinhar offsets pra escrita depois), só ignorar na hora de achar
   fronteira de entrada.
4. **Novo**: caminhar o bloco por profundidade de chave (mesmo princípio de
   `extractBalancedBraces`, generalizado pra **coletar várias fatias** em vez de parar na
   primeira `}` que fecha) — cada transição profundidade 0→1 marca o início de uma entrada,
   1→0 marca o fim. Pulando os intervalos de comentário do passo 3, isso produz exatamente as 20
   entradas reais, em ordem, cada uma como uma string com seu range original no arquivo.
5. Achar a entrada certa comparando `id = '...'` (ou `name = '...'`) de cada uma contra o
   Challenge escolhido — mesma técnica de `extractStringField` já usada em `parse-deck-block.ts`.
6. Dentro da entrada isolada, achar o sub-bloco `jokers = {...}` reaproveitando
   `findConfigBlock`/`extractBalancedBraces` (generalizar `findConfigBlock` pra aceitar o nome da
   chave como parâmetro, em vez de fixo em `'config'`).
7. Serializar a nova lista de jokers (`{id = '...'}`, com `edition`/`eternal`/`pinned` opcionais)
   e substituir exatamente esse range de texto — mesmo princípio de splice que
   `serializeDeckBlock` já usa, só que operando sobre um sub-range dentro de uma entrada
   multi-linha, em vez de uma linha inteira.
8. Regravar a entrada editada de volta no array, e o array de volta no `challenges.lua` completo
   (mesmo padrão de splice em cadeia).

### Peças novas vs. reaproveitadas

| Peça | Status |
|---|---|
| Contagem de chaves balanceadas (`extractBalancedBraces`) | Reaproveita sem mudar |
| Achar sub-bloco por nome de chave (`findConfigBlock`) | Reaproveita, generalizar nome da chave |
| Extrair campo string (`id`/`name`) | Reaproveita (`extractStringField`) |
| Detectar/pular intervalo de comentário Lua | **Novo** |
| Caminhar um bloco coletando várias entradas top-level (em vez de achar uma só) | **Novo** |
| Motor do `.exe` genérico por caminho de entrada (não só `game.lua`) | **Novo** (mas já é
  critério de aceitação desta história, não add-on) |
