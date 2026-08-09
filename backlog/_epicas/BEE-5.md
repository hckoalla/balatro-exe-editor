---
id: BEE-5
title: "Editor de Baralhos (UI)"
type: epic
sistema: ui
created: "08/ago/26"
---
# BEE-5 · Editor de Baralhos (UI)

Interface principal do app: usuário escolhe um baralho, edita seus valores de `dollars`,
`joker_slot`, `consumable_slot` e a lista de consumíveis iniciais, e salva — o que dispara a
gravação real no `.exe` (via BEE-3/BEE-4).

Critérios de sucesso:
- Usuário consegue escolher, entre os 15 baralhos + baralho de desafio, qual quer editar.
- Formulário permite editar `dollars`, `joker_slot`, `consumable_slot` com aviso (soft warning,
  não bloqueio) ao ultrapassar os limites seguros conhecidos (`dollars` +230, `joker_slot` +145,
  `consumable_slot` +90).
- Usuário consegue adicionar/remover consumíveis iniciais do baralho, com aviso ao ultrapassar
  ~30 itens.
- Salvar grava as alterações no `.exe` real, com confirmação explícita antes (ação sobre o jogo
  do usuário) e feedback claro de sucesso ou erro (incluindo arquivo travado por outro processo).
