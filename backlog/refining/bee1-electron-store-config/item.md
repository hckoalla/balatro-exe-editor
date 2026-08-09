---
id: bee1-electron-store-config
title: "Persistência local de configurações (electron-store)"
type: story
status: refining
owner: ""
sistema: infra
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee1-electron-store-config · Persistência local de configurações

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Depende de [bee1-ipc-bridge-tipado](../bee1-ipc-bridge-tipado/item.md).

> Como usuário, quero que o app lembre o último `.exe` que eu usei e o idioma que eu escolhi,
> para não precisar reconfigurar tudo toda vez que abro o app.

## Contexto
Configurações leves do app (não o `game.lua` em si) persistidas localmente via `electron-store`:
caminho do último `.exe` selecionado, idioma da UI escolhido (ver BEE-7). Fora do repositório,
fora de qualquer versionamento.

## Critérios de aceitação
- Caminho do último `.exe` usado é salvo e re-sugerido na próxima abertura do app.
- Idioma escolhido é salvo e aplicado automaticamente na próxima abertura.
- Configurações sobrevivem a reinícios do app.
- Se o caminho salvo não existir mais (arquivo movido/deletado), o app não quebra — volta pro
  fluxo de seleção manual.
