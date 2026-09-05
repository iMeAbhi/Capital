/**
 * FinanceOS Apps Script backend
 *
 * Bind this project to the Google Sheet that will hold the user's data.
 * Run setupFinanceOS() once, then create a device token and deploy as a web app.
 * All mutations are serialized with LockService and written to AuditLog.
 */

const FINANCEOS_SCHEMA_VERSION = 1;
const FINANCEOS_CURRENCY = "INR";

const TABLES = {
  Setup: ["key", "value", "note"],
  Accounts: [
    "id", "name", "institution", "type", "last4", "opening_balance",
    "balance", "reported_balance", "limit", "color", "active",
    "last_reconciled_at", "created_at", "updated_at",
  ],
  Transactions: [
    "id", "date", "merchant", "note", "category", "amount", "account_id",
    "destination_account_id", "source", "status", "kind", "source_event_id",
    "created_at", "updated_at", "deleted_at",
  ],
  Postings: [
    "id", "transaction_id", "account_id", "amount", "currency", "role",
    "created_at", "deleted_at",
  ],
  Budgets: [
    "id", "name", "group", "cap", "spent", "color", "rollover",
    "created_at", "updated_at",
  ],
  RecurringRules: [
    "id", "name", "category", "amount", "due_date", "account_id", "cadence",
    "status", "certainty", "amount_tolerance", "active", "created_at", "updated_at",
  ],
  IngestEvents: [
    "id", "source", "source_event_id", "received_at", "raw_hash", "parser_rule_id",
    "parse_status", "transaction_id", "duplicate_candidate_of", "error", "raw_excerpt",
  ],
  BalanceSnapshots: [
    "id", "account_id", "balance", "as_of", "source", "created_at",
  ],
  Reconciliations: [
    "id", "account_id", "calculated_balance", "reported_balance", "difference",
    "adjustment_transaction_id", "reconciled_at",
  ],
  ParserRules: [
    "id", "bank_name", "source", "sender_pattern", "subject_pattern", "body_regex",
    "field_map_json", "direction", "enabled", "version", "updated_at",
  ],
  DeviceTokens: [
    "id", "name", "token_hash", "created_at", "last_used_at", "revoked_at",
  ],
  AuditLog: [
    "id", "timestamp", "actor", "action", "entity_type", "entity_id",
    "before_json", "after_json",
  ],
  Settings: ["key", "value", "updated_at"],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("FinanceOS")
    .addItem("Set up / repair workbook", "setupFinanceOS")
    .addItem("Create device token", "createDeviceToken")
    .addItem("Install 15-minute Gmail sync", "installGmailSyncTrigger")
    .addItem("Sync Gmail alerts now", "syncGmailAlerts")
    .addSeparator()
    .addItem("Seed demo workspace", "seedFinanceOSDemo")
    .addItem("Recalculate all balances", "recalculateAccountBalances")
    .addItem("Show system health", "showFinanceOSHealth")
    .addToUi();
}

function setupFinanceOS() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const workbook = SpreadsheetApp.getActiveSpreadsheet();
    Object.keys(TABLES).forEach((name) => ensureTable_(workbook, name, TABLES[name]));

    upsertObject_("Setup", "key", {
      key: "schema_version",
      value: FINANCEOS_SCHEMA_VERSION,
      note: "Managed by FinanceOS. Do not lower this number.",
    });
    upsertObject_("Setup", "key", {
      key: "workbook_id",
      value: workbook.getId(),
      note: "The bound workbook used as the source of truth.",
    });
    upsertObject_("Setup", "key", {
      key: "installed_at",
      value: nowIso_(),
      note: "Last setup or repair run.",
    });

    const defaults = {
      gmail_query: "label:FinanceOS newer_than:7d",
      base_currency: FINANCEOS_CURRENCY,
      forecast_uncertainty_reserve: "9001",
      minimum_cash_buffer: "20000",
      next_salary_day: "1",
      parser_batch_limit: "100",
    };
    Object.keys(defaults).forEach((key) => {
      if (!getSetting_(key)) setSetting_(key, defaults[key]);
    });

    seedParserRuleTemplates_();
    audit_("setup", "workbook", workbook.getId(), null, {
      schemaVersion: FINANCEOS_SCHEMA_VERSION,
    });
    workbook.toast("FinanceOS is ready. Create a device token next.", "FinanceOS", 8);
    return getSystemHealth_();
  } finally {
    lock.releaseLock();
  }
}

