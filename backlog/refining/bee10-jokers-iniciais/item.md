---
id: bee10-jokers-iniciais
title: "Escolher jokers iniciais do baralho"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-10
domain_title: "Editor Avançado de Campos (Fase 2)"
priority: P2
labels: [fase2]
created: "09/ago/26"
updated: "09/ago/26"
---
# bee10-jokers-iniciais · Escolher jokers iniciais do baralho

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P2 | [BEE-10](../../_epicas/BEE-10.md) · Editor Avançado de Campos (Fase 2) | main |

> Depende de investigação do usuário sobre como o jogo trata jokers iniciais — ver Contexto.

> Como usuário, quero escolher quais Jokers um baralho já começa tendo (análogo ao que
> `bee5-editor-consumiveis-iniciais` fez pra Tarots/Planetas/Spectrals), para customizar o início
> de uma run com Jokers específicos.

## Contexto
Pedido pelo usuário (09/ago/26), com uma ressalva importante dele mesmo: **ainda não sabemos se
o jogo suporta isso**. O campo `consumables` do `config` de um baralho existe e é conhecido (ver
`backlog/README.md` — contexto de domínio), mas não confirmamos se existe um campo equivalente
pra Jokers iniciais (algo como `jokers = {...}` dentro do `config`) — pode ser que o mecanismo
seja diferente, ou que não exista suporte nativo pra isso no `game.lua`, exigindo outra
abordagem.

**Antes de refinar critérios de aceite de verdade**, o usuário vai analisar o `game.lua` real pra
confirmar se/como esse campo existe. Esta história fica registrada como intenção, não como
especificação pronta pra implementar.

## Critérios de aceitação (preliminares — revisar depois da investigação)
- Confirmar (fora do código, análise do usuário) se existe um campo em `config` que define quais
  Jokers um baralho começa tendo, e qual o formato dele (lista de IDs, como `consumables`? outro
  formato?).
- Se existir: reaproveitar o padrão de `ConsumablesEditor` (busca por nome, adiciona/remove,
  duplicata permitida) pra um catálogo de Jokers, do mesmo jeito que
  `bee4-catalogo-consumiveis` fez pra Tarots/Planetas/Spectrals.
- Se não existir um campo nativo equivalente: esta história precisa ser reescrita ou cancelada —
  não inventar um mecanismo que o jogo não suporta.

## Fora de escopo
- Qualquer implementação antes da investigação do usuário confirmar que o campo existe.

## Nota (19/ago/26)
Se avançar, os Jokers devem mostrar imagem no seletor igual os consumíveis — reaproveitar o
mecanismo de extração de imagem definido em
[bee5-imagens-consumiveis](../bee5-imagens-consumiveis/item.md), não reinventar.
