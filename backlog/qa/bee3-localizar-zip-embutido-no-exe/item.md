---
id: bee3-localizar-zip-embutido-no-exe
title: "Localizar o ZIP embutido dentro do balatro.exe"
type: story
status: qa
owner: ""
sistema: main
domain: BEE-3
domain_title: "Motor de Leitura/Escrita do balatro.exe"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee3-localizar-zip-embutido-no-exe · Localizar o ZIP embutido

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-3](../../_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe | main |

> Depende de [bee1-setup-testes-tdd](../bee1-setup-testes-tdd/item.md).

> Como desenvolvedor, quero uma função que localize onde o ZIP começa dentro do `.exe` fusionado
> do LÖVE2D, para poder ler e escrever o conteúdo desse ZIP sem tocar no stub binário.

## Contexto
Um `.exe` fusionado do LÖVE2D é `[stub binário do LÖVE][ZIP com o código do jogo]` concatenados.
Ferramentas de ZIP conseguem abri-lo porque o formato ZIP é lido de trás pra frente (procura o
"End Of Central Directory" a partir do fim do arquivo) — o prefixo binário é ignorado na leitura,
mas precisa ser preservado byte-a-byte na escrita.

## Critérios de aceitação
- Dado o buffer de um `.exe` fusionado, a função retorna o offset onde o ZIP começa (fim do stub)
  e confirma que os bytes a partir dali formam um ZIP válido.
- Se o `.exe` não contém um ZIP válido (arquivo corrompido, ou não é um `.exe` fusionado do
  LÖVE2D), retorna um erro claro em vez de lançar exceção genérica.
- Testado contra o `.exe` sintético de `bee1-setup-testes-tdd`.

## Progresso
Concluído em 09/ago/26:
- `electron/exe-engine/locate-embedded-zip.ts`: acha o EOCD escaneando de trás pra frente, deriva
  o offset do stub a partir do offset relativo do central directory guardado no EOCD (mesmo
  truque usado por ferramentas de SFX), e confirma com `adm-zip` que os bytes resultantes formam
  um ZIP válido de verdade — não só que a aritmética do EOCD fechou por coincidência.
- 3 testes: offset correto contra o `.exe` sintético, erro claro sem EOCD nenhum, erro claro com
  EOCD presente mas matematicamente inconsistente (arquivo corrompido).