function createDeviceToken() {
  ensureInstalled_();
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    "Create a FinanceOS device token",
    "Name this device, for example ‘Shivam Android’ or ‘Home laptop’.",
    ui.ButtonSet.OK_CANCEL,
  );
  if (prompt.getSelectedButton() !== ui.Button.OK) return null;

  const token = `fos_${Utilities.getUuid().replace(/-/g, "")}${Utilities.getUuid().replace(/-/g, "").slice(0, 16)}`;
  const row = {
    id: id_("device"),
    name: prompt.getResponseText().trim() || "Unnamed device",
    token_hash: sha256Hex_(token),
    created_at: nowIso_(),
    last_used_at: "",
    revoked_at: "",
  };
  appendObject_("DeviceTokens", row);
  audit_("create_token", "device_token", row.id, null, {
    id: row.id,
    name: row.name,
    created_at: row.created_at,
  });
  ui.alert(
    "Copy this token now",
    `${token}\n\nPaste it into FinanceOS Settings. It cannot be displayed again. To revoke it, add a timestamp to revoked_at in DeviceTokens.`,
    ui.ButtonSet.OK,
  );
  return token;
}

function installGmailSyncTrigger() {
  ensureInstalled_();
  const existing = ScriptApp.getProjectTriggers().filter(
    (trigger) => trigger.getHandlerFunction() === "syncGmailAlerts",
  );
  existing.forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger("syncGmailAlerts").timeBased().everyMinutes(15).create();
  audit_("install_trigger", "system", "gmail_sync", null, { cadence: "15_minutes" });
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Gmail sync will run every 15 minutes.",
    "FinanceOS",
    6,
  );
}

function doGet() {
  return json_({
    ok: true,
    service: "FinanceOS",
    schemaVersion: FINANCEOS_SCHEMA_VERSION,
    message: "Use an authenticated POST request from the FinanceOS app.",
  });
}

