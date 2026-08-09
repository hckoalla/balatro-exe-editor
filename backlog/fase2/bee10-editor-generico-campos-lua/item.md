---
id: bee10-editor-generico-campos-lua
title: "Editor genérico para outros campos do game.lua"
type: story
status: fase2
owner: ""
sistema: main
domain: BEE-10
domain_title: "Editor Avançado de Campos (Fase 2)"
priority: P2
labels: [fase2]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee10-editor-generico-campos-lua · Editor genérico de campos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| fase2 | P2 | [BEE-10](../../_epicas/BEE-10.md) · Editor Avançado de Campos (Fase 2) | main |

> Como usuário avançado, quero editar outros valores do `game.lua` além dos 4 do MVP (ex:
> `hands`, `discards`, ou campos de `config` como `voucher`/`remove_faces`), para não ficar
> limitado ao que foi pensado no MVP.

## Contexto
O parser do MVP (`bee4-parser-bloco-baralhos`) já ignora — sem quebrar — chaves de `config` fora
das 6 conhecidas. Esta história é sobre expor essas chaves (e possivelmente outras regiões do
arquivo) de forma editável, sem precisar de uma história nova por campo.

## Critérios de aceitação
- Usuário consegue editar campos do `config` dos baralhos além dos 4 do MVP (ex: `hands`,
  `discards`, `hand_size`), reaproveitando o parser/serializador de BEE-4.
- Interface não exige conhecimento da estrutura interna do Lua — continua sendo um formulário
  guiado, não um editor de texto livre.

## Fora de escopo
- Editor de texto Lua livre/genérico (edição direta do arquivo) — risco alto de corromper o
  `game.lua` sem validação nenhuma; fora de escopo mesmo pra fase 2.
