# FinanceOS — package-free edition

FinanceOS now runs directly from plain HTML, CSS and JavaScript. There is no package manager, framework, compilation step or generated build folder.

## Run it

For the dashboard itself, open `index.html` in a browser. To test installation, offline caching, or the service worker, serve this folder from any ordinary static web server or publish it with the included GitHub Pages workflow.

## Publish on GitHub Pages

1. Create an empty GitHub repository and set **Settings → Pages → Source** to **GitHub Actions**.
2. Upload this folder to the repository and push the `main` branch.
3. The included workflow copies the static files and publishes them. It does not install packages or run a build.

Relative asset paths make the site work both at `username.github.io/` and at a repository path such as `username.github.io/financeos/`.

## Connect private data

Follow `backend/apps-script/README.md` to create the Google Sheet backend. Enter the deployed Apps Script `/exec` URL and device token in **Settings**. Credentials remain in browser storage and are never included in the public site.

## Included capabilities

- Responsive light and AMOLED dashboard with mobile navigation
- Explainable safe-to-spend calculation and uncertainty reserve
- Transaction search, review, create, edit and delete flows
- Category budgets, rollovers, future funds and upcoming obligations
- Bank, cash, credit-card and investment account reconciliation
- Optional offline snapshot, JSON backup and PBKDF2 device privacy PIN
- Installable PWA with scope-aware offline cache
- Authenticated Apps Script/Google Sheet backend

## Security

GitHub Pages is public. Never commit exports, real device tokens or personal ledger data. The Apps Script token controls backend access; use one token per device and revoke it if it leaks.

The small embedded icon subset is retained from the original Lucide dependency and covered by THIRD_PARTY_NOTICES.txt; it no longer requires the library at runtime.
