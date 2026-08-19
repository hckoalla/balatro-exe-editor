---
id: bee7-seletor-idioma
title: "Seletor de idioma nas configurações"
type: story
status: done
owner: ""
sistema: i18n
domain: BEE-7
domain_title: "Internacionalização"
priority: P1
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee7-seletor-idioma · Seletor de idioma

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P1 | [BEE-7](../../_epicas/BEE-7.md) · Internacionalização | i18n |

> Depende de [bee7-infra-i18n](../bee7-infra-i18n/item.md) e
> [bee1-electron-store-config](../bee1-electron-store-config/item.md).

> Como usuário, quero trocar o idioma do app numa tela de configurações, para usar o editor no
> idioma que eu preferir sem editar arquivo nenhum.

## Critérios de aceitação
- Seção de configurações com seletor entre inglês, PT-BR e ES.
- Trocar o idioma aplica a mudança imediatamente, sem precisar reiniciar o app.
- Escolha persiste entre reinícios (via `bee1-electron-store-config`).

## Progresso
Concluído em 09/ago/26 — **última história do MVP**:
- `applyPersistedLanguage` (testável, funções injetadas): lê `getSettings()` e aplica via
  `i18n.changeLanguage()` — chamado uma vez no mount do `App.tsx`.
- `SettingsPanel`: botão "Settings" revela um painel com 3 opções de idioma (radiogroup). Nomes
  dos idiomas ("English", "Português", "Español") ficam sempre no próprio idioma nativo — não
  traduzidos, convenção comum de seletor de idioma — só o rótulo do botão/painel em si é
  traduzido. Trocar aplica na hora (`i18n.changeLanguage`) e persiste (`updateSettings`).
  Adicionado ao header da `DecksScreen`, ao lado do `RestoreDefaultButton`.
- 5 testes novos (2 de `applyPersistedLanguage`, 3 do `SettingsPanel`) — 104 no total.

**BEE-7 completo — fecha o backlog inteiro do MVP.**
