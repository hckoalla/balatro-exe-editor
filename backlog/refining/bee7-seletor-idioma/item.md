---
id: bee7-seletor-idioma
title: "Seletor de idioma nas configurações"
type: story
status: refining
owner: ""
sistema: i18n
domain: BEE-7
domain_title: "Internacionalização"
priority: P1
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee7-seletor-idioma · Seletor de idioma

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P1 | [BEE-7](../../_epicas/BEE-7.md) · Internacionalização | i18n |

> Depende de [bee7-infra-i18n](../bee7-infra-i18n/item.md) e
> [bee1-electron-store-config](../bee1-electron-store-config/item.md).

> Como usuário, quero trocar o idioma do app numa tela de configurações, para usar o editor no
> idioma que eu preferir sem editar arquivo nenhum.

## Critérios de aceitação
- Seção de configurações com seletor entre inglês, PT-BR e ES.
- Trocar o idioma aplica a mudança imediatamente, sem precisar reiniciar o app.
- Escolha persiste entre reinícios (via `bee1-electron-store-config`).
