---
id: bee1-ipc-bridge-tipado
title: "IPC tipado e seguro entre renderer e main"
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
# bee1-ipc-bridge-tipado · IPC tipado e seguro

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Depende de [bee1-setup-electron-react-vite](../bee1-setup-electron-react-vite/item.md).

> Como desenvolvedor, quero um canal de IPC tipado entre o renderer e o main, para o renderer
> nunca ter acesso direto ao sistema de arquivos e o app ficar seguro por padrão.

## Contexto
Todo o trabalho pesado (ler/escrever no `.exe`, parsear o `game.lua`, backup) roda no processo
main, em Node.js puro — o renderer só chama funções expostas via `preload` e recebe resultados.
Isso é uma decisão de segurança, não só de organização: com `contextIsolation` ligado e sem
`nodeIntegration`, uma falha no renderer (ex: XSS improvável, mas defesa em profundidade) não dá
acesso ao filesystem do usuário.

## Critérios de aceitação
- `contextIsolation: true` e `nodeIntegration: false` na `BrowserWindow`.
- `preload` expõe uma API tipada (ex: `window.balatro.selectExeFile()`) via `contextBridge`, sem
  vazar `ipcRenderer` cru pro renderer.
- Tipos dos handlers IPC (payload de entrada/saída de cada canal) compartilhados entre main e
  renderer, sem duplicação manual.
- Handlers de `ipcMain` testáveis sem precisar de um Electron real rodando (fakes/mocks).