function doPost(event) {
  try {
    ensureInstalled_();
    const request = parseRequest_(event);
    const device = authenticateDevice_(request.token);
    const action = String(request.action || "");
    const payload = request.payload || {};

    const publicActions = {
      bootstrap: () => buildBootstrap_(),
      health: () => getSystemHealth_(),
    };
    if (publicActions[action]) {
      return json_({ ok: true, data: publicActions[action](), device: device.name });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const mutationActions = {
        upsert_transaction: () => upsertTransaction_(payload, device),
        delete_transaction: () => deleteTransaction_(payload.id, device),
        confirm_transaction: () => confirmTransaction_(payload.id, device),
        upsert_budget: () => upsertBudget_(payload, device),
        upsert_recurring: () => upsertRecurring_(payload, device),
        settle_recurring: () => settleRecurring_(payload.id, device),
        reconcile_account: () => reconcileAccount_(payload, device),
        upsert_account: () => upsertAccount_(payload, device),
        sync_gmail: () => syncGmailAlerts_(),
      };
      if (!mutationActions[action]) throw new Error(`Unknown action: ${action}`);
      const result = mutationActions[action]();
      return json_({ ok: true, data: result });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function buildBootstrap_() {
  const accounts = readObjects_("Accounts")
    .filter((row) => truthy_(row.active) && !row.deleted_at)
    .map((row) => ({
      id: String(row.id),
      name: String(row.name),
      institution: String(row.institution || "Manual"),
      type: String(row.type || "bank"),
      last4: row.last4 ? String(row.last4) : undefined,
      balance: number_(row.balance),
      reportedBalance: row.reported_balance === "" ? undefined : number_(row.reported_balance),
      limit: row.limit === "" ? undefined : number_(row.limit),
      color: String(row.color || "#2f755f"),
      freshness: row.updated_at ? relativeFreshness_(row.updated_at) : "Manual",
      reconciledAt: row.last_reconciled_at ? String(row.last_reconciled_at).slice(0, 10) : undefined,
    }));

  const transactions = readObjects_("Transactions")
    .filter((row) => !row.deleted_at)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 2500)
    .map((row) => ({
      id: String(row.id),
      date: String(row.date),
      merchant: String(row.merchant),
      note: row.note ? String(row.note) : undefined,
      category: String(row.category || "Uncategorized"),
      amount: number_(row.amount),
      accountId: String(row.account_id),
      destinationAccountId: row.destination_account_id ? String(row.destination_account_id) : undefined,
      source: String(row.source || "manual"),
      status: String(row.status || "needs_review"),
      kind: String(row.kind || (number_(row.amount) >= 0 ? "income" : "expense")),
      sourceEventId: row.source_event_id ? String(row.source_event_id) : undefined,
    }));

  const budgets = readObjects_("Budgets").map((row) => ({
    id: String(row.id),
    name: String(row.name),
    group: String(row.group || "flex"),
    cap: number_(row.cap),
    spent: calculateCategorySpend_(String(row.name)),
    color: String(row.color || "#2f755f"),
    rollover: row.rollover === "" ? undefined : number_(row.rollover),
  }));

  const recurring = readObjects_("RecurringRules")
    .filter((row) => truthy_(row.active))
    .map((row) => ({
      id: String(row.id),
      name: String(row.name),
      category: String(row.category),
      amount: number_(row.amount),
      dueDate: String(row.due_date),
      accountId: String(row.account_id),
      cadence: String(row.cadence || "monthly"),
      status: String(row.status || "upcoming"),
      certainty: String(row.certainty || "exact"),
    }));

  return {
    accounts,
    transactions,
    budgets,
    recurring,
    generatedAt: nowIso_(),
    schemaVersion: FINANCEOS_SCHEMA_VERSION,
  };
}

function upsertTransaction_(payload, device) {
  validateTransaction_(payload);
  const transactionId = safeId_(payload.id || id_("txn"));
  const existing = findObject_("Transactions", "id", transactionId);
  const now = nowIso_();
  const transactionDate = new Date(payload.date || now);
  if (Number.isNaN(transactionDate.getTime())) throw new Error("Transaction date is invalid");
  const row = {
    id: transactionId,
    date: transactionDate.toISOString(),
    merchant: sanitizeText_(payload.merchant, 180),
    note: sanitizeText_(payload.note || "", 500),
    category: sanitizeText_(payload.category || "Uncategorized", 100),
    amount: number_(payload.amount),
    account_id: String(payload.accountId || payload.account_id),
    destination_account_id: String(payload.destinationAccountId || payload.destination_account_id || ""),
    source: String(payload.source || "manual"),
    status: String(payload.status || "confirmed"),
    kind: String(payload.kind || (number_(payload.amount) >= 0 ? "income" : "expense")),
    source_event_id: String(payload.sourceEventId || payload.source_event_id || ""),
    created_at: existing ? existing.object.created_at : now,
    updated_at: now,
    deleted_at: "",
  };
  upsertObject_("Transactions", "id", row);
  replacePostingsForTransaction_(row);
  recalculateAccountBalances_(false);
  audit_(existing ? "update" : "create", "transaction", row.id, existing ? existing.object : null, row, device);
  return row;
}

function deleteTransaction_(transactionId, device) {
  const existing = requireObject_("Transactions", "id", transactionId);
  const after = { ...existing.object, deleted_at: nowIso_(), updated_at: nowIso_() };
  writeObjectAt_("Transactions", existing.rowIndex, after);
  softDeleteWhere_("Postings", "transaction_id", transactionId);
  recalculateAccountBalances_(false);
  audit_("delete", "transaction", transactionId, existing.object, after, device);
  return { id: transactionId, deleted: true };
}

function confirmTransaction_(transactionId, device) {
  const existing = requireObject_("Transactions", "id", transactionId);
  const after = { ...existing.object, status: "confirmed", updated_at: nowIso_() };
  writeObjectAt_("Transactions", existing.rowIndex, after);
  audit_("confirm", "transaction", transactionId, existing.object, after, device);
  return after;
}

function upsertBudget_(payload, device) {
  if (!payload.id) throw new Error("Budget id is required");
  const budgetId = safeId_(payload.id);
  const existing = findObject_("Budgets", "id", budgetId);
  const row = {
    id: budgetId,
    name: sanitizeText_(payload.name || (existing && existing.object.name) || "Budget", 100),
    group: String(payload.group || (existing && existing.object.group) || "flex"),
    cap: number_(payload.cap),
    spent: 0,
    color: String(payload.color || (existing && existing.object.color) || "#2f755f"),
    rollover: number_(payload.rollover || (existing && existing.object.rollover) || 0),
    created_at: existing ? existing.object.created_at : nowIso_(),
    updated_at: nowIso_(),
  };
  upsertObject_("Budgets", "id", row);
  audit_(existing ? "update" : "create", "budget", row.id, existing ? existing.object : null, row, device);
  return row;
}

function settleRecurring_(recurringId, device) {
  const existing = requireObject_("RecurringRules", "id", recurringId);
  const after = { ...existing.object, status: "settled", updated_at: nowIso_() };
  writeObjectAt_("RecurringRules", existing.rowIndex, after);
  audit_("settle", "recurring", recurringId, existing.object, after, device);
  return after;
}

function upsertRecurring_(payload, device) {
  const id = safeId_(payload.id || id_("rec"));
  const existing = findObject_("RecurringRules", "id", id);
  const row = {
    id,
    name: sanitizeText_(payload.name || "Upcoming obligation", 140),
    category: sanitizeText_(payload.category || "Unplanned", 100),
    amount: Math.abs(number_(payload.amount)),
    due_date: String(payload.dueDate || payload.due_date || ""),
    account_id: String(payload.accountId || payload.account_id || ""),
    cadence: String(payload.cadence || "monthly"),
    status: String(payload.status || "upcoming"),
    certainty: String(payload.certainty || "exact"),
    amount_tolerance: number_(payload.amountTolerance || payload.amount_tolerance || 0),
    active: true,
    created_at: existing ? existing.object.created_at : nowIso_(),
    updated_at: nowIso_(),
  };
  if (!row.due_date) throw new Error("Recurring due date is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) throw new Error("Recurring due date must be YYYY-MM-DD");
  if (!row.account_id) throw new Error("Recurring source account is required");
  requireObject_("Accounts", "id", row.account_id);
  upsertObject_("RecurringRules", "id", row);
  audit_(existing ? "update" : "create", "recurring", id, existing ? existing.object : null, row, device);
  return row;
}

function upsertAccount_(payload, device) {
  const id = safeId_(payload.id || id_("acc"));
  const existing = findObject_("Accounts", "id", id);
  const row = {
    id,
    name: sanitizeText_(payload.name || "Account", 120),
    institution: sanitizeText_(payload.institution || "Manual", 120),
    type: String(payload.type || "bank"),
    last4: sanitizeText_(payload.last4 || "", 4),
    opening_balance: number_(payload.openingBalance || payload.opening_balance || 0),
    balance: existing ? number_(existing.object.balance) : number_(payload.openingBalance || 0),
    reported_balance: payload.reportedBalance === undefined ? "" : number_(payload.reportedBalance),
    limit: payload.limit === undefined ? "" : number_(payload.limit),
    color: String(payload.color || "#2f755f"),
    active: true,
    last_reconciled_at: existing ? existing.object.last_reconciled_at : "",
    created_at: existing ? existing.object.created_at : nowIso_(),
    updated_at: nowIso_(),
  };
  upsertObject_("Accounts", "id", row);
  recalculateAccountBalances_(false);
  audit_(existing ? "update" : "create", "account", id, existing ? existing.object : null, row, device);
  return row;
}

function reconcileAccount_(payload, device) {
  const accountId = String(payload.accountId || payload.account_id || "");
  const reported = number_(payload.reportedBalance || payload.reported_balance);
  const account = requireObject_("Accounts", "id", accountId);
  recalculateAccountBalances_(false);
  const refreshed = requireObject_("Accounts", "id", accountId);
  const calculated = number_(refreshed.object.balance);
  const difference = reported - calculated;
  let adjustmentId = "";

  if (Math.abs(difference) > 0.005) {
    adjustmentId = id_("recon_txn");
    upsertTransaction_({
      id: adjustmentId,
      date: nowIso_(),
      merchant: "Balance adjustment",
      note: "Created by account reconciliation",
      category: "Balance adjustment",
      amount: difference,
      accountId,
      source: "manual",
      status: "confirmed",
      kind: difference >= 0 ? "income" : "expense",
    }, device);
  }

  const after = {
    ...requireObject_("Accounts", "id", accountId).object,
    reported_balance: reported,
    balance: reported,
    last_reconciled_at: nowIso_(),
    updated_at: nowIso_(),
  };
  writeObjectAt_("Accounts", account.rowIndex, after);
  appendObject_("BalanceSnapshots", {
    id: id_("balance"),
    account_id: accountId,
    balance: reported,
    as_of: nowIso_(),
    source: "reconciliation",
    created_at: nowIso_(),
  });
  appendObject_("Reconciliations", {
    id: id_("recon"),
    account_id: accountId,
    calculated_balance: calculated,
    reported_balance: reported,
    difference,
    adjustment_transaction_id: adjustmentId,
    reconciled_at: nowIso_(),
  });
  audit_("reconcile", "account", accountId, account.object, after, device);
  return after;
}

function replacePostingsForTransaction_(transaction) {
  softDeleteWhere_("Postings", "transaction_id", transaction.id);
  const amount = number_(transaction.amount);
  const postings = [{
    id: id_("post"),
    transaction_id: transaction.id,
    account_id: transaction.account_id,
    amount,
    currency: FINANCEOS_CURRENCY,
    role: "primary",
    created_at: nowIso_(),
    deleted_at: "",
  }];

  if (transaction.destination_account_id) {
    postings.push({
      id: id_("post"),
      transaction_id: transaction.id,
      account_id: transaction.destination_account_id,
      amount: -amount,
      currency: FINANCEOS_CURRENCY,
      role: "destination",
      created_at: nowIso_(),
      deleted_at: "",
    });
  } else {
    postings.push({
      id: id_("post"),
      transaction_id: transaction.id,
      account_id: `${transaction.kind}:${transaction.category}`,
      amount: -amount,
      currency: FINANCEOS_CURRENCY,
      role: "counterparty",
      created_at: nowIso_(),
      deleted_at: "",
    });
  }
  postings.forEach((posting) => appendObject_("Postings", posting));
}

function recalculateAccountBalances() {
  ensureInstalled_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const result = recalculateAccountBalances_(true);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `${result.updated} balances recalculated.`,
      "FinanceOS",
      5,
    );
    return result;
  } finally {
    lock.releaseLock();
  }
}

function recalculateAccountBalances_(writeAudit) {
  const accounts = readObjects_("Accounts");
  const postings = readObjects_("Postings").filter((row) => !row.deleted_at);
  const totals = {};
  postings.forEach((posting) => {
    totals[String(posting.account_id)] = (totals[String(posting.account_id)] || 0) + number_(posting.amount);
  });
  let updated = 0;
  accounts.forEach((account, index) => {
    if (!truthy_(account.active)) return;
    const balance = number_(account.opening_balance) + (totals[String(account.id)] || 0);
    if (Math.abs(number_(account.balance) - balance) > 0.005) {
      writeObjectAt_("Accounts", index + 2, { ...account, balance, updated_at: nowIso_() });
      updated += 1;
    }
  });
  if (writeAudit) audit_("recalculate", "accounts", "all", null, { updated });
  return { updated };
}

function syncGmailAlerts() {
  ensureInstalled_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return syncGmailAlerts_();
  } finally {
    lock.releaseLock();
  }
}

