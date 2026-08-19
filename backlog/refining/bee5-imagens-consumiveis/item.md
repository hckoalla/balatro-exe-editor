---
id: bee5-imagens-consumiveis
title: "Mostrar imagem de cada consumível no seletor"
type: story
status: refining
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
| refining | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee4-catalogo-consumiveis](../../done/bee4-catalogo-consumiveis/item.md) e
> [bee5-editor-consumiveis-iniciais](../../done/bee5-editor-consumiveis-iniciais/item.md).

> Como usuário, quero ver a imagem de cada Tarot/Planeta/Spectral no buscador e nos itens
> selecionados, em vez de só o nome em texto, pra reconhecer as cartas visualmente.

## Contexto

Hoje `parseConsumableCatalog` (`electron/consumable-catalog/parse-consumable-catalog.ts`) extrai
só `id`, `name` e `category` de cada consumível do `game.lua`. Cada entrada real também tem um
campo `pos = {x=N, y=N}` — a posição da célula dela dentro de um sprite sheet (o próprio jogo usa
isso pra desenhar a carta). O usuário adicionou localmente (`textures/1x/Tarots.png`, agora no
`.gitignore` — ver commit deste lote) o atlas real que o jogo usa pra essas cartas, como
referência.

**Ponto em aberto pra refinar antes de virar `ready`:** de onde a imagem deve vir em produção.
Duas abordagens:
- **(a)** Empacotar uma cópia do atlas dentro do app. Problema: são assets proprietários do jogo
  — não dá pra redistribuir dentro do instalador publicado no Nexus Mods (mesmo motivo de
  `/game.lua` nunca ser versionado).
- **(b)** Extrair o atlas **do próprio `.exe` que o usuário já selecionou** (mesmo mecanismo de
  `locate-embedded-zip.ts`/`extract-game-lua.ts` — o ZIP fusionado do LÖVE2D deveria conter
  `textures/1x/Tarots.png` no mesmo caminho relativo). Não empacota nada proprietário, coerente
  com o resto do app (que já lê tudo do `.exe` do próprio usuário). **Precisa confirmar** que o
  ZIP embutido realmente contém esse arquivo nesse caminho antes de assumir essa abordagem como
  certa.

Também falta confirmar o tamanho de célula do grid do atlas (dimensão fixa por carta) — não
verificado neste codebase ainda.

## Critérios de aceitação (preliminares — revisar no refinamento)

- Catálogo de consumíveis passa a incluir a posição (`pos`) de cada item, extraída do
  `game.lua` junto com `id`/`name`/`category`.
- A imagem de cada consumível vem do `.exe` já selecionado pelo usuário — nenhum asset
  proprietário do jogo é empacotado no instalador distribuído.
- `ConsumablesEditor` mostra a imagem de cada item nos resultados da busca e nos "chips"
  selecionados, não só o nome.
- Fallback gracioso se a imagem não puder ser extraída/decodificada (mostra só o nome, sem
  quebrar a tela).

## Fora de escopo

- Jokers (ver [bee10-jokers-iniciais](../bee10-jokers-iniciais/item.md), ainda depende de
  investigação separada sobre se o jogo suporta jokers iniciais) — quando essa história avançar,
  deve reaproveitar o mesmo mecanismo de extração de imagem definido aqui, não reinventar.
- Assets de fonte/som/shader (`fonts/`, `sounds/`, `shaders/`) — não usados nesta história.
