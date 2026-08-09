---
id: bee4-catalogo-consumiveis
title: "Catálogo de consumíveis (Tarot/Planeta/Spectral)"
type: story
status: qa
owner: ""
sistema: main
domain: BEE-4
domain_title: "Parsing da Configuração dos Baralhos"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee4-catalogo-consumiveis · Catálogo de consumíveis

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-4](../../_epicas/BEE-4.md) · Parsing da Configuração dos Baralhos | main |

> Depende de [bee1-setup-testes-tdd](../bee1-setup-testes-tdd/item.md).

> Como usuário, quero escolher os consumíveis iniciais de um baralho por nome (não por ID interno
> tipo `c_fool`), para não precisar decorar a nomenclatura interna do jogo.

## Contexto
O campo `consumables` de um baralho é uma lista de IDs (`c_fool`, `c_hex`, etc.) referenciando
Tarots, Planetas e cartas Spectral definidos em outras regiões do `game.lua`. Este catálogo
extrai id + nome amigável de cada um, pra popular o seletor da UI (BEE-5).

## Critérios de aceitação
- Catálogo com todos os Tarots, Planetas e Spectrals disponíveis no jogo, cada um com `id` e nome
  amigável (nome real da carta, ex: "The Fool", "Jupiter").
- Catálogo é extraído/gerado a partir da estrutura real do `game.lua` (não hardcoded manualmente
  sem fonte), pra não ficar desatualizado se o jogo mudar de versão.
- Testado contra fixture sintética cobrindo as 3 categorias (Tarot, Planeta, Spectral).

## Fora de escopo
- Expor o catálogo via IPC pro renderer — isso entra junto com
  [bee5-editor-consumiveis-iniciais](../../refining/bee5-editor-consumiveis-iniciais/item.md),
  que é quem de fato consome (é a primeira e única história que precisa disso até agora).

## Progresso
Concluído em 09/ago/26:
- `electron/consumable-catalog/parse-consumable-catalog.ts`: mesmo padrão de scan linha-a-linha
  usado pros baralhos (`BEE-4`), reconhecendo entradas por `set = "Tarot"` / `"Planet"` /
  `"Spectral"` em vez de `"Back"`.
- Estendi `test/fixtures/game.lua` com 2 entradas sintéticas por categoria (`Tarot`, `Planet`,
  `Spectral`), como pools irmãs de `Back` dentro de `P_CENTER_POOLS` — não interfere nos testes
  de baralho já existentes (chave `set` diferente).
- 3 testes: extração com nome amigável, contagem por categoria, confirmação de que entradas de
  baralho (`set = "Back"`) não vazam pro catálogo de consumíveis.
