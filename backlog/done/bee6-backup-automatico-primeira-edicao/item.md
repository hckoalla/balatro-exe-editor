---
id: bee6-backup-automatico-primeira-edicao
title: "Backup automático do game.lua original"
type: story
status: done
owner: ""
sistema: main
domain: BEE-6
domain_title: "Backup & Restauração"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee6-backup-automatico-primeira-edicao · Backup automático do game.lua original

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P0 | [BEE-6](../../_epicas/BEE-6.md) · Backup & Restauração | main |

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

## Critério 3 — resolvido
Achei inicialmente que fosse impossível verificar sem um "game.lua de fábrica" de referência —
mas o usuário lembrou que **os valores DEFAULT de cada baralho já são conhecidos** (vieram do
`game.lua` real dele mesmo, lido no início do projeto). Não precisa do arquivo inteiro, só dos
16 valores de `config` por baralho. Implementado em `bee6-detectar-edicao-preexistente` (ver
Progresso) — `KNOWN_DEFAULT_DECKS` embutido no código + `detectPreexistingEdits`, que compara o
`game.lua` pré-edição contra esses defaults conhecidos e sinaliza (`possiblyPreEdited`) se algum
baralho já difere, no momento do primeiro backup.

## Progresso
Concluído em 09/ago/26:
- `electron/backup/backup-service.ts`: `createBackupService(store)` — `ensureBackup` só grava se
  ainda não existir backup pra aquele `.exe` (chave = SHA-256 do caminho absoluto do `.exe`, não
  do conteúdo — assim a MESMA instalação sempre bate na mesma chave mesmo depois de editada).
- `electron/backup/file-backup-store.ts`: implementação real em disco (`<baseDir>/<hash>.lua`).
- Só a peça de infraestrutura — sem IPC/UI ainda, porque nada consome isso até
  `bee5-salvar-alteracoes` existir (é ela quem vai chamar `ensureBackup` antes de gravar).
- 7 testes (5 do service com store fake, 2 do adapter real em disco com pasta temporária).

Complementado em 09/ago/26 (`bee6-detectar-edicao-preexistente`, mesma história — ver critério 3
acima):
- `electron/backup/known-default-decks.ts`: os 16 valores `config` default reais, extraídos do
  `game.lua` do usuário (linhas 628–644) — só os 6 campos conhecidos, sem os demais campos que o
  app não edita (`voucher`, `remove_faces`, etc.).
- `electron/backup/detect-preexisting-edits.ts`: compara baralhos do `game.lua` contra
  `KNOWN_DEFAULT_DECKS`; ignora baralhos sem default conhecido (versão diferente do jogo) em vez
  de reportar falso positivo.
- `saveDeckToExe` agora retorna `{ backupCreated, possiblyPreEdited }` em vez de `void` —
  `possiblyPreEdited` só é calculado quando `backupCreated` é `true` (primeira gravação).
- 4 testes novos de `detectPreexistingEdits` + 3 de `saveDeckToExe` cobrindo o novo retorno.
