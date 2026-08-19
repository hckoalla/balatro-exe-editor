// HTML estático e autocontido pra splash window (ver bee1-splash-nativa) — carregado via
// data: URL, então não pode depender do bundle Vite/dev server nem de nenhum recurso externo.
export function buildSplashHtml(): string {
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
      .splash__spinner {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.08);
        border-top-color: #f3b542;
        animation: spin 0.8s linear infinite;
      }
      .splash__title {
        color: #f3f1ee;
        letter-spacing: 4px;
        font-size: 13px;
        font-weight: 600;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div class="splash">
      <div class="splash__spinner"></div>
      <div class="splash__title">BALATRO EXE EDITOR</div>
    </div>
  </body>
</html>`
}
