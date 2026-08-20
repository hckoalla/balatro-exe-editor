// HTML estático e autocontido pra splash window (ver bee1-splash-nativa) — carregado via
// data: URL, então não pode depender do bundle Vite/dev server nem de nenhum recurso externo. O
// logo também vem embutido como base64 pelo mesmo motivo (ver bee2-aplicar-logo-banner) — quem
// lê o arquivo e converte é o chamador (create-splash-window.ts), essa função continua pura.
export function buildSplashHtml(logoBase64: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        height: 100%;
        background: #0a0710;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
      }
      .splash {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .splash__logo {
        width: 72px;
        height: auto;
      }
      .splash__spinner {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.08);
        border-top-color: #f3b542;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div class="splash">
      <img class="splash__logo" src="data:image/png;base64,${logoBase64}" alt="Balatro EXE Editor" />
      <div class="splash__spinner"></div>
    </div>
  </body>
</html>`
}
