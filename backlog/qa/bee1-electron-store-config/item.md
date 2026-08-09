---
id: bee1-electron-store-config
title: "Persistência local de configurações (electron-store)"
type: story
status: qa
owner: ""
sistema: infra
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee1-electron-store-config · Persistência local de configurações

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

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

## Fora de escopo
- Checar se `lastExePath` ainda existe no disco e decidir se volta pro fluxo manual — essa
  história só garante que persistir/ler o valor nunca quebra o app (é só uma string). A
  validação de existência do arquivo acontece quando o valor é consumido, em
  `bee3-selecionar-arquivo-exe`.
- Aplicar o idioma salvo na UI — é `bee7-seletor-idioma`. Esta história só persiste o valor.

## Progresso
Concluído em 09/ago/26:
- `src/shared/settings-schema.ts`: `AppSettings` (`lastExePath`, `language`) + `DEFAULT_SETTINGS`.
- `electron/settings/settings-service.ts` (`KeyValueStore<T>` abstrato, testado com fake — sem
  `electron-store` real) + `electron-store-adapter.ts` (implementação real, `electron-store@8`
  por compatibilidade CJS com o resto do processo main).
- `electron/settings/register-settings-handlers.ts` + teste (canais `settings:get` /
  `settings:update`, mesmo padrão TDD com fake `ipcMain`).
- `getSettings`/`updateSettings` expostos em `window.balatro` via preload; `main.ts` registra os
  handlers em `whenReady`.