function syncGmailAlerts_() {
  const query = getSetting_("gmail_query") || "label:FinanceOS newer_than:7d";
  const batchLimit = Math.min(500, Math.max(1, number_(getSetting_("parser_batch_limit") || 100)));
  const rules = readObjects_("ParserRules").filter((row) => truthy_(row.enabled) && row.source === "gmail");
  if (!rules.length) return { scanned: 0, staged: 0, skipped: 0, failed: 0, message: "No enabled Gmail parser rules" };

  const knownSourceIds = new Set(readObjects_("IngestEvents").map((row) => String(row.source_event_id)));
  const threads = GmailApp.search(query, 0, batchLimit);
  const messages = [];
  threads.forEach((thread) => thread.getMessages().forEach((message) => messages.push(message)));

  const result = { scanned: 0, staged: 0, skipped: 0, failed: 0 };
  messages.sort((a, b) => a.getDate().getTime() - b.getDate().getTime());
  messages.slice(0, batchLimit).forEach((message) => {
    const sourceEventId = message.getId();
    if (knownSourceIds.has(sourceEventId)) {
      result.skipped += 1;
      return;
    }
    result.scanned += 1;
    const subject = message.getSubject() || "";
    const sender = message.getFrom() || "";
    const body = message.getPlainBody() || "";
    const rawHash = sha256Hex_(`${sender}\n${subject}\n${body}`);
    let rule = null;
    let parsed = null;
    let error = "";
    try {
      rule = rules.find((candidate) =>
        safeTest_(candidate.sender_pattern, sender) &&
        safeTest_(candidate.subject_pattern, subject) &&
        safeTest_(candidate.body_regex, body),
      );
      if (!rule) throw new Error("No parser rule matched");
      parsed = parseMessageWithRule_(rule, body);
      const account = findAccountByLast4_(parsed.last4);
      if (!account) throw new Error(`No account registered for last4 ${parsed.last4 || "(missing)"}`);

      const amount = rule.direction === "credit" ? Math.abs(parsed.amount) : -Math.abs(parsed.amount);
      const date = message.getDate().toISOString();
      const duplicateCandidate = findPossibleDuplicate_(account.id, amount, date);
      const transactionId = id_("txn");
      upsertTransaction_({
        id: transactionId,
        date,
        merchant: parsed.merchant || subject.slice(0, 100) || "Imported transaction",
        note: `Parsed by ${rule.bank_name} rule v${rule.version}`,
        category: parsed.category || "Uncategorized",
        amount,
        accountId: account.id,
        source: "gmail",
        status: duplicateCandidate ? "duplicate_candidate" : "needs_review",
        kind: amount >= 0 ? "income" : "expense",
        sourceEventId,
      }, { id: "gmail_trigger", name: "Gmail trigger" });

      appendObject_("IngestEvents", {
        id: id_("ingest"),
        source: "gmail",
        source_event_id: sourceEventId,
        received_at: message.getDate().toISOString(),
        raw_hash: rawHash,
        parser_rule_id: rule.id,
        parse_status: duplicateCandidate ? "duplicate_candidate" : "staged",
        transaction_id: transactionId,
        duplicate_candidate_of: duplicateCandidate || "",
        error: "",
        raw_excerpt: redactExcerpt_(body),
      });
      result.staged += 1;
    } catch (caught) {
      error = caught && caught.message ? caught.message : String(caught);
      appendObject_("IngestEvents", {
        id: id_("ingest"),
        source: "gmail",
        source_event_id: sourceEventId,
        received_at: message.getDate().toISOString(),
        raw_hash: rawHash,
        parser_rule_id: rule ? rule.id : "",
        parse_status: "failed",
        transaction_id: "",
        duplicate_candidate_of: "",
        error,
        raw_excerpt: redactExcerpt_(body),
      });
      result.failed += 1;
    }
  });
  audit_("gmail_sync", "ingestion", nowIso_(), null, result, { id: "gmail_trigger", name: "Gmail trigger" });
  return result;
}

