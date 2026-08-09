---
id: bee6-backup-automatico-primeira-edicao
title: "Backup automático do game.lua original"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-6
domain_title: "Backup & Restauração"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee6-backup-automatico-primeira-edicao · Backup automático do game.lua original

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-6](../../_epicas/BEE-6.md) · Backup & Restauração | main |

> Depende de [bee3-extrair-game-lua-do-exe](../bee3-extrair-game-lua-do-exe/item.md).

> Como usuário, quero que o app guarde uma cópia do meu `game.lua` original antes de qualquer
> edição, para nunca perder a chance de voltar ao padrão do jogo.

## Contexto
Backup único por instalação do jogo — a primeira gravação sobre um `.exe` específico cria o
backup; gravações seguintes reutilizam o mesmo backup (não sobrescrevem com uma versão já
editada).

## Critérios de aceitação
- Antes da primeira gravação sobre um `.exe`, o `game.lua` original (ainda intocado) é salvo em
  disco, associado a esse `.exe` específico (ex: por caminho + hash do conteúdo original).
- Gravações seguintes sobre o mesmo `.exe` não sobrescrevem o backup já existente.
- Se o `.exe` já tiver sido editado por fora do app (backup não existe e o conteúdo já difere do
  padrão conhecido), o app não finge ter um backup confiável — avisa o usuário.
