---
id: bee8-detectar-instalacao-steam
title: "Detectar automaticamente a instalação do Balatro via Steam"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-8
domain_title: "Detecção Automática da Instalação (Fase 2)"
priority: P1
labels: [fase2]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee8-detectar-instalacao-steam · Detectar instalação via Steam

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P1 | [BEE-8](../../_epicas/BEE-8.md) · Detecção Automática da Instalação (Fase 2) | main |

> Como usuário, quero que o app sugira o caminho do `balatro.exe` automaticamente se eu tenho o
> jogo instalado via Steam, para não precisar procurar manualmente pelas pastas do Windows.

## Contexto
No MVP (`bee3-selecionar-arquivo-exe`), a seleção é sempre manual. Esta história adiciona
detecção automática do caminho padrão de instalação da Steam no Windows, como sugestão — não
substitui a seleção manual.

## Critérios de aceitação
- App tenta localizar a instalação padrão da Steam e, dentro dela, a pasta do Balatro.
- Se encontrar, sugere o caminho automaticamente na tela de seleção de arquivo, sem forçar o uso.
- Se não encontrar (Steam não instalada, jogo não instalado, instalação customizada), cai de
  volta pro fluxo manual sem erro.