function parseMessageWithRule_(rule, body) {
  const expression = new RegExp(String(rule.body_regex), "i");
  const match = String(body).match(expression);
  if (!match) throw new Error("Parser rule stopped matching this message");
  let fieldMap;
  try {
    fieldMap = JSON.parse(String(rule.field_map_json));
  } catch {
    throw new Error("Parser field_map_json is invalid JSON");
  }
  const rawAmount = match[number_(fieldMap.amount)] || "";
  const amount = Number(String(rawAmount).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Parser did not produce a valid amount");
  return {
    amount,
    merchant: sanitizeText_(match[number_(fieldMap.merchant)] || "", 180),
    last4: sanitizeText_(match[number_(fieldMap.last4)] || "", 4),
    category: sanitizeText_(fieldMap.category || "Uncategorized", 100),
  };
}

function findPossibleDuplicate_(accountId, amount, date) {
  const target = new Date(date).getTime();
  const transactions = readObjects_("Transactions").filter((row) => !row.deleted_at);
  const candidate = transactions.find((row) =>
    String(row.account_id) === String(accountId) &&
    Math.abs(number_(row.amount) - amount) < 0.005 &&
    Math.abs(new Date(row.date).getTime() - target) <= 10 * 60 * 1000,
  );
  return candidate ? String(candidate.id) : "";
}

function seedFinanceOSDemo() {
  ensureInstalled_();
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "Seed demo workspace?",
    "This adds clearly labelled sample accounts, budgets and obligations. It does not delete existing data.",
    ui.ButtonSet.YES_NO,
  );
  if (response !== ui.Button.YES) return;

  const now = nowIso_();
  const accounts = [
    { id: "acc_demo_hdfc", name: "Salary account", institution: "HDFC Bank", type: "bank", last4: "4821", opening_balance: 124860, balance: 124860, reported_balance: 124860, limit: "", color: "#1f6b55", active: true, last_reconciled_at: now, created_at: now, updated_at: now },
    { id: "acc_demo_sbi", name: "Rainy day", institution: "SBI", type: "bank", last4: "1904", opening_balance: 72440, balance: 72440, reported_balance: 72440, limit: "", color: "#326f9f", active: true, last_reconciled_at: now, created_at: now, updated_at: now },
    { id: "acc_demo_card", name: "Atlas", institution: "Axis Bank", type: "credit", last4: "7739", opening_balance: -28630, balance: -28630, reported_balance: -28630, limit: 250000, color: "#a34848", active: true, last_reconciled_at: now, created_at: now, updated_at: now },
  ];
  accounts.forEach((account) => upsertObject_("Accounts", "id", account));

  const budgets = [
    { id: "bud_demo_rent", name: "Rent", group: "fixed", cap: 28000, spent: 0, color: "#7d765b", rollover: 0, created_at: now, updated_at: now },
    { id: "bud_demo_grocery", name: "Groceries", group: "flex", cap: 12000, spent: 0, color: "#4e8069", rollover: 0, created_at: now, updated_at: now },
    { id: "bud_demo_transport", name: "Transport", group: "flex", cap: 6500, spent: 0, color: "#557d9e", rollover: 0, created_at: now, updated_at: now },
  ];
  budgets.forEach((budget) => upsertObject_("Budgets", "id", budget));

  const recurring = [
    { id: "rec_demo_rent", name: "September rent", category: "Rent", amount: 28000, due_date: "2026-09-03", account_id: "acc_demo_hdfc", cadence: "monthly", status: "upcoming", certainty: "exact", amount_tolerance: 0, active: true, created_at: now, updated_at: now },
    { id: "rec_demo_card", name: "Atlas card bill", category: "Credit card", amount: 14480, due_date: "2026-09-06", account_id: "acc_demo_hdfc", cadence: "monthly", status: "upcoming", certainty: "exact", amount_tolerance: 0, active: true, created_at: now, updated_at: now },
  ];
  recurring.forEach((item) => upsertObject_("RecurringRules", "id", item));
  audit_("seed_demo", "workbook", SpreadsheetApp.getActiveSpreadsheet().getId(), null, { accounts: accounts.length, budgets: budgets.length, recurring: recurring.length });
  SpreadsheetApp.getActiveSpreadsheet().toast("Demo rows added.", "FinanceOS", 5);
}

