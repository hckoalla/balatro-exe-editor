---
id: bee12-editor-niveis-mao-poker
title: "Editar valores base das mãos de pôquer"
type: story
status: qa
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
| qa | P3 | [BEE-12](../../_epicas/BEE-12.md) · Editor de Níveis de Mão de Pôquer | main |

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

**Refinamento (24/ago/26)** — decisões do usuário pras 4 perguntas abertas:

1. **Campos**: os 4 juntos — `s_mult`, `s_chips`, `l_mult` e `l_chips`, não só o valor base.
2. **Mãos**: todas as 12, incluindo Flush Five e Flush House (secretas/desbloqueáveis,
   `visible = false` no jogo).
3. **Modo de edição**: por mão individual (formulário com uma entrada editável por tipo de mão),
   não um multiplicador global. Decisão de navegação junto: a app terá três abas/telas de edição
   coexistindo — **Edição de Baralho** (MVP), **Edição de Baralho por Lote**
   ([bee5-edicao-lote](../../ready/bee5-edicao-lote/item.md)) e **Edição de Mão de Pôquer** (esta
   história) — cada uma seu próprio fluxo, sem se misturar.
4. **Limite seguro**: nenhum campo aqui tem teste empírico ainda (diferente dos 4 campos do MVP).
   Lança com um soft-warning **provisório de 20** (acima do valor padrão do jogo, por campo), mas
   explicitamente marcado na UI como não confirmado — depende de uma rodada de teste manual do
   usuário depois da implementação pra virar definitivo (mesmo espírito do
   [bee5-testar-limites-seguros](../../ready/bee5-testar-limites-seguros/item.md), mas pra este
   grupo de campos — a criação dessa história de teste específica fica pra depois desta história
   estar implementada, não faz sentido testar campo que ainda não existe no editor).

## Bug encontrado no smoke test (24/ago/26)

Usuário reportou: editar o valor inicial da mão (campos `s_mult`/`s_chips`) não tinha efeito
nenhum no jogo, mas editar o incremento por nível (`l_mult`/`l_chips`) funcionou perfeitamente.

Causa raiz confirmada em `functions/common_events.lua:464-468`
(`balatro-exe-source-code/`, local, fora do git): o jogo só recalcula os campos que ele realmente
usa pra pontuar (`mult`/`chips`) a partir de `s_mult`/`s_chips` quando o jogador sobe aquela mão
de nível — `level_up_hand()`, `mult = max(s_mult + l_mult*(level-1), 1)`. Numa run nova
(`level = 1`), `mult`/`chips` ficam travados no valor que já estava gravado no arquivo até isso
acontecer — e o editor gravava só `s_mult`/`s_chips`, sem tocar em `mult`/`chips`. Por isso editar
o valor inicial não tinha efeito nenhum (até o jogador subir a mão pela primeira vez), enquanto
`l_mult`/`l_chips` "funcionava" — a fórmula de subida de nível já lia o valor novo.

Corrigido em `serializePokerHandsBlock` (`electron/poker-hand-config/serialize-poker-hands-block.ts`):
ao gravar `s_mult`/`s_chips`, sincroniza `mult`/`chips` com os mesmos valores (correto pra essa
tabela especificamente, já que `level` é sempre 1 no estado inicial de uma run nova).

## Critérios de aceitação

- Nova aba/tela "Edição de Mão de Pôquer", com formulário de 12 entradas (uma por tipo de mão),
  cada uma editando `s_mult`, `s_chips`, `l_mult` e `l_chips` individualmente.
- Parser e serializador reaproveitam o padrão de `parse-deck-block.ts` (regex + contagem de
  chaves), adaptado pro marcador e localização desta tabela no `game.lua`.
- Soft-warning de +20 por campo, com aviso explícito na UI de que o limite é **provisório, ainda
  não confirmado por teste manual** — texto diferente do soft-warning já calibrado dos campos do
  MVP.
- Grava de volta no `game.lua` sem corromper as outras entradas da tabela nem o resto do arquivo.

## Fora de escopo

- Editar `mult`/`chips` (valor efetivo atual) diretamente — só os campos base/incremento.
- Criar a história de teste de limite seguro específica pra estes campos — fica pra depois desta
  história ser implementada.
