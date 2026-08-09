---
id: bee6-restaurar-padrao
title: "Restaurar o balatro.exe pro padrão original"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-6
domain_title: "Backup & Restauração"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee6-restaurar-padrao · Restaurar o balatro.exe pro padrão original

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-6](../../_epicas/BEE-6.md) · Backup & Restauração | ui |

> Depende de [bee6-backup-automatico-primeira-edicao](../bee6-backup-automatico-primeira-edicao/item.md)
> e [bee3-reinjetar-game-lua-no-exe](../bee3-reinjetar-game-lua-no-exe/item.md).

> Como usuário, quero um botão para restaurar o `balatro.exe` pro estado padrão do jogo, para
> desfazer todas as minhas customizações de uma vez se eu quiser.

## Contexto
Ação destrutiva sobre as edições atuais — precisa de confirmação explícita, igual salvar.

## Critérios de aceitação
- Botão "Restaurar padrão" só aparece/habilita se existir um backup pra esse `.exe`.
- Pede confirmação explícita antes de restaurar, avisando que todas as customizações atuais serão
  perdidas e o Balatro precisa estar fechado.
- Ao confirmar, reinjeta o `game.lua` original do backup no `.exe`.
- Depois de restaurar, a UI reflete o estado padrão (nenhum baralho customizado).
