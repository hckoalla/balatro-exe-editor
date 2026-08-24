---
id: bee5-aviso-luxury-tax
title: "Avisar sobre risco do desafio Luxury Tax ao editar dinheiro do baralho de desafio"
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
# bee5-aviso-luxury-tax · Avisar sobre risco do desafio Luxury Tax

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| in-progress | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Como usuário, quero ser avisado que aumentar o dinheiro inicial do baralho de desafio pode
> quebrar especificamente o desafio Luxury Tax, antes de eu editar sem saber disso.

## Contexto

Reportado na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1) ("Ideias para
versão v1.2.0") — usuário chamou o desafio de "Inflação", mas **o nome real é "Luxury Tax"**
(confirmado em `balatro-exe-source-code/challenges.lua`, entrada `id = 'c_luxury_1'`, local, fora
do git). Existe também um desafio real chamado "Inflation" no jogo, mas o mecanismo dele é outro
(inflaciona o preço de compras na loja a cada carta comprada — `G.GAME.inflation`,
`card.lua:1800`), não tem nada a ver com dinheiro inicial ou tamanho de mão.

**Confirmação do usuário (24/ago/26)**: é esse mesmo o desafio que "morre instantaneamente" ao
editar `dollars` alto no baralho de desafio — bate com o mecanismo confirmado abaixo. No PT-BR do
jogo (`balatro-exe-source-code/localization/pt_BR.lua`, `c_luxury_1="Imposto de Luxo"`), o nome é
**"Imposto de Luxo"**.

O mecanismo real do Luxury Tax (`challenges.lua:253-263`):
```lua
{
    name = "Luxury Tax",
    id = 'c_luxury_1',
    rules = {
        custom = { {id = 'minus_hand_size_per_X_dollar', value = 5} },
        modifiers = { {id = 'hand_size', value = 10} },
    },
    deck = { type = 'Challenge Deck' },
    ...
},
```
Reduz o tamanho da mão conforme o dinheiro acumulado (a cada 5 de dinheiro, -1 de tamanho de
mão) — começa com `hand_size = 10` fixo (sobrescrito pelo modifier do desafio, não soma com o
delta do baralho). **Todos os 20 desafios reais usam visualmente o "Challenge Deck"**
(`deck.type = 'Challenge Deck'`) — é o mesmo `b_challenge` que o app já edita hoje (um dos 16
baralhos do MVP). Ou seja: se o usuário aumentar o `dollars` do baralho de desafio no editor, e
depois jogar especificamente o desafio Luxury Tax, o dinheiro inicial extra soma ao dinheiro
acumulado que reduz o tamanho da mão — quanto mais dinheiro, menor a mão, podendo chegar a uma
mão inviável (perda automática ou run impossível).

## Critérios de aceitação

- Ao editar o campo `dollars` do baralho `b_challenge` (Challenge Deck) especificamente — não
  nos outros 15 baralhos — mostra uma nota informativa (não um soft-warning condicionado a
  limite, é um aviso sempre visível nesse baralho específico) explicando que dinheiro inicial
  alto pode quebrar o desafio Luxury Tax (mão encolhe a cada 5 de dinheiro acumulado).
- Não bloqueia a edição — é só informação, mesmo espírito dos soft-warnings já existentes.
- Texto traduzido nos 3 idiomas (en/pt-BR/es).

## Fora de escopo

- Detectar automaticamente que o usuário está prestes a jogar o Luxury Tax (o app não sabe qual
  desafio o usuário vai jogar) — é aviso preventivo genérico no campo, não uma checagem em tempo
  real.
- Qualquer edição de outros baralhos de desafio ou parâmetros específicos de Challenge — fora do
  escopo desta história (isso seria `bee11-jokers-iniciais-challenge`/fase3, um domínio
  diferente).