function seedParserRuleTemplates_() {
  const now = nowIso_();
  const templates = [
    {
      id: "parser_template_hdfc_debit",
      bank_name: "HDFC template – edit before enabling",
      source: "gmail",
      sender_pattern: "alerts@.*hdfcbank.*",
      subject_pattern: "debit|transaction|spent",
      body_regex: "(?:INR|Rs\\.?|₹)\\s*([0-9,]+(?:\\.[0-9]{1,2})?).*?(?:at|to)\\s+([^\\n.]+).*?(?:ending|card|a/c|account)[^0-9]*([0-9]{4})",
      field_map_json: JSON.stringify({ amount: 1, merchant: 2, last4: 3, category: "Uncategorized" }),
      direction: "debit",
      enabled: false,
      version: 1,
      updated_at: now,
    },
    {
      id: "parser_template_axis_debit",
      bank_name: "Axis template – edit before enabling",
      source: "gmail",
      sender_pattern: "alerts@.*axisbank.*",
      subject_pattern: "spent|transaction|debit",
      body_regex: "(?:INR|Rs\\.?|₹)\\s*([0-9,]+(?:\\.[0-9]{1,2})?).*?(?:at|to)\\s+([^\\n.]+).*?(?:ending|card|a/c|account)[^0-9]*([0-9]{4})",
      field_map_json: JSON.stringify({ amount: 1, merchant: 2, last4: 3, category: "Uncategorized" }),
      direction: "debit",
      enabled: false,
      version: 1,
      updated_at: now,
    },
  ];
  templates.forEach((template) => {
    if (!findObject_("ParserRules", "id", template.id)) appendObject_("ParserRules", template);
  });
}

