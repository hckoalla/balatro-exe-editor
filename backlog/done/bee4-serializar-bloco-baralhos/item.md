---
id: bee4-serializar-bloco-baralhos
title: "Serializar alterações de volta no bloco de baralhos"
type: story
status: done
owner: ""
sistema: main
domain: BEE-4
domain_title: "Parsing da Configuração dos Baralhos"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee4-serializar-bloco-baralhos · Serializar alterações no bloco de baralhos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P0 | [BEE-4](../../_epicas/BEE-4.md) · Parsing da Configuração dos Baralhos | main |

> Depende de [bee4-parser-bloco-baralhos](../bee4-parser-bloco-baralhos/item.md).

> Como desenvolvedor, quero regravar os valores editados de volta no texto do `game.lua`, para
> persistir as mudanças do usuário sem alterar mais nada no arquivo.

## Contexto
Operação inversa do parser: recebe os baralhos editados e o texto original do `game.lua`, e
retorna um novo texto com só a tabela `config` de cada baralho alterado atualizada — precisa
adicionar chaves que não existiam antes (ex: dar `dollars` a um baralho que hoje não tem esse
campo no `config`), remover chaves zeradas pelo usuário, e não tocar em mais nada do arquivo.

## Critérios de aceitação
- Dado o texto original do `game.lua` e a lista de baralhos com valores alterados, retorna um
  novo texto onde só as tabelas `config` dos baralhos alterados mudaram.
- Consegue adicionar uma chave nova ao `config` de um baralho que não a tinha (ex: dar `dollars`
  ao Red Deck, que hoje não tem essa chave).
- Consegue remover uma chave do `config` quando o usuário zera o valor (volta ao comportamento
  padrão do baralho).
- Round-trip: parsear → não alterar nada → serializar produz texto byte-a-byte idêntico ao
  original.
- Testado contra o `game.lua` sintético, cobrindo adicionar chave nova, alterar chave existente,
  e remover chave.

## Progresso
Concluído em 09/ago/26:
- Refatorei `parse-deck-block.ts`, extraindo o reconhecimento de entrada de baralho (regex de
  linha, marcador `set = "Back"`, extração de bloco balanceado) pra `electron/deck-config/
  deck-entry.ts`, compartilhado com o serializador — sem duplicar a lógica de "o que é uma
  entrada de baralho" entre os dois lados.
- `serialize-deck-block.ts` edita **campo a campo** dentro do `config`, não substitui o bloco
  inteiro: separa os segmentos de nível superior (respeitando o array aninhado de
  `consumables`), atualiza/insere/remove só os 6 campos conhecidos, e preserva qualquer chave
  desconhecida (`voucher`, `ante_scaling`, etc.) exatamente como estava — essencial pro
  round-trip não perder dado de baralhos que o parser não entende totalmente.
- 7 testes, incluindo o round-trip byte-a-byte (parse → sem mudança → serialize == original) e um
  teste específico confirmando que só a linha do baralho editado muda no arquivo inteiro.
