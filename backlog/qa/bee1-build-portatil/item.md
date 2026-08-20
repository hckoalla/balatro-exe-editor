---
id: bee1-build-portatil
title: "Build portátil (.exe único) no lugar do instalador"
type: story
status: qa
owner: ""
sistema: infra
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P2
labels: [pos-mvp]
created: "20/ago/26"
updated: "20/ago/26"
---
# bee1-build-portatil · Build portátil (.exe único) no lugar do instalador

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P2 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Rescopa [bee1-pipeline-release](../../done/bee1-pipeline-release/item.md) — troca o alvo do
> `electron-builder`, não muda o gatilho/estrutura do pipeline.

> Como usuário, quero baixar um único `.exe` e rodar direto (sem tela de instalação, sem
> registrar nada no Windows, sem precisar extrair nada antes), em vez de um instalador.

## Contexto

Pedido pelo usuário depois de três conversas relacionadas:
1. Quis saber se dava pra rodar o app sem instalar — resposta: `npm run package` (NSIS) já gera,
   como etapa intermediária, `release/win-unpacked/Balatro EXE Editor.exe`, 100% rodável sem
   instalar. Só faltava expor isso como o artefato oficial de distribuição.
2. O instalador `.exe` publicado no Nexus Mods caiu em quarentena (falso-positivo de antivírus
   heurístico, comum pra instaladores/executáveis autoextraíveis sem assinatura de código).
3. Comparando com o projeto irmão `my-rpg-companion` (mesma stack, mesmo padrão de
   `electron-builder`), que usa `win.target: "portable"` — um único `.exe` autoextraível — o
   usuário esperava esse mesmo formato aqui, não um `.zip`.

## Decisão final (revisada 20/ago/26)

Primeira tentativa: `build.win.target: ["zip"]` — resolvia o problema de instalação e evitava o
gatilho de antivírus (zip comum não é autoextraível), mas o resultado (extrair antes de rodar)
não era o que o usuário esperava, e ficava diferente do padrão já estabelecido no
`my-rpg-companion`.

Decisão explícita do usuário, sabendo do trade-off: trocar pra `portable` mesmo assim — um único
`.exe`, igual o projeto irmão, mais simples pro usuário final, aceitando o risco de repetir o
falso-positivo de antivírus que já aconteceu no Nexus (é o mesmo tipo de arquivo — autoextraível
— que causou a quarentena da primeira vez).

Também alinhado ao `my-rpg-companion`: ícone do `.exe` passa a vir de um `.ico` de verdade
(`logo/logo_v1.ico`), não de um `.png` cru deixado pro `electron-builder` converter sozinho — o
próprio `.ico` foi gerado pelo `electron-builder` num build anterior (`release/.icon-ico/icon.ico`)
e copiado pra `logo/`, sem precisar de ferramenta nova.

## Critérios de aceitação

- `npm run package` gera um único `.exe` portátil em `release/` (não mais um instalador NSIS, e
  não mais um `.zip`).
- O `.exe` roda direto, sem instalação, sem shortcuts, sem entrada no painel
  "Adicionar/remover programas".
- Ícone do `.exe` vem de `logo/logo_v1.ico` (não do `.png` cru).
- `.github/workflows/release.yml` publica o `.exe` como asset da release.
- Testado localmente de verdade (`npm run package` rodado, `.exe` inspecionado) — não só
  configuração às cegas.

## Fora de escopo

- Assinatura de código — mesma decisão de `bee1-pipeline-release`, continua fora.

## Progresso

Concluído em 20/ago/26 (revisão do resultado inicial em `.zip`, ver "Decisão final" acima).

- `package.json`: `build.win.target: ["portable"]`, `build.win.icon: "logo/logo_v1.ico"`.
- `logo/logo_v1.ico`: copiado do cache de conversão do próprio `electron-builder`
  (`release/.icon-ico/icon.ico`, gerado num build anterior a partir do `.png`) — mesmo padrão do
  `my-rpg-companion`.
- `.github/workflows/release.yml`: comentário do topo e nomes dos 2 últimos steps atualizados pra
  refletir `.exe` portátil; `files: release/*.exe` no step de publicação (voltou ao padrão
  original, já que não é mais `.zip`).
- `README.md`: as 2 menções corrigidas de "portable .zip" pra "portable .exe".
- **Testado localmente de verdade**: `npm run package` rodou (via processo em segundo plano,
  demorou mais que o `zip`), gerou `release/Balatro EXE Editor 1.1.0.exe` (~74MB) — nenhum
  instalador NSIS, nenhum `.zip`. Log de build sem o aviso "default Electron icon is used" que
  aparecia antes do ícone customizado ser configurado.
- 147 testes, tsc e lint continuam limpos (mudança é só config de empacotamento, sem código de
  app).
- Sem teste automatizado novo — mesmo padrão de `bee1-pipeline-release`: config de build/YAML,
  validado rodando o empacotamento de verdade, não TDD.
- **Não verificado visualmente** (mesma limitação de sempre neste ambiente) — vale rodar o `.exe`
  de verdade pra confirmar que abre direto, sem qualquer tela de instalação.