function showFinanceOSHealth() {
  ensureInstalled_();
  const health = getSystemHealth_();
  SpreadsheetApp.getUi().alert(
    "FinanceOS health",
    [
      `Schema: ${health.schemaVersion}`,
      `Active device tokens: ${health.activeDeviceTokens}`,
      `Gmail sync trigger: ${health.gmailTriggerInstalled ? "installed" : "not installed"}`,
      `Transactions: ${health.transactions}`,
      `Needs review: ${health.needsReview}`,
      `Failed ingestions: ${health.failedIngestions}`,
      `Last audit event: ${health.lastAuditAt || "none"}`,
    ].join("\n"),
    SpreadsheetApp.getUi().ButtonSet.OK,
  );
  return health;
}

function getSystemHealth_() {
  const tokens = readObjects_("DeviceTokens");
  const transactions = readObjects_("Transactions").filter((row) => !row.deleted_at);
  const ingests = readObjects_("IngestEvents");
  const audits = readObjects_("AuditLog");
  return {
    ok: true,
    schemaVersion: FINANCEOS_SCHEMA_VERSION,
    activeDeviceTokens: tokens.filter((row) => !row.revoked_at).length,
    gmailTriggerInstalled: ScriptApp.getProjectTriggers().some((trigger) => trigger.getHandlerFunction() === "syncGmailAlerts"),
    accounts: readObjects_("Accounts").filter((row) => truthy_(row.active)).length,
    transactions: transactions.length,
    needsReview: transactions.filter((row) => row.status === "needs_review" || row.status === "duplicate_candidate").length,
    failedIngestions: ingests.filter((row) => row.parse_status === "failed").length,
    lastAuditAt: audits.length ? audits[audits.length - 1].timestamp : "",
    generatedAt: nowIso_(),
  };
}

function parseRequest_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Request body is required");
  }
  if (event.postData.contents.length > 100000) throw new Error("Request body is too large");
  try {
    return JSON.parse(event.postData.contents);
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

function authenticateDevice_(token) {
  if (!token || String(token).length < 40) throw new Error("Device token is missing or invalid");
  const tokenHash = sha256Hex_(String(token));
  const match = readObjects_("DeviceTokens").find((row) => !row.revoked_at && String(row.token_hash) === tokenHash);
  if (!match) throw new Error("Device token is invalid or revoked");
  const located = requireObject_("DeviceTokens", "id", match.id);
  writeObjectAt_("DeviceTokens", located.rowIndex, { ...located.object, last_used_at: nowIso_() });
  return { id: String(match.id), name: String(match.name || "Device") };
}

function ensureInstalled_() {
  const workbook = SpreadsheetApp.getActiveSpreadsheet();
  if (!workbook.getSheetByName("Setup") || !workbook.getSheetByName("Transactions")) {
    throw new Error("FinanceOS is not installed. Run setupFinanceOS() in the Sheet first.");
  }
  const version = findObject_("Setup", "key", "schema_version");
  if (!version || number_(version.object.value) !== FINANCEOS_SCHEMA_VERSION) {
    throw new Error("FinanceOS schema is out of date. Run setupFinanceOS() to repair it.");
  }
}

function ensureTable_(workbook, name, headers) {
  let sheet = workbook.getSheetByName(name);
  if (!sheet) sheet = workbook.insertSheet(name);
  const currentHeaders = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    : [];
  headers.forEach((header, index) => {
    if (currentHeaders[index] !== header) sheet.getRange(1, index + 1).setValue(header);
  });
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#173f34")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  sheet.autoResizeColumns(1, Math.min(headers.length, 8));
  return sheet;
}

function table_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error(`Missing Sheet tab: ${name}`);
  return sheet;
}

function headers_(name) {
  return TABLES[name];
}

function readObjects_(name) {
  const sheet = table_(name);
  const headers = headers_(name);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => objectFromRow_(headers, row));
}

function objectFromRow_(headers, row) {
  const object = {};
  headers.forEach((header, index) => { object[header] = row[index]; });
  return object;
}

function rowFromObject_(headers, object) {
  return headers.map((header) => object[header] === undefined ? "" : object[header]);
}

function appendObject_(name, object) {
  const sheet = table_(name);
  const headers = headers_(name);
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length).setValues([rowFromObject_(headers, object)]);
}

function writeObjectAt_(name, rowIndex, object) {
  const headers = headers_(name);
  table_(name).getRange(rowIndex, 1, 1, headers.length).setValues([rowFromObject_(headers, object)]);
}

function findObject_(name, key, value) {
  const objects = readObjects_(name);
  const index = objects.findIndex((object) => String(object[key]) === String(value));
  return index < 0 ? null : { object: objects[index], rowIndex: index + 2 };
}

function requireObject_(name, key, value) {
  const found = findObject_(name, key, value);
  if (!found) throw new Error(`${name} record not found: ${value}`);
  return found;
}

