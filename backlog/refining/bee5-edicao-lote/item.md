---
id: bee5-edicao-lote
title: "Edição em lote de múltiplos baralhos"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P3
labels: [pos-mvp]
created: "24/ago/26"
updated: "24/ago/26"
---
# bee5-edicao-lote · Edição em lote de múltiplos baralhos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Como usuário, quero aplicar um "setup" de valores a um ou mais baralhos de uma vez, em vez de
> repetir a mesma edição manualmente baralho por baralho.

## Contexto

Reportado na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1): "adicionar
opção de edição em Batch, ou seja, ao colocar um setup, vai editar um ou mais baralhos". Hoje
(MVP) o editor trabalha um baralho de cada vez — `DecksScreen` → escolhe um → `DeckEditorScreen`
→ edita → salva. Aplicar o mesmo "setup" (ex.: +50 dinheiro, +2 slots de joker) em vários
baralhos de uma vez exige repetir esse fluxo manualmente hoje.

**Perguntas em aberto antes de virar `ready`** (Socrático, ainda não perguntado ao usuário):
1. Seleção de baralhos: uma tela nova de multi-seleção na `DecksScreen` (checkboxes), ou um modo
   "aplicar a todos" simples primeiro, deixando seleção parcial pra depois?
2. Os campos de destino: aplica os 4 campos (dollars/joker_slot/consumable_slot/consumables) de
   uma vez, ou o usuário escolhe quais campos entram no "setup"?
3. `consumables` é uma lista, não um número — "aplicar a vários baralhos" significa substituir a
   lista inteira em cada um, ou só adicionar itens à lista existente de cada baralho (que pode já
   ter itens diferentes por baralho)?
4. Confirmação: grava tudo de uma vez (um único fluxo de confirmação pra N baralhos), ou confirma
   e salva baralho por baralho em sequência?
5. Baralhos com valores diferentes hoje: se dois baralhos já têm `dollars` customizado
   diferente, "aplicar +50" soma ao que cada um já tem, ou define um valor absoluto igual pra
   todos? (a app já trata esses campos como deltas — ver contexto de domínio em
   `backlog/README.md` — então "aplicar em lote" reforça essa mesma lógica, mas vale confirmar.)

## Critérios de aceitação (preliminares — revisar no refinamento)

- Usuário consegue selecionar mais de um baralho e aplicar os mesmos valores a todos de uma vez.
- Fica claro na UI que a ação afeta múltiplos baralhos antes de confirmar (não é um clique
  acidental que edita 16 baralhos sem querer).
- Mesmo soft-warning de limites seguros já existente continua valendo por baralho.

## Fora de escopo

- Definido durante o refinamento.
