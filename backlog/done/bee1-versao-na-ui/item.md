---
id: bee1-versao-na-ui
title: "Versão do app no rodapé e no título da janela"
type: story
status: done
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
| done | P3 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | ui |

> Depende de [bee1-rodape-creditos](../../qa/bee1-rodape-creditos/item.md) e
> [bee1-pipeline-release](../../qa/bee1-pipeline-release/item.md).

> Como usuário, quero ver a versão do app no rodapé e no título da janela, lida do `package.json`,
> sem duplicar esse número em mais de um lugar do código.

## Contexto
Pedido pelo usuário depois de aprovar `bee1-rodape-creditos`. `app.getVersion()` (Electron) já lê
o campo `version` do `package.json` do app empacotado.

Tentativa inicial: o workflow de release escrevia a versão da tag git no `package.json` antes de
empacotar (`npm version` a partir da tag), automatizando esse passo. Na prática, o
`electron-builder` detecta CI + tag e tenta se auto-publicar no GitHub Releases (mecanismo próprio,
que roda *além* do step de publish do workflow) — e falha sem `GH_TOKEN` configurado. Resolvido
desligando esse auto-publish (`--publish never`), mas isso reabriu a questão de simplicidade: o
usuário decidiu que sincronizar a versão via tag automaticamente não vale a complexidade extra —
prefere digitar a versão direto no `package.json` antes de criar a tag. Trade-off aceito
explicitamente pelo usuário.

## Critérios de aceitação
- Rodapé mostra `by hckoalla - v<versão>`.
- Título da janela do Electron mostra `Balatro EXE Editor - by hckoalla - v<versão>`.
- A versão vem de `app.getVersion()` (main process) — sem duplicar o número em código, um único
  lugar de verdade (`package.json`).
- Versão do `package.json` é hardcoded/manual — o usuário atualiza esse campo antes de criar a
  tag de release. O workflow (`.github/workflows/release.yml`) não escreve/sincroniza versão.
- O step de empacotamento roda com `--publish never`, pra evitar o auto-publish do
  `electron-builder` (que exige `GH_TOKEN` e conflita com o step de publish do workflow).

## Progresso
- `Footer` agora busca a versão via IPC (`window.balatro.getAppVersion()`) no mount e mostra
  `by hckoalla - v<versão>`; antes do resolver, mostra só `by hckoalla`. O nome não é mais uma
  chave de i18n (não é texto traduzível), por isso a chave `footer.credit` saiu de `en`/`pt-BR`/`es`.
- Nova função pura `buildWindowTitle(version)` em `electron/build-window-title.ts`, testável sem
  Electron real; usada em `createWindow()` (`electron/main.ts`) via `title: buildWindowTitle(app.getVersion())`.
- Adicionado handler `page-title-updated` com `preventDefault()` — sem isso, o Electron sobrescreve
  o título customizado pelo `<title>` do `index.html` assim que a página termina de carregar.
- Step de sincronizar versão via tag foi adicionado, testado e depois **removido** — o
  `electron-builder` tentava se auto-publicar em CI+tag e falhava sem `GH_TOKEN`. Resolvido com
  `--publish never` no step de empacotamento; a sincronização automática de versão foi
  descartada por decisão do usuário (custo/benefício não compensava).
- Suíte completa (120 testes), build e lint passando.
