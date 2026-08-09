---
id: bee5-editor-consumiveis-iniciais
title: "Editor de consumíveis iniciais do baralho"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee5-editor-consumiveis-iniciais · Editor de consumíveis iniciais

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee5-tela-selecao-baralho](../bee5-tela-selecao-baralho/item.md) e
> [bee4-catalogo-consumiveis](../bee4-catalogo-consumiveis/item.md).

> Como usuário, quero escolher quais consumíveis (Tarots/Planetas/Spectrals) um baralho vai
> adicionar no início da run, para customizar o começo de cada baralho do meu jeito.

## Contexto
Campo `consumables` do baralho: lista de IDs. A UI usa o catálogo de `bee4-catalogo-consumiveis`
pra mostrar nomes amigáveis em vez de IDs internos.

## Critérios de aceitação
- Usuário busca/filtra consumíveis por nome e adiciona à lista inicial do baralho.
- Usuário remove itens já adicionados à lista.
- Lista permite duplicatas (ex: Magic Deck começa com 2x "The Fool" — mesmo consumível repetido).
- Ao ultrapassar ~30 itens na lista, mostra aviso (soft warning) de que passou do limite testado
  — sem bloquear.
- Lista vazia remove a chave `consumables` do `config` do baralho.
- Botão de **reset da lista inteira** (ícone de rollback), visível só quando a lista atual difere
  da lista padrão do baralho (que pode não ser vazia — ex: Magic Deck já vem com 2x "The Fool" de
  fábrica) — clicar volta a lista pro estado padrão daquele baralho específico.

## Progresso
Concluído em 09/ago/26:
- Movi `ConsumableCategory`/`ConsumableCatalogEntry` de `electron/` pra `src/shared/
  consumable-catalog-schema.ts` (mesmo motivo do `deck-schema.ts` em
  `bee5-tela-selecao-baralho`).
- `getConsumableCatalogFromExe` (main) + canal IPC `consumable-catalog:get-all`.
- `ConsumablesEditor`: busca/filtra por nome (só mostra resultados com texto digitado — não
  despeja o catálogo inteiro), adiciona por clique (duplicata permitida), remove por índice
  específico (não por id — duas ocorrências do mesmo consumível são removíveis independentemente),
  soft-warning acima de 30 itens, reset pra lista padrão do baralho (que pode não ser vazia).
- `DeckEditorScreen` ganhou a prop `exePath` (precisa pra buscar o catálogo) e agora renderiza
  `ConsumablesEditor` junto do `NumericFieldsForm`, convertendo lista vazia → chave `consumables`
  removida do `config` (mesma regra do formulário numérico).
- 9 testes novos (6 do editor + 1 de integração na tela).

## Bug encontrado no smoke test (09/ago/26) — corrigido
Espaçamento quase inexistente entre o painel "Consumable Slots" (`NumericFieldsForm`) e
"Starting Consumables" (`ConsumablesEditor`) — os dois componentes são irmãos em
`DeckEditorScreen`, e nenhum dos dois tinha `margin-top` entre si (o `gap: 16px` do
`NumericFieldsForm` só vale entre os campos DELE mesmo). Corrigido com `margin-top: 16px` em
`.consumables-editor`, mesmo valor do gap interno, pra ficar visualmente consistente.
