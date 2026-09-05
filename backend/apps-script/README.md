# FinanceOS Sheet backend

This folder is a container-bound Google Apps Script backend for FinanceOS. It is deliberately installed by copy-paste; no GitHub account, command-line deployment, or shared FinanceOS server is required.

## Install

1. Create a new, empty Google Sheet in the Google account that should own the data.
2. In the Sheet, open **Extensions → Apps Script**.
3. Replace the editor contents with `Code.gs` from this folder.
4. Open **Project Settings**, enable **Show appsscript.json manifest file in editor**, then replace the generated manifest with this folder's `appsscript.json`.
5. Run `setupFinanceOS()` once and approve the requested Sheet, Gmail-readonly and trigger permissions.
6. Return to the Sheet and reload it. Use **FinanceOS → Create device token**. Copy the token when it is shown; only its SHA-256 hash is stored in the workbook.
7. In Apps Script, choose **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: the narrowest option that works for your Google account. If you choose anonymous access for a static PWA, treat the generated device token as the API credential and rotate it immediately if it leaks.
8. Copy the deployed URL ending in `/exec`, open FinanceOS → Settings, paste the URL and token, save, then test the connection.

## Gmail ingestion

1. In Gmail, create a label named `FinanceOS` and filters that apply it only to genuine transaction-alert emails. Never label OTP or authentication emails.
2. In the Sheet's `ParserRules` tab, duplicate the disabled template closest to your bank and adapt the sender, subject and body regex to a real sample. Keep it disabled until it correctly extracts amount, merchant and last four digits.
3. Register matching accounts in the `Accounts` tab. The `last4` value is how a parsed alert is assigned to an account.
4. Set `enabled` to `TRUE`, then run **FinanceOS → Sync Gmail alerts now**.
5. Check `IngestEvents` and the app review queue. FinanceOS never fuzzy-merges two transactions; near matches are marked as duplicate candidates.
6. When the rule works, choose **FinanceOS → Install 15-minute Gmail sync**.

The default Gmail query is `label:FinanceOS newer_than:7d`. Change `gmail_query` in `Settings` if you use a different label.

## Security and recovery

- Device tokens can read and write the ledger. Give each device its own token.
- Revoke a token by adding an ISO timestamp to `revoked_at` in `DeviceTokens`.
- The frontend PIN is only a local privacy gate; backend access is controlled here.
- `AuditLog` is append-only. Transaction and posting deletions are soft deletes.
- Export the full workbook periodically from Google Sheets. The app also exports portable JSON snapshots.
- Re-run `setupFinanceOS()` after upgrading the backend. It repairs missing tabs and headers without deleting data.

## Important limitations

FinanceOS is personal software, not a regulated bank or investment service. Email formats change, alerts can be missing, and calculated balances can drift. Reconcile accounts regularly and treat forecasts as estimates.
