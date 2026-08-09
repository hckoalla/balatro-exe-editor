---
id: bee5-formulario-valores-numericos
title: "Formulário de edição: dollars, joker_slot, consumable_slot"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee5-formulario-valores-numericos · Formulário de valores numéricos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee5-tela-selecao-baralho](../bee5-tela-selecao-baralho/item.md).

> Como usuário, quero editar o dinheiro inicial, os slots de joker e os slots de consumível de um
> baralho, e ser avisado se o valor pode quebrar o jogo, para poder customizar sem crashar sem
> saber por quê.

## Contexto
Os 3 valores são **deltas** somados ao valor-base do jogo (ver `backlog/README.md` — contexto de
domínio), não valores absolutos. A UI precisa deixar isso claro (ex: "+10 dólares iniciais", não
"10 dólares iniciais").

## Critérios de aceitação
- Campos numéricos pra `dollars`, `joker_slot`, `consumable_slot`, deixando explícito que são
  valores adicionados ao padrão do jogo (não absolutos).
- Ao digitar um valor acima do limite seguro conhecido (`dollars` +230, `joker_slot` +145,
  `consumable_slot` +90), mostra um aviso visível (soft warning) explicando que passou do que já
  foi testado e pode fazer o jogo parar de funcionar — mas **não bloqueia** o campo.
- Aceita valores negativos (reduzir em vez de aumentar), já que o jogo também usa deltas
  negativos (ex: Painted Deck tem `joker_slot = -1`).
- Campo vazio/zerado remove a chave do `config` do baralho (volta ao padrão do jogo).
- Cada campo tem um botão de **reset individual** (ícone de rollback ao lado do campo), visível
  só quando o valor atual difere do padrão do jogo — clicar limpa aquele campo específico, sem
  afetar os outros campos do mesmo baralho. Equivalente a esvaziar o campo, só que com affordance
  visual explícita em vez de o usuário precisar apagar manualmente.
