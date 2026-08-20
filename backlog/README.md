# Backlog-as-code — Balatro EXE Editor

Backlog do projeto **versionado em git**. Sem Jira/Linear — projeto solo, a fonte de verdade é
esta pasta: cada item vive em um arquivo, e seu **estado é a pasta onde está**.

## Modelo: folder-as-state

```
backlog/
  README.md               ← este arquivo (a convenção)
  BACKLOG.md              ← vista GERADA (quadro + pendentes por épica). NÃO editar à mão.
  _epicas/<ID>.md          ← as épicas
  <estado>/<ID>/item.md    ← 1 item = 1 pasta. A pasta = o estado.
  <estado>/.gitkeep        ← para o git preservar as pastas de estado mesmo vazias
  fase2/                   ← BANDEJA (não é um estado). Ver fase2/README.md
  fase3/                   ← BANDEJA (não é um estado) — prioridade menor que fase2
  blocked/                 ← BANDEJA (não é um estado)
  cancelled/               ← BANDEJA (não é um estado)
```

### Estados (mover a pasta = mudar o estado)

```
refining → ready → in-progress → qa → done
```

| Estado | Significado |
|---|---|
| `refining` | Sem refinamento ou bloqueado (NÃO pegável) |
| `ready` | Refinado e pegável |
| `in-progress` | Em desenvolvimento |
| `qa` | Construído, em teste/validação — bug aberto que contradiz um critério de aceite volta pra cá |
| `done` | Testado e validado, sem bug aberto contra os critérios de aceite |

**Quem move pra `done`:** só o usuário, depois de um smoke test manual aprovado. Desenvolvimento
(com TDD) leva o item até `qa` — testes automatizados passando, critérios de aceitação cobertos.
`qa` é o máximo que o trabalho de código sozinho pode declarar; `done` exige validação humana com
o `balatro.exe` real. Ver o workflow completo em [`.claude/CLAUDE.md`](../.claude/CLAUDE.md).

### Bandejas (NÃO são estados do fluxo)

Vivem fora do eixo `refining → done`. Um item aqui não está no quadro ativo.

| Bandeja | Significado |
|---|---|
| `cancelled` | Descartada / substituída. Terminal. |
| `fase2` | Escopo entendido e dimensionado, conscientemente adiado para depois do MVP. |
| `fase3` | Como `fase2`, mas deliberadamente por último — feita depois de tudo o mais em `fase2`, mesmo já viável tecnicamente. Usada quando a análise técnica já foi feita (pra não perder o trabalho), mas a prioridade real é "por último". |
| `blocked` | Escopo entendido, mas travada por uma dependência concreta ainda não resolvida (outra história/épica). |

**Mudar de estado** = `git mv <estado_velho>/<ID> <estado_novo>/<ID>` + atualizar `status:` no
frontmatter, **no MESMO commit**. Vale também pra mover de/para uma bandeja.

## Convenção de IDs

- Épicas: `BEE-<n>` sequencial.
- Itens: `bee<épica>-slug-descritivo` (kebab-case, minúsculo), ex: `bee4-parser-bloco-baralhos`.
- `type`: `story | bug | spike | epic`.
- `sistema`: classifica o item por camada, ortogonal à épica:
  - `infra` — setup, build, empacotamento, ferramentas
  - `main` — processo main do Electron (I/O do `.exe`, parsing do Lua, backup)
  - `ui` — processo renderer (telas/componentes React)
  - `design` — artefatos de design (Claude Design, design system)
  - `i18n` — internacionalização
- `priority`: `P0` (bloqueia o MVP) a `P3` (polimento).

## O `item.md`

Frontmatter: `id, title, type, status, owner, sistema, domain, domain_title, priority, labels, created, updated`

Corpo: `# <ID> · título` → tabela de metadata → user story (bloco de citação) → `## Contexto` →
`## Critérios de aceitação` → opcional `## Fora de escopo` / `## Abordagem técnica` / `## Progresso`.

## `BACKLOG.md` é GERADO — não editar à mão

É a projeção de todos os `item.md` (quadro + pendentes por épica), mantida à mão por enquanto —
a fonte de verdade continua sendo o `item.md` de cada item.

## Contexto de domínio (pra quem for refinar itens novos)

O Balatro no Windows é distribuído como um `.exe` "fusionado" do LÖVE2D: um stub binário seguido
de um arquivo ZIP concatenado no final (por isso o 7-Zip consegue abrir o `.exe` direto — ele
procura o End Of Central Directory a partir do fim do arquivo, ignorando o stub). Dentro desse ZIP
vive o `game.lua`.

Dentro do `game.lua`, os 15 baralhos jogáveis + o baralho de desafio (`b_red` … `b_erratic`,
`b_challenge`) ficam definidos num bloco só (linhas ~628–644 na versão atual). Cada baralho tem
uma tabela `config` com chaves **opcionais**, que são **deltas somados a um valor-base do jogo**
(não valores absolutos):

- `dollars` — dinheiro inicial extra
- `hands` / `discards` — mãos/descartes extras
- `joker_slot` — slots de joker extras
- `consumable_slot` — slots de consumível extras
- `consumables = {'c_fool', ...}` — lista de IDs de consumíveis (Tarot/Planeta/Spectral) que o
  baralho adiciona no início da run

Limites seguros testados empiricamente pelo usuário (acima disso o jogo pode parar de funcionar):
`dollars` até +230, `joker_slot` até +145, `consumable_slot` até +90, `consumables` até ~30 itens.
O editor **avisa** ao ultrapassar (soft warning), não bloqueia — ver
[`BEE-5`](_epicas/BEE-5.md).
