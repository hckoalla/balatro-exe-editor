---
id: bee5-aviso-joker-slots-challenge
title: "Avisar que alguns desafios sobrescrevem os slots de joker do baralho de desafio"
type: story
status: in-progress
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P3
labels: [pos-mvp]
created: "24/ago/26"
updated: "24/ago/26"
---
# bee5-aviso-joker-slots-challenge · Avisar sobre desafios que sobrescrevem joker slots

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| in-progress | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Como usuário, quero saber que editar os slots de joker do baralho de desafio não tem efeito
> em alguns desafios específicos, em vez de achar que o app tem um bug.

## Contexto

Reportado na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1): "Tem um
desafio que editar a quantidade de jokers não funciona". **Não é bug do app** — confirmado a
causa raiz em `balatro-exe-source-code/game.lua` e `challenges.lua` (local, fora do git):

- `Back:apply_to_run()` (`back.lua:257-259`) aplica `config.joker_slot` do baralho como
  **delta** (`+=`) — é o que o editor já faz corretamente hoje.
- Challenges têm seu próprio `rules.modifiers`, aplicado **depois** do baralho
  (`game.lua`, bloco `if args.challenge then ... self.GAME.starting_params[v.id] = v.value`) —
  isso é uma **atribuição direta** (`=`), não soma. Se um desafio tem `joker_slots` no
  `modifiers`, ele sobrescreve totalmente o que veio do baralho.
- Confirmados em `challenges.lua` pelo menos 4 desafios reais que fazem isso: **Blast Off**
  (`joker_slots = 4`), **Five-Card Draw** (`joker_slots = 7`), **Cruelty** (`joker_slots = 3`),
  **Jokerless** (`joker_slots = 0` — proposital, é o ponto do desafio). Tem ainda o **Typecast**,
  que usa `set_joker_slots_ante` (regra `custom`, mecanismo diferente, também sobrescreve).

Ou seja: o editor já grava o valor certo no `.exe`; é o próprio desafio, ao rodar, que ignora o
que está no baralho e força seu próprio valor fixo. Mesma família de problema do Luxury Tax
(`bee5-aviso-luxury-tax`) — desafios sobrescrevendo config do baralho de desafio.

**Confirmação do usuário (24/ago/26)**: o desafio especificamente reportado com esse problema é o
**Blast Off** — no PT-BR do jogo (`balatro-exe-source-code/localization/pt_BR.lua`,
`c_blast_off_1="Decolar"`), é o **"Decolar"**, 16º desafio na lista real (`challenges.lua`,
contagem confirmada por código). Os outros 4 (Five-Card Draw, Cruelty, Jokerless, Typecast) têm a
mesma causa raiz confirmada em código, mas não foram os que geraram o report original.

## Critérios de aceitação

- Ao editar o campo `joker_slot` do baralho `b_challenge` (Challenge Deck) especificamente,
  mostra uma nota informativa explicando que alguns desafios (ex.: Jokerless, Blast Off,
  Five-Card Draw, Cruelty, Typecast) definem seus próprios slots de joker, ignorando o valor
  editado aqui.
- Não bloqueia a edição — é só informação.
- Texto traduzido nos 3 idiomas (en/pt-BR/es).

## Fora de escopo

- Listar/editar quais desafios sobrescrevem o quê — isso pertenceria a um editor de Challenge de
  verdade (fora de escopo, mesmo domínio de `bee11-jokers-iniciais-challenge`/fase3).
- Qualquer outro campo além de `joker_slot` — `dollars` já está coberto por
  `bee5-aviso-luxury-tax`; os outros campos (`consumable_slot`, `consumables`) não têm
  sobreposição conhecida com regras de Challenge até agora.
