---
id: bee12-editor-niveis-mao-poker
title: "Editar valores base das mãos de pôquer"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-12
domain_title: "Editor de Níveis de Mão de Pôquer"
priority: P3
labels: [pos-mvp]
created: "24/ago/26"
updated: "24/ago/26"
---
# bee12-editor-niveis-mao-poker · Editar valores base das mãos de pôquer

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P3 | [BEE-12](../../_epicas/BEE-12.md) · Editor de Níveis de Mão de Pôquer | main |

> Como usuário, quero editar os valores de chips/mult de cada tipo de mão de pôquer, pra
> customizar o quanto uma mão vale desde o início da run.

## Contexto

Reportado na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1) como
"refinamento futuro" — usuário sabia que era possível, mas não sabia onde/como editar. Investigação
técnica (24/ago/26) confirma exatamente onde: `game.lua`, tabela separada do bloco de baralhos
(fora de `G.P_CENTERS`), 12 entradas — uma por tipo de mão, todas em **uma linha só cada**
(mesmo formato que o bloco de baralhos usa):

```
["Flush Five"]       order=1  s_mult=16  s_chips=160  l_mult=3  l_chips=50
["Flush House"]      order=2  s_mult=14  s_chips=140  l_mult=4  l_chips=40
["Five of a Kind"]   order=3  s_mult=12  s_chips=120  l_mult=3  l_chips=35
["Straight Flush"]   order=4  s_mult=8   s_chips=100  l_mult=4  l_chips=40
["Four of a Kind"]   order=5  s_mult=7   s_chips=60   l_mult=3  l_chips=30
["Full House"]       order=6  s_mult=4   s_chips=40   l_mult=2  l_chips=25
["Flush"]            order=7  s_mult=4   s_chips=35   l_mult=2  l_chips=15
["Straight"]         order=8  s_mult=4   s_chips=30   l_mult=3  l_chips=30
["Three of a Kind"]  order=9  s_mult=3   s_chips=30   l_mult=2  l_chips=20
["Two Pair"]         order=10 s_mult=2   s_chips=20   l_mult=1  l_chips=20
["Pair"]             order=11 s_mult=2   s_chips=10   l_mult=1  l_chips=15
["High Card"]        order=12 s_mult=1   s_chips=5    l_mult=1  l_chips=10
```

Significado de cada campo (por tipo de mão):
- `s_mult`/`s_chips`: valor **base**, no nível 1 (o que Cartas Planeta aumentam a cada uso).
- `l_mult`/`l_chips`: **incremento** ganho por nível (quando a mão sobe de nível via Planeta).
- `mult`/`chips`: valor efetivo atual — numa run nova, igual ao `s_*` (não editar diretamente).

**Boa notícia técnica**: como cada mão é uma entrada de uma linha só, o mesmo parser sob medida
já usado pro bloco de baralhos (`parse-deck-block.ts` — regex + contagem de chaves, não um
parser de Lua completo) reaproveita quase direto, só trocando o marcador de identificação
(`visible = ` em vez de `set = "Back"`) e o caminho até a tabela dentro do `game.lua`.

**Perguntas em aberto antes de virar `ready`** (Socrático, ainda não perguntado ao usuário):
1. Quais campos editar: só `s_mult`/`s_chips` (valor base, mais intuitivo), ou também
   `l_mult`/`l_chips` (quanto cresce por nível)?
2. Quais mãos: todas as 12, ou só as "normais" (as 10 visíveis, `visible = true` — Flush Five e
   Flush House são secretas/desbloqueáveis, `visible = false`)?
3. Editar por mão individual (formulário com 12 entradas) ou um multiplicador global aplicado a
   todas de uma vez?
4. Limites seguros: não temos nenhum teste empírico ainda pra esses campos (diferente dos 4 campos
   do MVP, que já têm limite testado) — precisa de rodada de teste manual do usuário antes de
   definir um soft-warning, ou lança sem limite conhecido por enquanto (com aviso genérico de
   "não testado")?

## Critérios de aceitação (preliminares — revisar no refinamento)

- Usuário consegue editar o(s) campo(s) definido(s) acima, por tipo de mão.
- Grava de volta no `game.lua` sem corromper as outras 11 entradas nem o resto do arquivo.

## Fora de escopo

- Definido durante o refinamento.
