# Publish FinanceOS without a build step

This edition is made from browser-native HTML, CSS and JavaScript. You do not need Node.js, npm, a package manager, or a local build.

## 1. Create the repository

1. Sign in to your personal GitHub account.
2. Create an empty repository. “financeos” is a good name.
3. Do not add a README, .gitignore, license or starter files.
4. Open **Settings → Pages** and set **Source** to **GitHub Actions**.

GitHub Pages is public. Never add backup exports, device tokens or private financial records to the repository.

## 2. Upload FinanceOS

Copy every file and folder from this package into the repository, including .github and .nojekyll, then commit to the main branch. You can use GitHub’s website, GitHub Desktop, or Git.

The included workflow publishes the files directly. It does not install dependencies or compile anything.

## 3. Open and install the PWA

When the **Deploy FinanceOS to GitHub Pages** workflow succeeds, open the URL shown in its deployment summary.

On iPhone, open the site in Safari, use **Share → Add to Home Screen**, enable **Open as Web App**, and tap **Add**.

On Android, open the site in Chrome and choose **Install app** or **Add to Home screen**.

## 4. Connect private data

Follow backend/apps-script/README.md to create the Google Sheet backend. In FinanceOS **Settings**, enter the Apps Script /exec URL and your device token, then select **Test and sync**.

The endpoint and token are stored only in that browser. They are not added to the public static files.

## Updating later

Edit index.html, styles.css, or app.js, then commit and push. Every push to main deploys the static files again with no build or package installation.
