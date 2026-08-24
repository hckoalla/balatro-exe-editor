---
id: bee5-modal-confirmacao
title: "Confirmação de ações destrutivas vira modal, não bloco inline"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P3
labels: [pos-mvp]
created: "24/ago/26"
updated: "24/ago/26"
---
# bee5-modal-confirmacao · Confirmação de ações destrutivas vira modal

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Como usuário, quero que a confirmação de salvar/restaurar apareça num modal centralizado, não
> como um bloco que empurra o resto da tela pra baixo.

## Contexto

Pedido direto do usuário (24/ago/26), depois de aprovar o smoke test da v1.2 inteira. Hoje os 4
lugares que pedem confirmação antes de uma ação que grava no `.exe` (`SaveButton`,
`BatchSaveButton`, `PokerHandsSaveButton`, `RestoreButton` — esse último já compartilhado pelos 3
botões de restaurar) renderizam o bloco de confirmação **inline**, logo abaixo do botão que
disparou — empurra o conteúdo da tela pra baixo em vez de aparecer centralizado por cima.

## Critérios de aceitação

- Novo componente `Modal` reutilizável: overlay escurecido cobrindo a tela inteira, caixa
  centralizada com o conteúdo. Fecha ao clicar no overlay (fora da caixa) ou apertar Esc — clicar
  dentro da caixa não fecha.
- `SaveButton`, `BatchSaveButton`, `PokerHandsSaveButton` e `RestoreButton` passam a abrir esse
  modal pra confirmação, em vez do bloco inline atual — mesmo texto/botões de sempre, só muda
  onde aparece.
- Comportamento de confirmar/cancelar continua idêntico (mesmos testes existentes desses 4
  componentes continuam passando, só ajustados pra estrutura do modal onde necessário).

## Fora de escopo

- Redesenhar o conteúdo dos textos de confirmação — só a moldura (modal em vez de inline).
