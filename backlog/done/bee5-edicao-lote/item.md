---
id: bee5-edicao-lote
title: "Edição em lote de múltiplos baralhos"
type: story
status: done
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
| done | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Como usuário, quero aplicar um "setup" de valores a um ou mais baralhos de uma vez, em vez de
> repetir a mesma edição manualmente baralho por baralho.

## Contexto

Reportado na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1): "adicionar
opção de edição em Batch, ou seja, ao colocar um setup, vai editar um ou mais baralhos". Hoje
(MVP) o editor trabalha um baralho de cada vez — `DecksScreen` → escolhe um → `DeckEditorScreen`
→ edita → salva. Aplicar o mesmo "setup" (ex.: +50 dinheiro, +2 slots de joker) em vários
baralhos de uma vez exige repetir esse fluxo manualmente hoje.

**Refinamento (24/ago/26)** — decisões do usuário pras 5 perguntas abertas:

1. **Seleção**: tela nova, com checkboxes — seleção parcial desde o início, não um modo
   "aplicar a todos" simplificado primeiro.
2. **Campos**: o "setup" sempre inclui os 4 campos juntos (`dollars`, `joker_slot`,
   `consumable_slot`, `consumables`) — não há escolha de subconjunto de campos por aplicação.
3. **`consumables`**: a lista definida no "setup" **substitui** a lista de consumíveis de cada
   baralho selecionado (não soma/anexa aos itens que o baralho já tinha).
4. **Confirmação**: um único fluxo de confirmação cobre todos os baralhos selecionados — grava
   tudo de uma vez, não baralho por baralho em sequência.
5. **Semântica dos valores numéricos**: o "setup" define um **valor absoluto**, igual pra todos
   os baralhos selecionados — **sobrescreve** o delta que cada baralho já tinha, não soma a ele.
   Isso é uma exceção deliberada ao comportamento padrão de "campos são deltas" (ver
   `backlog/README.md`): fora do fluxo de lote, cada campo editado individualmente continua sendo
   delta somado ao valor-base do jogo; dentro do fluxo de lote, o valor digitado no "setup" se
   torna o novo delta de cada baralho selecionado, substituindo o anterior. Precisa ficar claro
   na UI que a edição em lote **substitui** valores existentes, não adiciona a eles.

**Refinamento adicional (24/ago/26, decidido durante o refinamento de**
**[bee12-editor-niveis-mao-poker](../bee12-editor-niveis-mao-poker/item.md))**: a app terá três
abas/telas de edição coexistindo — **Edição de Baralho** (MVP), **Edição de Baralho por Lote**
(esta história) e **Edição de Mão de Pôquer** — cada uma seu próprio fluxo, sem se misturar.

## Critérios de aceitação

- Nova tela (ou modal) de seleção de baralhos, com checkbox por baralho — permite seleção parcial
  (1 a N baralhos, não precisa ser todos).
- Formulário de "setup" com os 4 campos (`dollars`, `joker_slot`, `consumable_slot`,
  `consumables`), preenchidos de uma vez, aplicados igualmente a todos os baralhos selecionados.
- Ao confirmar, grava o mesmo valor absoluto nos 4 campos de todos os baralhos selecionados,
  substituindo (não somando) o que cada um já tinha — incluindo a lista `consumables` (substitui
  a lista inteira, não anexa).
- Um único fluxo de confirmação cobre a operação inteira; a UI deixa claro, antes de confirmar,
  quantos/quais baralhos serão afetados e que os valores serão **substituídos**.
- Mesmo soft-warning de limites seguros já existente (`backlog/README.md`) continua valendo,
  avaliado por baralho.
- Grava de volta no `game.lua` sem corromper baralhos não selecionados nem o resto do arquivo.

## Fora de escopo

- Escolher subconjunto de campos por aplicação (ex.: só `dollars`, sem os outros 3) — sempre os
  4 juntos, nesta primeira versão.
- Modo "somar ao delta existente" em vez de substituir — fica pra uma iteração futura, se houver
  demanda.
- Confirmação/gravação baralho por baralho (com possibilidade de cancelar no meio) — é tudo ou
  nada.
