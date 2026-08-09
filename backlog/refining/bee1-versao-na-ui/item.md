---
id: bee1-versao-na-ui
title: "Versão do app no rodapé e no título da janela"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P3
labels: [pos-mvp]
created: "09/ago/26"
updated: "09/ago/26"
---
# bee1-versao-na-ui · Versão do app no rodapé e no título da janela

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P3 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | ui |

> Depende de [bee1-rodape-creditos](../../qa/bee1-rodape-creditos/item.md) e
> [bee1-pipeline-release](../../qa/bee1-pipeline-release/item.md).

> Como usuário, quero ver a versão do app no rodapé e no título da janela, vindo direto da tag de
> release que eu publicar, sem precisar atualizar esse número em mais de um lugar.

## Contexto
Pedido pelo usuário depois de aprovar `bee1-rodape-creditos`. `app.getVersion()` (Electron) já lê
o campo `version` do `package.json` do app empacotado — a única peça que falta é o workflow de
release (`bee1-pipeline-release`) escrever a versão da TAG git nesse campo antes de empacotar,
pra `app.getVersion()` em runtime bater com a tag publicada. Sem isso, o `package.json` do repo
(`0.0.1` fixo) nunca mudaria sozinho.

## Critérios de aceitação
- Rodapé mostra `hckoalla - v<versão>`.
- Título da janela do Electron mostra `Balatro EXE Editor - By hckoalla - v<versão>`.
- A versão vem de `app.getVersion()` (main process) — sem duplicar o número em código, um único
  lugar de verdade (`package.json`).
- O workflow de release (`.github/workflows/release.yml`) escreve a versão da tag git publicada
  (`v0.1.0` → `0.1.0`) no `package.json` antes de rodar `electron-builder`, pra `app.getVersion()`
  do app empacotado bater com a tag real.
- Em desenvolvimento local (`npm run dev`), sem tag nenhuma envolvida, mostra a versão que já
  está no `package.json` do repo — comportamento normal, não é bug.
