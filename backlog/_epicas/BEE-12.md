---
id: BEE-12
title: "Editor de Níveis de Mão de Pôquer"
type: epic
sistema: main
created: "24/ago/26"
---
# BEE-12 · Editor de Níveis de Mão de Pôquer

Pedido pelo usuário na [issue #1](https://github.com/hckoalla/balatro-exe-editor/issues/1):
editar os valores base (chips/mult) de cada tipo de mão de pôquer, não só os 4 campos de baralho
do MVP. Diferente do `bee10-editor-generico-campos-lua` (cancelado por falta de demanda real,
escopo genérico demais) — esta épica é escopada especificamente pros níveis de mão, um grupo de
campos concreto e já confirmado no código.

`game.lua` tem uma tabela separada (fora do bloco de baralhos), uma entrada por tipo de mão
(`"Flush Five"`, `"Straight Flush"`, `"Four of a Kind"`, etc.), cada uma com:
```lua
["Straight Flush"] = {mult = 8, chips = 100, s_mult = 8, s_chips = 100, level = 1, l_mult = 4, l_chips = 40, ...}
```
- `s_mult`/`s_chips`: valor base no nível 1 (o que os cartões "Planeta" aumentam a cada uso).
- `l_mult`/`l_chips`: incremento ganho por nível.
- `mult`/`chips`: valor efetivo atual (normalmente igual ao `s_*` numa run nova).

Critérios de sucesso:
- Usuário consegue editar `s_mult`/`s_chips` (e possivelmente `l_mult`/`l_chips`) de um ou mais
  tipos de mão, com o mesmo padrão de soft-warning dos outros campos numéricos do app.
- Escopo final (quais dos 4 campos por mão, quais das ~12 mãos) definido em refinamento — ver
  `bee12-editor-niveis-mao-poker`.
