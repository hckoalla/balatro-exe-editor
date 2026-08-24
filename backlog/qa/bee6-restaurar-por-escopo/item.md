---
id: bee6-restaurar-por-escopo
title: "Restaurar padrão por escopo (baralhos / mãos de pôquer / geral) + aba de Configurações"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-6
domain_title: "Backup & Restauração"
priority: P2
labels: [pos-mvp]
created: "24/ago/26"
updated: "24/ago/26"
---
# bee6-restaurar-por-escopo · Restaurar padrão por escopo + aba de Configurações

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P2 | [BEE-6](../../_epicas/BEE-6.md) · Backup & Restauração | ui |

> Como usuário, quero restaurar só os baralhos ou só as mãos de pôquer pro padrão, sem perder as
> customizações que já fiz no outro escopo — e configurações (idioma, restaurar geral) numa aba
> própria, não escondidas atrás de um botão na tela de baralhos.

## Contexto

Pedido direto do usuário (24/ago/26), não veio da issue #1. Com a 3ª aba (mãos de pôquer,
`bee12-editor-niveis-mao-poker`) e a aba de lote (`bee5-edicao-lote`) já existindo, faz sentido
cada escopo de edição ter seu próprio "desfazer": abas 1 e 2 (edição de baralho e edição em lote)
resetam só os baralhos; aba 3 (mãos de pôquer) reseta só as mãos; uma 4ª aba nova,
"Configurações", concentra o seletor de idioma (que hoje vive atrás do botão "Configurações" no
cabeçalho da `DecksScreen`) e o reset geral (equivalente ao `restoreDefault` que já existe hoje).

Hoje só existe **um** backup por `.exe`: o `game.lua` inteiro, capturado uma única vez, antes da
primeira gravação de qualquer editor (`BackupService.ensureBackup`, `electron/backup/`). Não tem
backup separado por baralho ou por mão — é o arquivo inteiro, de uma vez.

**Viabilidade técnica confirmada**: dá pra restaurar só um escopo sem reimplementar backup
nenhum, reaproveitando os parsers/serializers que já existem:
- Baralhos: `parseDeckBlock(backupGameLua)` extrai a config original de cada baralho a partir do
  backup; `serializeDeckBlock(currentGameLua, originalDecks)` regrava só as linhas de baralho no
  `game.lua` **atual** (o que tiver sido editado nas mãos de pôquer não é tocado).
- Mãos de pôquer: mesma lógica com `parsePokerHandsBlock`/`serializePokerHandsBlock`.
- Restauração geral: continua sendo a troca do arquivo inteiro (`restoreDefaultExe`, já existe,
  sem mudança de comportamento — só muda de tela, vai pra aba de Configurações).

## Critérios de aceitação

- Nova 4ª aba "Configurações" no `MainTabs`, com o seletor de idioma (mesmo conteúdo de
  `SettingsPanel` hoje, sem precisar do botão de abrir/fechar — a aba inteira já é o painel) e o
  botão de restaurar **geral** (equivalente ao `restoreDefault` atual, mesmo texto de confirmação
  atualizado pra mencionar que afeta baralhos E mãos de pôquer).
- Botão "Configurações" sai do cabeçalho da `DecksScreen` (não fica mais escondido lá).
- Aba 1 (Edição de Baralho, `DecksScreen`) e aba 2 (Edição em Lote, `BatchDecksScreen`) ganham
  cada uma um botão "Restaurar Baralhos" — reseta só os 16 baralhos pro valor do backup, sem
  afetar as mãos de pôquer editadas.
- Aba 3 (Mãos de Pôquer, `PokerHandsScreen`) ganha um botão "Restaurar Mãos de Pôquer" — reseta
  só as mãos pro valor do backup, sem afetar os baralhos editados.
- Todos os botões de restaurar (geral e por escopo) só aparecem se já existir backup
  (`hasBackup`), mesmo comportamento já existente do `RestoreDefaultButton`.
- Cada botão pede confirmação antes de restaurar (mesmo padrão dos botões de salvar/restaurar já
  existentes), com texto deixando claro o que vai ser restaurado e o que **não** vai ser afetado.
- Textos traduzidos nos 3 idiomas (en/pt-BR/es).

## Fora de escopo

- Backup incremental por escopo (continua sendo um único snapshot do arquivo inteiro, capturado
  uma vez) — a "restauração por escopo" filtra o que já existe no backup único, não cria backups
  separados.
- Restaurar um baralho ou uma mão individualmente (por enquanto é por escopo inteiro: todos os
  baralhos, ou todas as mãos).
