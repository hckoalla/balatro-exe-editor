---
id: bee7-infra-i18n
title: "Infraestrutura de internacionalização (inglês padrão)"
type: story
status: refining
owner: ""
sistema: i18n
domain: BEE-7
domain_title: "Internacionalização"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee7-infra-i18n · Infraestrutura de i18n

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-7](../../_epicas/BEE-7.md) · Internacionalização | i18n |

> Depende de [bee1-setup-electron-react-vite](../bee1-setup-electron-react-vite/item.md).

> Como desenvolvedor, quero uma camada de i18n desde cedo, para nenhuma string de UI ficar
> hardcoded e virar retrabalho depois.

## Contexto
Idioma padrão é inglês (decisão do usuário). PT-BR e ES vêm em histórias separadas
(`bee7-traducao-pt-br`, `bee7-traducao-es`), reaproveitando esta infraestrutura.

## Critérios de aceitação
- Biblioteca de i18n integrada ao React, com arquivo de strings em inglês cobrindo todas as telas
  já implementadas até este ponto.
- Nenhuma string de UI hardcoded fora dos arquivos de tradução (lint/convenção que torne isso
  visível em review).
- Fallback pra inglês se uma chave não existir no idioma selecionado.
