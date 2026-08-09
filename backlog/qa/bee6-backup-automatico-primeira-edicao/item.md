---
id: bee6-backup-automatico-primeira-edicao
title: "Backup automático do game.lua original"
type: story
status: qa
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
| qa | P0 | [BEE-6](../../_epicas/BEE-6.md) · Backup & Restauração | main |

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

## Decisão registrada (sem o usuário disponível pra confirmar) — LEIA ANTES DE APROVAR
O terceiro critério, como escrito, pede pro app detectar se o `.exe` "já foi editado por fora"
antes mesmo do primeiro backup. Isso é **impossível de verificar de verdade**: o app não tem
acesso ao `game.lua` "de fábrica" da Valve/LocalThunk pra comparar — só vê o que já está no
`.exe` do usuário. Não existe um oráculo de "isso é o padrão real do jogo".

O que implementei em vez disso: o backup captura o que o app **primeiro observa** naquele
`.exe` — se o usuário já tinha editado manualmente antes de abrir o app, é ESSE estado editado
que vira o "padrão" pro botão restaurar (bee6-restaurar-padrao). É uma limitação honesta, não um
bug — mas é diferente do que o critério 3 pede literalmente. Se você quiser detecção de verdade,
precisaríamos de outra fonte (ex: pedir uma cópia limpa do `game.lua` de outra instalação, ou
aceitar hashes conhecidos de versões oficiais do jogo — escopo bem maior).

## Progresso
Concluído em 09/ago/26:
- `electron/backup/backup-service.ts`: `createBackupService(store)` — `ensureBackup` só grava se
  ainda não existir backup pra aquele `.exe` (chave = SHA-256 do caminho absoluto do `.exe`, não
  do conteúdo — assim a MESMA instalação sempre bate na mesma chave mesmo depois de editada).
- `electron/backup/file-backup-store.ts`: implementação real em disco (`<baseDir>/<hash>.lua`).
- Só a peça de infraestrutura — sem IPC/UI ainda, porque nada consome isso até
  `bee5-salvar-alteracoes` existir (é ela quem vai chamar `ensureBackup` antes de gravar).
- 7 testes (5 do service com store fake, 2 do adapter real em disco com pasta temporária).
