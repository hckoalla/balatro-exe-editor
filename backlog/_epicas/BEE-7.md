---
id: BEE-7
title: "Internacionalização"
type: epic
sistema: i18n
created: "08/ago/26"
---
# BEE-7 · Internacionalização

Interface em inglês por padrão, com suporte a troca de idioma pra português (PT-BR) e espanhol
(ES) numa aba de configurações.

Critérios de sucesso:
- Toda string de UI passa por uma camada de i18n (nenhum texto hardcoded fora dos arquivos de
  tradução), com inglês como idioma padrão/fallback.
- Traduções completas pra PT-BR e ES.
- Usuário troca o idioma numa seção de configurações, e a escolha persiste entre reinícios do
  app.
