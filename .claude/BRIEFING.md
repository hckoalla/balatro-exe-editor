# Balatro EXE Editor — Briefing

## Estado técnico

- **Stack**: Electron + React + Vite + TypeScript. Testes com Vitest (unitário + componente,
  `@testing-library/react`), sem depender do `game.lua`/`.exe` real do jogo — só fixtures
  sintéticas em `test/fixtures/`. i18next + react-i18next (en padrão/fallback, pt-BR, es).
- **Decisões de arquitetura**:
  - O `balatro.exe` no Windows é `[stub binário][ZIP concatenado]`, lido de trás pra frente
    (End Of Central Directory) — o stub nunca é parseado, só precisa ser preservado
    byte-a-byte na escrita.
  - Parsers/serializers sob medida por domínio (regex + contagem de chaves, não um parser de
    Lua completo): `electron/deck-config/` (bloco de baralhos) e `electron/poker-hand-config/`
    (tabela de mãos de pôquer) seguem o mesmo padrão — uma entrada por linha, marcador de
    identificação (`set = "Back"` / presença de `s_mult`), regex pra extrair/substituir campos.
  - Campos de `config` de baralho (`dollars`, `hands`, `discards`, `joker_slot`,
    `consumable_slot`) são **deltas somados ao valor-base do jogo** — exceto no fluxo de edição
    em lote, que define valor absoluto e sobrescreve o delta existente (exceção deliberada).
  - Mãos de pôquer têm campo "base" (`s_mult`/`s_chips`) e campo "efetivo" (`mult`/`chips`) — o
    jogo só recalcula o efetivo a partir do base quando a mão sobe de nível
    (`level_up_hand()`); o serializer sincroniza os dois na gravação (bug encontrado e corrigido
    em 24/ago/26).
  - Um único backup por `.exe` (o `game.lua` inteiro, capturado antes da 1ª gravação de
    qualquer editor). Restauração por escopo (só baralhos, só mãos) reaproveita os
    parsers/serializers de cada domínio pra filtrar, do backup único, só a parte relevante —
    não existe backup separado por escopo.
  - Navegação por 4 abas (`MainTabs.tsx`): Edição de Baralho, Edição de Baralho por Lote,
    Edição de Mão de Pôquer, Configurações — cada uma desmonta a anterior ao trocar (reseta
    estado interno, decisão deliberada).
  - Confirmações de ações que gravam no `.exe` (salvar, restaurar) abrem num `Modal`
    reutilizável (overlay + caixa centralizada), não mais bloco inline.
- **Convenções**: nenhuma string de UI hardcoded em JSX — sempre `t('namespace.chave')`,
  organizadas por componente. 1 história = 1 branch a partir de `main`; TDD (teste antes da
  implementação); merge direto na `main` assim que a história chega em `qa/` (sem PR, projeto
  solo, push imediato); nenhuma história chega a `done/` sem smoke test manual aprovado pelo
  usuário. `game.lua`, `balatro-exe-source-code/`, fontes/texturas/sons do jogo real são
  conteúdo proprietário, local, fora do git (`.gitignore`) — só usados como referência durante o
  desenvolvimento, nunca commitados; fixtures de teste são sintéticas e versionadas.
- **Backlog atual** (folder-as-state, `backlog/BACKLOG.md`): refining 0, ready 1
  (`bee5-testar-limites-seguros`, spike que depende de teste manual do usuário), in-progress 0,
  qa 1 (`bee5-modal-confirmacao`, aguardando smoke test), done 39, cancelled 3, fase3 1
  (`bee11-jokers-iniciais-challenge`, viável mas deixado por último). Épicas ativas: BEE-1
  (Setup), BEE-2 (Design), BEE-3 (motor .exe), BEE-4 (parsing baralhos), BEE-5 (editor UI), BEE-6
  (backup/restauração), BEE-7 (i18n), BEE-8 (detecção Steam), BEE-12 (níveis de mão de pôquer).

## Catálogo de produtos

### Balatro EXE Editor

- **Status**: Em desenvolvimento — v1.2.0 pronta (código + changelog), ainda não taggeada/
  publicada no GitHub Releases nem no itch.io.
- **Pitch**: App desktop que edita o `balatro.exe` direto, substituindo o fluxo manual de abrir
  no 7-Zip, extrair o `game.lua`, editar no bloco de notas e reinjetar.
- **Sobre**: Edita valores de baralho (dinheiro inicial, slots de joker/consumível, consumíveis
  iniciais) e, desde a v1.2.0, também os níveis de mão de pôquer (chips/mult base e por nível) —
  individualmente, em lote (múltiplos baralhos de uma vez) ou restaurados por escopo, sempre com
  backup automático antes da primeira edição.
- **Features**:
  - Edição por baralho: dinheiro inicial, slots de joker, slots de consumível e consumíveis
    iniciais (Tarot/Planeta/Spectral), um dos 15 baralhos jogáveis + baralho de desafio.
  - Edição em lote: seleciona vários baralhos com checkbox e aplica o mesmo setup a todos de
    uma vez (valor absoluto, substitui o que cada um já tinha).
  - Editor de mãos de pôquer: valor base (nível 1) e incremento por nível de cada tipo de mão.
  - Restauração por escopo: baralhos, mãos de pôquer, ou tudo de uma vez — cada uma sem afetar
    o outro escopo.
  - Avisos informativos no baralho de desafio: dinheiro alto pode quebrar o desafio Luxury Tax
    (encolhe a mão); alguns desafios (Blast Off, Five-Card Draw, Cruelty, Jokerless, Typecast)
    ignoram o valor de slots de joker editado.
  - Detecção automática da instalação via Steam, além de seleção manual do `.exe`.
  - Interface em inglês, português (BR) e espanhol.
- **Specs**:
  - Plataforma: Windows (o `.exe` só existe nessa plataforma; suporte macOS/Linux avaliado e
    descartado por falta de demanda real).
  - Distribuição planejada: GitHub Releases + itch.io (`storydevgames.itch.io/balatro-exe-editor`),
    build portátil (sem instalador), publicação automática via GitHub Actions ao criar uma tag.
  - Repositório: `github.com/hckoalla/balatro-exe-editor`.
