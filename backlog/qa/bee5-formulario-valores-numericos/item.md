---
id: bee5-formulario-valores-numericos
title: "Formulário de edição: dollars, joker_slot, consumable_slot"
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
# bee5-formulario-valores-numericos · Formulário de valores numéricos

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee5-tela-selecao-baralho](../bee5-tela-selecao-baralho/item.md).

> Como usuário, quero editar o dinheiro inicial, os slots de joker e os slots de consumível de um
> baralho, e ser avisado se o valor pode quebrar o jogo, para poder customizar sem crashar sem
> saber por quê.

## Contexto
Os 3 valores são **deltas** somados ao valor-base do jogo (ver `backlog/README.md` — contexto de
domínio), não valores absolutos. A UI precisa deixar isso claro (ex: "+10 dólares iniciais", não
"10 dólares iniciais").

## Critérios de aceitação
- Campos numéricos pra `dollars`, `joker_slot`, `consumable_slot`, deixando explícito que são
  valores adicionados ao padrão do jogo (não absolutos).
- Ao digitar um valor acima do limite seguro conhecido (`dollars` +230, `joker_slot` +145,
  `consumable_slot` +90), mostra um aviso visível (soft warning) explicando que passou do que já
  foi testado e pode fazer o jogo parar de funcionar — mas **não bloqueia** o campo.
- Aceita valores negativos (reduzir em vez de aumentar), já que o jogo também usa deltas
  negativos (ex: Painted Deck tem `joker_slot = -1`).
- Campo vazio/zerado remove a chave do `config` do baralho (volta ao padrão do jogo).
- Cada campo tem um botão de **reset individual** (ícone de rollback ao lado do campo), visível
  só quando o valor atual difere do padrão do jogo — clicar limpa aquele campo específico, sem
  afetar os outros campos do mesmo baralho. Equivalente a esvaziar o campo, só que com affordance
  visual explícita em vez de o usuário precisar apagar manualmente.

## Decisão registrada (sem o usuário disponível pra confirmar)
O aviso de limite seguro dispara em `Math.abs(valor) > limite` — ou seja, também em deltas
MUITO negativos (ex: `dollars = -500`), não só em excessos positivos. O usuário só descreveu
limites testados como "até +230" etc., mas nada garante que um delta muito negativo seja mais
seguro — tratar os dois lados do mesmo jeito pareceu a leitura mais conservadora. Fácil de
ajustar se ele preferir só avisar no lado positivo.

## Progresso
Concluído em 09/ago/26:
- `NumericFieldsForm` (componente controlado puro): 3 campos, prefixo "+" quando positivo, hint
  "Added to the base game value.", warning laranja (soft, não bloqueia) acima do limite seguro,
  botão de reset por campo (só aparece quando o campo tem valor).
- `DeckEditorScreen`: hospeda o formulário + título do baralho + botão "Back"; dona do estado
  `config` local (editor de consumíveis e botão salvar entram nas próximas 2 histórias).
  `App.tsx` liga `DecksScreen` → `DeckEditorScreen`.
- **Gotcha de teste**: componente controlado testado com `render()` estático "reseta" o campo a
  cada tecla (React força o `value` de volta pro prop antigo). Corrigido com um harness de teste
  com `useState` próprio, simulando como o pai de verdade se comportaria.
- 8 testes novos (6 do formulário + 2 da tela).
