---
id: bee6-restaurar-padrao
title: "Restaurar o balatro.exe pro padrão original"
type: story
status: done
owner: ""
sistema: ui
domain: BEE-6
domain_title: "Backup & Restauração"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee6-restaurar-padrao · Restaurar o balatro.exe pro padrão original

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P0 | [BEE-6](../../_epicas/BEE-6.md) · Backup & Restauração | ui |

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

## Progresso
Concluído em 09/ago/26:
- `restoreDefaultExe` (main): pega o `game.lua` do backup, reinjeta no `.exe` atual
  (`updateGameLuaInExe`), grava em disco (`writeExeToDisk`, já com `FileInUseError`).
- Canais IPC `backup:has` / `backup:restore`.
- `RestoreDefaultButton`: só renderiza (nem o botão aparece) se `hasBackup` for `false`;
  confirmação em dois passos (clique → painel vermelho "close Balatro" + Yes/Cancel), mais
  alarmante visualmente que a futura confirmação de salvar (`bee5-salvar-alteracoes`).
- `DecksScreen` ganhou o botão no header (como no protótipo) e reexecuta `getDecks` depois de
  restaurar, pra badges "Customized" sumirem — refletindo o estado padrão sem precisar recarregar
  a tela manualmente.
- **Nota de sequenciamento**: nada ainda chama `ensureBackup` de verdade (isso só acontece em
  `bee5-salvar-alteracoes`, que vem em seguida) — então na prática o botão só vai aparecer depois
  que essa história existir e o usuário salvar pelo menos uma vez.
- 12 testes novos (2 main de `restoreDefaultExe`, 2 dos handlers IPC, 3 do componente,
  + wiring).
