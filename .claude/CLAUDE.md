# Balatro EXE Editor — Contexto do projeto

App desktop (Electron + React + Vite + TypeScript) que edita o `balatro.exe` diretamente,
substituindo o fluxo manual atual do usuário: abrir o `.exe` no 7-Zip, extrair `game.lua`,
editar no bloco de notas, reinjetar no `.exe`.

## Domínio: como o balatro.exe funciona

O Balatro no Windows é um executável "fusionado" do LÖVE2D: `[stub binário][ZIP concatenado]`.
O ZIP é lido de trás pra frente (End Of Central Directory a partir do fim do arquivo), por isso o
7-Zip abre o `.exe` direto — o stub é ignorado na leitura, mas precisa ser preservado
byte-a-byte na escrita. Dentro do ZIP vive o `game.lua`.

Dentro do `game.lua`, os 15 baralhos jogáveis + `b_challenge` ficam num bloco só (linhas ~628–644
na versão atual). Cada baralho tem uma tabela `config` com chaves **opcionais**, que são
**deltas somados a um valor-base do jogo** (não valores absolutos):

- `dollars` — dinheiro inicial extra
- `hands` / `discards` — mãos/descartes extras
- `joker_slot` — slots de joker extras
- `consumable_slot` — slots de consumível extras
- `consumables = {'c_fool', ...}` — lista de IDs de consumíveis (Tarot/Planeta/Spectral)
  adicionados no início da run

Limites seguros testados empiricamente pelo usuário (acima disso o jogo pode parar de funcionar):
`dollars` +230, `joker_slot` +145, `consumable_slot` +90, `consumables` ~30 itens. O editor
**avisa** ao ultrapassar (soft warning) — não bloqueia.

MVP edita só esses 4 campos, por baralho (não é um valor global único — cada um dos 15 baralhos +
desafio é editado individualmente). Escopo mais genérico fica pra fase 2 (`BEE-10`).

## Design

Prompt de síntese pro Claude Design é a primeira entrega do projeto
(`bee2-prompt-sintese-claude-design`) — vai em `design/prompt-claude-design.md`. O protótipo
gerado a partir dele volta pra `design/*.dc.html`, no mesmo padrão dos projetos irmãos.

## Backlog

O backlog do projeto vive em `backlog/`, versionado em git (sem Jira/Linear — projeto solo).
Convenção completa: [`backlog/README.md`](../backlog/README.md).

Modelo **folder-as-state**: o estado de cada item é a pasta onde ele vive
(`refining → ready → in-progress → qa → done`, + bandejas `cancelled`, `fase2`, `blocked`). Cada
item pertence a um `sistema` (`infra` | `main` | `ui` | `design` | `i18n`).

Antes de mexer no backlog, ler `backlog/README.md`.

## Workflow de desenvolvimento

Cada história (`backlog/ready/<id>/item.md`) é desenvolvida numa branch própria, nomeada com o
`id` da história (ex.: `bee4-parser-bloco-baralhos`), a partir de `main`.

Ciclo por história:

1. Mover o item pra `in-progress/` (`git mv` + atualizar `status:` no frontmatter, no mesmo commit).
2. Desenvolver em **TDD**: escrever o teste antes da implementação, sempre que a funcionalidade
   for testável — unitário e/ou integração. Testes usam as fixtures sintéticas de
   `test/fixtures/` (ver `bee1-setup-testes-tdd`) — nunca o `game.lua`/`.exe` real do jogo.
3. Implementar até cobrir todos os critérios de aceitação do `item.md`.
4. Rodar a suíte de testes localmente.
5. Mover pra `qa/` — é o máximo que o desenvolvimento sozinho pode declarar (ver
   [`backlog/README.md`](../backlog/README.md)) — e **mergear a branch no `main` local, e dar
   `git push origin main`** nesse mesmo momento (sem PR — projeto solo, mas com push direto,
   pedido explícito do usuário). O usuário sempre testa a partir do `main`, nunca precisa fazer
   checkout manual de branch de história.
6. Passar pro usuário validar com **smoke test manual**, a partir do `main` — usando um
   `balatro.exe` real (backup antes de testar!). Só depois da aprovação o item vai pra `done/`.

Regras:

- 1 história = 1 branch, criada a partir do `main`. A branch é mergeada no `main` assim que a
  história chega em `qa/` — não se espera o `done/` pra integrar.
- TDD é o padrão, não opcional, sempre que a história permitir teste automatizado.
- Nenhuma história chega a `done` sem smoke test aprovado pelo usuário.
- Nenhum teste do repositório depende do `game.lua`/`.exe` real do jogo — só fixtures sintéticas
  versionadas.
- `git push origin main` acontece a cada história que chega em `qa/` (pedido explícito do
  usuário) — não é preciso pedir de novo a cada vez.

## Gotchas conhecidos

- **`git push`/`git fetch` travando (timeout, sem erro)**: o Git Credential Manager tem mais de
  uma conta GitHub associada e fica esperando o usuário escolher qual usar — só que esse prompt
  não aparece em terminais não-interativos, então o comando trava até estourar o timeout, sem
  nenhuma mensagem de erro. Resolvido fixando a conta pra este repo (config local, não global):
  `git config --local credential.https://github.com.username hckoalla`. Se voltar a travar, checar
  se essa config ainda está setada (`git config --local --get credential.https://github.com.username`).
- **`ELECTRON_RUN_AS_NODE=1` vazando pro shell** (comum dentro do Claude Code/VSCode, cujo próprio
  host é Electron): faz qualquer `electron.exe` filho rodar como Node puro, sem `app`/
  `BrowserWindow` — `npm run dev` quebra com `Cannot read properties of undefined (reading
  'whenReady')`. Não é bug do projeto. Rodar com a variável removida pro processo filho
  (`env -u ELECTRON_RUN_AS_NODE npm run dev`) resolve.
- **`game.lua` na raiz do projeto é conteúdo proprietário do jogo, local e fora do git**
  (`.gitignore`) — só serve de referência pra entender a estrutura real durante o
  desenvolvimento. Nunca commitar. Fixtures de teste são sintéticas, versionadas em
  `test/fixtures/`.
- **Steam "Verificar integridade dos arquivos do jogo"** pode reverter o `.exe` modificado
  sozinha, sem aviso — o usuário precisa saber disso (documentado na tela de salvar/restaurar,
  `bee5-salvar-alteracoes`).
- **Arquivo travado**: se o Balatro ou a Steam estiverem com o `.exe` aberto, a gravação falha —
  o motor (`bee3-reinjetar-game-lua-no-exe`) precisa detectar isso e retornar um erro específico,
  não um erro genérico de I/O.
- **Campos de `config` são deltas, não valores absolutos** — um baralho sem a chave `dollars`
  usa o valor-base do jogo; a UI precisa deixar isso explícito (ex: "+10", não "10").
