---
id: bee5-imagens-consumiveis
title: "Mostrar imagem de cada consumível no seletor"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P3
labels: [pos-mvp]
created: "19/ago/26"
updated: "19/ago/26"
---
# bee5-imagens-consumiveis · Mostrar imagem de cada consumível no seletor

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee4-catalogo-consumiveis](../../done/bee4-catalogo-consumiveis/item.md) e
> [bee5-editor-consumiveis-iniciais](../../done/bee5-editor-consumiveis-iniciais/item.md).

> Como usuário, quero ver a imagem de cada Tarot/Planeta/Spectral no buscador e nos itens
> selecionados, em vez de só o nome em texto, pra reconhecer as cartas visualmente.

## Contexto

Hoje `parseConsumableCatalog` (`electron/consumable-catalog/parse-consumable-catalog.ts`) extrai
só `id`, `name` e `category` de cada consumível do `game.lua`. Cada entrada real também tem um
campo `pos = {x=N, y=N}` — a posição da célula dela dentro de um sprite sheet (o próprio jogo usa
isso pra desenhar a carta).

**Refinado em 19/ago/26** — as duas dúvidas técnicas que travavam esta história foram resolvidas:

- **Origem da imagem**: o usuário confirmou que extraiu `fonts/`, `sounds/`, `textures/`,
  `shaders/` do próprio `balatro.exe` (mesmo truque do 7-Zip usado pro `game.lua`). Isso confirma
  que o ZIP fusionado do LÖVE2D contém `textures/1x/Tarots.png` no mesmo caminho relativo —
  então a imagem pode (e deve) ser extraída **do próprio `.exe` que o usuário já selecionou no
  app**, reaproveitando o mesmo mecanismo de `locate-embedded-zip.ts`/`extract-game-lua.ts`.
  Nenhum asset proprietário precisa ser empacotado no instalador distribuído.
- **Tamanho de célula do atlas**: confirmado por matemática, não estimativa. Tarot/Planet/
  Spectral dividem o mesmo atlas (`textures/1x/Tarots.png`, 710×570px) — `pos` no `game.lua` vai
  até `x=9`/`y=5` pros três `set`s (ex.: `c_fool` Tarot `pos={x=0,y=0}`, `c_mercury` Planet
  `pos={x=0,y=3}`, `c_ankh` Spectral `pos={x=0,y=5}`). 710÷10 = 71, 570÷6 = 95 — **célula =
  71×95px** (142×190px na versão `2x`). `pixel_x = pos.x * 71`, `pixel_y = pos.y * 95`.

## Critérios de aceitação

- Catálogo de consumíveis passa a incluir a posição (`pos`) de cada item, extraída do
  `game.lua` junto com `id`/`name`/`category`.
- A imagem de cada consumível vem do `.exe` já selecionado pelo usuário (extraída do ZIP
  embutido, caminho `textures/1x/Tarots.png`) — nenhum asset proprietário do jogo é empacotado
  no instalador distribuído.
- `ConsumablesEditor` mostra a imagem de cada item nos resultados da busca e nos "chips"
  selecionados, não só o nome — recorte de 71×95px (grid `pos.x * 71, pos.y * 95`) do atlas.
- Fallback gracioso se o atlas não puder ser extraído/decodificado (mostra só o nome, sem
  quebrar a tela) — mesmo padrão de erro silencioso não-bloqueante já usado em
  `saveDeckToExe`/`detectPreexistingEdits`.

## Fora de escopo

- Jokers (ver [bee11-jokers-iniciais-challenge](../../fase3/bee11-jokers-iniciais-challenge/item.md)
  — confirmado que é recurso de Challenge, não de Deck, e deliberadamente adiada pra fase 3) —
  quando essa história avançar, deve reaproveitar o mesmo mecanismo de extração de imagem
  definido aqui, não reinventar.
- Assets de fonte/som/shader (`fonts/`, `sounds/`, `shaders/`) — não usados nesta história.

## Progresso

Concluído em 20/ago/26. 130 testes passando, tsc/lint limpos, build de produção ok.

- `electron/exe-engine/extract-file-from-exe.ts` (+ teste): versão genérica de `extractGameLua`,
  extrai qualquer entrada do ZIP embutido por caminho, retorna `Buffer`.
- `parseConsumableCatalog` agora extrai `pos` de cada consumível (regex `pos = {x=N,y=N}`) —
  `ConsumableCatalogEntry` ganhou o campo `pos: { x, y }` em `src/shared/consumable-catalog-schema.ts`.
  Fixture `test/fixtures/game.lua` atualizada com `pos` em todas as entradas de consumível.
- `electron/consumable-catalog/get-consumable-atlas-from-exe.ts` (+ teste): extrai
  `textures/1x/Tarots.png` do `.exe` do usuário via `extractFileFromExe`, retorna como
  `data:image/png;base64,...`. Nunca lança — `null` se o atlas não existir/não puder ser lido
  (fallback silencioso, mesmo padrão de `detectPreexistingEdits`).
- Novo canal IPC `getConsumableAtlas` (`consumable-catalog:get-atlas`) — contrato
  (`ipc-contract.ts`), `preload.ts`, handler (`register-consumable-catalog-handlers.ts`) e mock
  global de teste (`vitest.setup.ts`) todos atualizados.
- `DeckEditorScreen` busca o atlas via IPC junto com o catálogo, passa como prop pro
  `ConsumablesEditor`.
- `ConsumablesEditor` recorta o atlas via CSS (`background-image` + `background-size` +
  `background-position`, escalado de 71×95px reais pra 28×~37px de exibição) — mostra o sprite
  nos resultados da busca e nos chips selecionados. Sem atlas (`null`), nenhum `background-image`
  é aplicado — cai pro fallback de mostrar só o nome, sem quebrar a tela.
- 3 novos testes de componente cobrindo: recorte correto por posição, ausência de sprite sem
  atlas, e sprite também aparecendo nos chips.

**Não verificado visualmente** (sem captura de tela de janela nativa do Windows neste ambiente,
mesma limitação já registrada em `bee1-splash-nativa`) — vale conferir o tamanho/proporção do
sprite (28×37px) ao abrir o app de verdade.
