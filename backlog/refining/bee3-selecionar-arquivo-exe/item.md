---
id: bee3-selecionar-arquivo-exe
title: "Selecionar e validar o balatro.exe"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-3
domain_title: "Motor de Leitura/Escrita do balatro.exe"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee3-selecionar-arquivo-exe · Selecionar e validar o balatro.exe

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-3](../../_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe | ui |

> Depende de [bee3-extrair-game-lua-do-exe](../bee3-extrair-game-lua-do-exe/item.md) e
> [bee1-electron-store-config](../bee1-electron-store-config/item.md).

> Como usuário, quero escolher o arquivo `balatro.exe` pelo explorador de arquivos do Windows,
> para o app saber em qual instalação do jogo vou trabalhar.

## Contexto
Tela de entrada do app. Sem um `.exe` válido selecionado, nenhuma outra tela é acessível.

## Critérios de aceitação
- Diálogo nativo de seleção de arquivo, filtrando por `.exe`.
- Ao selecionar, o app valida que é um `.exe` fusionado do Balatro (contém `game.lua` — reusa
  `bee3-extrair-game-lua-do-exe`) antes de liberar a navegação pro resto do app.
- Se inválido, mostra mensagem de erro clara e permite tentar outro arquivo.
- Se existir um caminho salvo de sessão anterior (`bee1-electron-store-config`) e o arquivo ainda
  existir, sugere reabrir com ele automaticamente.
