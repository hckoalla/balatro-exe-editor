---
id: bee5-testar-limites-seguros
title: "Retestar limites seguros dos campos numéricos"
type: spike
status: ready
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P3
labels: [pos-mvp]
created: "24/ago/26"
updated: "24/ago/26"
---
# bee5-testar-limites-seguros · Retestar limites seguros dos campos numéricos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| ready | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Como usuário, quero saber se dá pra aumentar os limites seguros já testados (dinheiro, slots
> de joker, slots de consumível), já que o jogo parece aguentar valores maiores conforme a
> partida avança.

## Contexto

Reportado na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1). Os limites
atuais (`dollars` +230, `joker_slot` +145, `consumable_slot` +90, `consumables` ~30 itens,
documentados em `backlog/README.md`) foram testados empiricamente pelo usuário no início do
projeto — acima disso, o jogo pode parar de funcionar **no início da run**. A hipótese do usuário
é que, como esses mesmos valores crescem naturalmente durante uma partida normal (comprar mais
slots de joker na loja, acumular dinheiro, etc.), talvez o jogo aguente valores iniciais mais
altos do que os testados — o teste original pode ter sido conservador.

Isso **não dá pra confirmar por leitura de código** — os limites reais dependem de como a UI do
jogo desenha/organiza esses elementos na tela (quantos slots cabem visualmente, por exemplo), o
que só um teste manual no jogo revela.

## Critérios de aceitação

- Usuário testa manualmente, aumentando cada valor gradualmente num baralho editado (dinheiro,
  slots de joker, slots de consumível, quantidade de consumíveis), até achar onde o jogo
  realmente quebra ou fica visualmente ruim.
- Resultado registrado aqui (nesta história, na seção Progresso) com os novos limites — por
  campo, não necessariamente o mesmo múltiplo de antes.
- Se novos limites forem confirmados, `backlog/README.md` (contexto de domínio) e as constantes
  de soft-warning no código (`NumericFieldsForm`/`ConsumablesEditor`, `SAFE_LIMIT` etc.) são
  atualizadas pra bater com o que foi testado.

## Fora de escopo

- Qualquer aumento de limite sem teste manual confirmado — não adivinhar/estimar valores.