function upsertObject_(name, key, object) {
  const existing = findObject_(name, key, object[key]);
  if (existing) writeObjectAt_(name, existing.rowIndex, { ...existing.object, ...object });
  else appendObject_(name, object);
}

function softDeleteWhere_(name, key, value) {
  if (!headers_(name).includes("deleted_at")) throw new Error(`${name} does not support soft deletion`);
  const sheet = table_(name);
  const headers = headers_(name);
  const rows = readObjects_(name);
  rows.forEach((row, index) => {
    if (String(row[key]) === String(value) && !row.deleted_at) {
      writeObjectAt_(name, index + 2, { ...row, deleted_at: nowIso_() });
    }
  });
}

function getSetting_(key) {
  const setting = findObject_("Settings", "key", key);
  return setting ? String(setting.object.value) : "";
}

function setSetting_(key, value) {
  upsertObject_("Settings", "key", { key, value, updated_at: nowIso_() });
}

function findAccountByLast4_(last4) {
  if (!last4) return null;
  return readObjects_("Accounts").find((account) => truthy_(account.active) && String(account.last4) === String(last4)) || null;
}

function calculateCategorySpend_(category) {
  const currentMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  return Math.abs(readObjects_("Transactions")
    .filter((row) => {
      const rowDate = new Date(row.date);
      return !row.deleted_at &&
        String(row.category) === category &&
        String(row.kind) !== "transfer" &&
        number_(row.amount) < 0 &&
        !Number.isNaN(rowDate.getTime()) &&
        Utilities.formatDate(rowDate, Session.getScriptTimeZone(), "yyyy-MM") === currentMonth;
    })
    .reduce((sum, row) => sum + number_(row.amount), 0));
}

function validateTransaction_(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Transaction payload is required");
  if (!payload.merchant || String(payload.merchant).trim().length < 1) throw new Error("Merchant is required");
  if (!Number.isFinite(Number(payload.amount))) throw new Error("Transaction amount is invalid");
  const accountId = payload.accountId || payload.account_id;
  if (!accountId) throw new Error("Account is required");
  requireObject_("Accounts", "id", accountId);
  const kind = String(payload.kind || (number_(payload.amount) >= 0 ? "income" : "expense"));
  if (!["expense", "income", "transfer", "investment", "refund"].includes(kind)) {
    throw new Error("Transaction kind is invalid");
  }
  const source = String(payload.source || "manual");
  if (!["gmail", "sms", "manual", "import"].includes(source)) {
    throw new Error("Transaction source is invalid");
  }
  const status = String(payload.status || "confirmed");
  if (!["confirmed", "needs_review", "pending", "duplicate_candidate"].includes(status)) {
    throw new Error("Transaction status is invalid");
  }
  const destinationId = payload.destinationAccountId || payload.destination_account_id;
  if ((kind === "transfer" || kind === "investment") && !destinationId) {
    throw new Error("Transfers and investments require a destination account");
  }
  if (destinationId) {
    if (String(destinationId) === String(accountId)) throw new Error("Source and destination accounts must differ");
    requireObject_("Accounts", "id", destinationId);
  }
}

function audit_(action, entityType, entityId, before, after, device) {
  appendObject_("AuditLog", {
    id: id_("audit"),
    timestamp: nowIso_(),
    actor: device ? `${device.name} (${device.id})` : Session.getEffectiveUser().getEmail() || "sheet_owner",
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_json: before ? safeJson_(before) : "",
    after_json: after ? safeJson_(after) : "",
  });
}

function safeTest_(pattern, value) {
  if (!pattern) return true;
  if (String(pattern).length > 1000) throw new Error("Parser pattern is too long");
  return new RegExp(String(pattern), "i").test(String(value));
}

function redactExcerpt_(body) {
  return sanitizeText_(String(body)
    .replace(/\b\d{6}\b/g, "[REDACTED]")
    .replace(/\b\d{12,19}\b/g, "[REDACTED]")
    .slice(0, 500), 500);
}

function sanitizeText_(value, maxLength) {
  const clean = String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength);
  return /^[=+\-@]/.test(clean) ? `'${clean}` : clean;
}

function safeId_(value) {
  const id = String(value || "");
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(id)) throw new Error("Record id is invalid");
  return id;
}

function sha256Hex_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8)
    .map((byte) => ((byte + 256) % 256).toString(16).padStart(2, "0"))
    .join("");
}

function id_(prefix) {
  return `${prefix}_${Utilities.getUuid().replace(/-/g, "").slice(0, 20)}`;
}

function nowIso_() {
  return new Date().toISOString();
}

function number_(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function truthy_(value) {
  return value === true || value === 1 || String(value).toLowerCase() === "true" || String(value).toLowerCase() === "yes";
}

function safeJson_(value) {
  const json = JSON.stringify(value);
  return json.length > 45000 ? `${json.slice(0, 45000)}…` : json;
}

function relativeFreshness_(value) {
  const milliseconds = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "Just now";
  const minutes = Math.floor(milliseconds / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
