---
id: bee1-build-portatil
title: "Build portátil (.zip) no lugar do instalador"
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
# bee1-build-portatil · Build portátil (.zip) no lugar do instalador

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P2 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Rescopa [bee1-pipeline-release](../../done/bee1-pipeline-release/item.md) — troca o alvo do
> `electron-builder`, não muda o gatilho/estrutura do pipeline.

> Como usuário, quero baixar um `.zip` e rodar o app direto (sem tela de instalação, sem
> registrar nada no Windows), em vez de um instalador `.exe`.

## Contexto

Pedido pelo usuário depois de duas conversas relacionadas:
1. Quis saber se dava pra rodar o app sem instalar — resposta: `npm run package` (NSIS) já gera,
   como etapa intermediária, `release/win-unpacked/Balatro EXE Editor.exe`, 100% rodável sem
   instalar. Só faltava expor isso como o artefato oficial de distribuição, em vez de artefato
   interno.
2. O instalador `.exe` publicado no Nexus Mods caiu em quarentena (falso-positivo de antivírus
   heurístico, comum pra instaladores/portáteis autoextraíveis sem assinatura de código). Um
   `.zip` da pasta já descompactada evita esse gatilho específico — não é um executável
   autoextraível, é só um `.zip` comum com um `.exe` dentro.

As duas conversas apontam pra mesma solução: `electron-builder` tem um target `zip` nativo pra
Windows (`build.win.target: ["zip"]`) — zipa a pasta `win-unpacked/` automaticamente, sem passo
manual extra no CI. Troca o NSIS inteiro, não adiciona ao lado dele (pedido explícito do
usuário: "não seja instalável, apenas executável").

## Critérios de aceitação

- `npm run package` gera um `.zip` em `release/` (não mais um instalador `.exe` NSIS).
- O conteúdo do `.zip`, extraído, roda direto (`Balatro EXE Editor.exe` já funcional, sem
  instalação, sem shortcuts, sem entrada no painel "Adicionar/remover programas").
- `.github/workflows/release.yml` publica o `.zip` como asset da release (não mais o `.exe` do
  instalador).
- Testado localmente de verdade (`npm run package` rodado, `.zip` inspecionado) — não só
  configuração às cegas.

## Fora de escopo

- Assinatura de código — mesma decisão de `bee1-pipeline-release`, continua fora.
- Mudar o mecanismo de versão/ícone do app — só o formato de empacotamento muda.

## Progresso

Concluído em 20/ago/26.

- `package.json`: `build.win.target: ["zip"]` — substitui o alvo padrão (NSIS instalador).
- `.github/workflows/release.yml`: comentário do topo e nomes dos 2 últimos steps atualizados
  pra refletir `.zip` em vez de instalador; `files: release/*.exe` → `files: release/*.zip` no
  step de publicação.
- `README.md`: as 2 menções a "Windows installer" corrigidas pra "portable .zip".
- **Testado localmente de verdade**: `npm run package` rodou, gerou
  `release/Balatro EXE Editor-1.0.2-win.zip` (~111MB) — nenhum instalador NSIS foi produzido.
  Inspecionei o conteúdo do `.zip` (`unzip -l`): `Balatro EXE Editor.exe` fica direto na raiz do
  `.zip` (não dentro de subpasta) — extrai e roda sem passo extra.
  `release/win-unpacked/` continua existindo como staging interno do electron-builder (não é
  publicado, mesma pasta de antes).
- 145 testes, tsc e lint continuam limpos (mudança é só config de empacotamento, sem código de
  app).
- Sem teste automatizado novo — mesmo padrão de `bee1-pipeline-release`: config de build/YAML,
  validado rodando o empacotamento de verdade, não TDD.
