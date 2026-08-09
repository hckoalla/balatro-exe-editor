import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Node por padrão — o motor do .exe (electron/exe-engine, test/fixtures) usa adm-zip, que é
    // Node-only. Testes de componente React optam por jsdom individualmente via docblock
    // (`// @vitest-environment jsdom`), senão o Vite resolve dependências pelo campo "browser"
    // do package.json e quebra bibliotecas Node-only silenciosamente (zip vinha vazio).
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['{src,electron,test}/**/*.test.{ts,tsx}'],
  },
})
