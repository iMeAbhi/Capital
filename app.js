(function () {
  "use strict";

  var SNAPSHOT_KEY = "financeos.snapshot.v1";
  var CONFIG_KEY = "financeos.connection.v1";
  var THEME_KEY = "financeos.theme";
  var ACCENT_KEY = "financeos.accent";
  var PIN_KEY = "financeos.pin.v1";

  var NAV = [
    { key: "overview", label: "Overview", icon: "overview" },
    { key: "activity", label: "Activity", icon: "activity" },
    { key: "plan", label: "Plan", icon: "plan" },
    { key: "accounts", label: "Accounts", icon: "accounts" },
    { key: "upcoming", label: "Upcoming", icon: "upcoming" },
    { key: "settings", label: "Settings", icon: "settings" }
  ];

  var CATEGORIES = [
    "Groceries", "Dining out", "Transport", "Shopping", "Utilities", "Rent",
    "Salary", "Investments", "Travel", "Subscriptions", "Insurance",
    "Transfers", "Unplanned"
  ];

  var DEMO = {
    schemaVersion: 1,
    generatedAt: "2026-09-01T10:32:00+05:30",
    accounts: [
      { id: "acc_hdfc", name: "Salary account", institution: "HDFC Bank", type: "bank", last4: "4821", balance: 124860, reportedBalance: 124860, color: "#1f6b55", freshness: "2 min ago", reconciledAt: "31 Aug 2026" },
      { id: "acc_sbi", name: "Rainy day", institution: "SBI", type: "bank", last4: "1904", balance: 72440, reportedBalance: 72440, color: "#326f9f", freshness: "18 min ago", reconciledAt: "31 Aug 2026" },
      { id: "acc_cash", name: "Cash wallet", institution: "Manual", type: "cash", balance: 4250, color: "#96752f", freshness: "Yesterday", reconciledAt: "29 Aug 2026" },
      { id: "acc_atlas", name: "Atlas", institution: "Axis Bank", type: "credit", last4: "7739", balance: -28630, reportedBalance: -28630, limit: 250000, color: "#a34848", freshness: "6 min ago", reconciledAt: "31 Aug 2026" },
      { id: "acc_millennia", name: "Millennia", institution: "HDFC Bank", type: "credit", last4: "1126", balance: -8420, reportedBalance: -8420, limit: 100000, color: "#794f88", freshness: "22 min ago", reconciledAt: "31 Aug 2026" },
      { id: "acc_zerodha", name: "Long-term portfolio", institution: "Zerodha", type: "investment", balance: 486320, color: "#467b70", freshness: "Yesterday close" },
      { id: "acc_epf", name: "EPF", institution: "EPFO", type: "investment", balance: 312900, color: "#687499", freshness: "31 Jul 2026" }
    ],
    transactions: [
      { id: "txn_salary_sep", date: "2026-09-01T08:42:00+05:30", merchant: "Acme Technologies", note: "September salary", category: "Salary", amount: 165000, accountId: "acc_hdfc", source: "gmail", status: "confirmed", kind: "income", sourceEventId: "gmail_demo_salary_sep" },
      { id: "txn_blinkit", date: "2026-09-01T07:36:00+05:30", merchant: "Blinkit", category: "Groceries", amount: -1450, accountId: "acc_atlas", source: "gmail", status: "needs_review", kind: "expense", sourceEventId: "gmail_demo_blinkit" },
      { id: "txn_rapido", date: "2026-08-31T20:14:00+05:30", merchant: "Rapido", category: "Transport", amount: -286, accountId: "acc_hdfc", source: "sms", status: "needs_review", kind: "expense", sourceEventId: "sms_demo_rapido" },
      { id: "txn_zomato", date: "2026-08-31T19:48:00+05:30", merchant: "Zomato", category: "Dining out", amount: -780, accountId: "acc_atlas", source: "gmail", status: "confirmed", kind: "expense" },
      { id: "txn_milk", date: "2026-08-31T07:21:00+05:30", merchant: "Anand Dairy", category: "Groceries", amount: -220, accountId: "acc_hdfc", source: "sms", status: "confirmed", kind: "expense" },
      { id: "txn_sip", date: "2026-08-29T10:00:00+05:30", merchant: "UTI Nifty 50 Index Fund", note: "Monthly SIP", category: "Investments", amount: -15000, accountId: "acc_hdfc", destinationAccountId: "acc_zerodha", source: "gmail", status: "confirmed", kind: "investment" },
      { id: "txn_amazon", date: "2026-08-28T16:05:00+05:30", merchant: "Amazon India", category: "Shopping", amount: -3299, accountId: "acc_millennia", source: "gmail", status: "confirmed", kind: "expense" },
      { id: "txn_airtel", date: "2026-08-27T12:16:00+05:30", merchant: "Airtel", category: "Utilities", amount: -799, accountId: "acc_hdfc", source: "sms", status: "confirmed", kind: "expense" },
      { id: "txn_refund", date: "2026-08-26T14:35:00+05:30", merchant: "MakeMyTrip", note: "Flight fare adjustment", category: "Travel", amount: 1850, accountId: "acc_atlas", source: "gmail", status: "confirmed", kind: "refund" },
      { id: "txn_rent_aug", date: "2026-08-03T09:02:00+05:30", merchant: "House rent", category: "Rent", amount: -28000, accountId: "acc_hdfc", source: "manual", status: "confirmed", kind: "expense" }
    ],
    budgets: [
      { id: "bud_rent", name: "Rent", group: "fixed", cap: 28000, spent: 28000, color: "#7d765b" },
      { id: "bud_grocery", name: "Groceries", group: "flex", cap: 12000, spent: 6380, color: "#4e8069" },
      { id: "bud_dining", name: "Dining out", group: "flex", cap: 7000, spent: 5240, color: "#ce765e" },
      { id: "bud_transport", name: "Transport", group: "flex", cap: 6500, spent: 3190, color: "#557d9e" },
      { id: "bud_shopping", name: "Shopping", group: "flex", cap: 9000, spent: 6710, color: "#8d6b96" },
      { id: "bud_utilities", name: "Utilities", group: "fixed", cap: 4500, spent: 2410, color: "#968045" },
      { id: "bud_travel", name: "Travel fund", group: "future", cap: 15000, spent: 7500, rollover: 12000, color: "#497b7a" },
      { id: "bud_buffer", name: "Unplanned", group: "future", cap: 10000, spent: 2500, color: "#7b7b80" }
    ],
    recurring: [
      { id: "rec_rent", name: "September rent", category: "Rent", amount: 28000, dueDate: "2026-09-03", accountId: "acc_hdfc", cadence: "monthly", status: "upcoming", certainty: "exact" },
      { id: "rec_atlas", name: "Atlas card bill", category: "Credit card", amount: 14480, dueDate: "2026-09-06", accountId: "acc_hdfc", cadence: "monthly", status: "upcoming", certainty: "exact" },
      { id: "rec_sip", name: "Nifty 50 SIP", category: "Investments", amount: 15000, dueDate: "2026-09-08", accountId: "acc_hdfc", cadence: "monthly", status: "upcoming", certainty: "exact" },
      { id: "rec_internet", name: "ACT broadband", category: "Utilities", amount: 999, dueDate: "2026-09-11", accountId: "acc_hdfc", cadence: "monthly", status: "upcoming", certainty: "estimated" },
      { id: "rec_millennia", name: "Millennia card bill", category: "Credit card", amount: 8420, dueDate: "2026-09-14", accountId: "acc_hdfc", cadence: "monthly", status: "upcoming", certainty: "exact" },
      { id: "rec_insurance", name: "Health insurance", category: "Insurance", amount: 7250, dueDate: "2026-09-18", accountId: "acc_sbi", cadence: "yearly", status: "upcoming", certainty: "exact" },
      { id: "rec_netflix", name: "Netflix", category: "Subscriptions", amount: 649, dueDate: "2026-09-20", accountId: "acc_atlas", cadence: "monthly", status: "upcoming", certainty: "exact" }
    ]
  };

  var TREND = [
    { month: "Oct", value: 716000 }, { month: "Nov", value: 735000 },
    { month: "Dec", value: 711000 }, { month: "Jan", value: 762000 },
    { month: "Feb", value: 788000 }, { month: "Mar", value: 806000 },
    { month: "Apr", value: 842000 }, { month: "May", value: 861000 },
    { month: "Jun", value: 887000 }, { month: "Jul", value: 914000 },
    { month: "Aug", value: 937000 }, { month: "Sep", value: 963720 }
  ];

  var state = {
    view: NAV.some(function (item) { return "#" + item.key === location.hash; }) ? location.hash.slice(1) : "overview",
    snapshot: clone(DEMO),
    theme: "light",
    accent: "green",
    connection: { endpoint: "", token: "", rememberDevice: false, offlineCache: true },
    sync: { mode: "demo", lastSync: "10:32 AM", message: "Demo workspace" },
    menuOpen: false,
    modal: null,
    editingId: null,
    activityQuery: "",
    activityFilter: "all",
    upcomingMode: "list",
    locked: false,
    toastTimer: null
  };

  var inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  var compactFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 });

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function inr(value) { return inrFormatter.format(Number(value) || 0); }
  function compactInr(value) { return compactFormatter.format(Number(value) || 0); }
  function signedInr(value) {
    value = Number(value) || 0;
    if (value === 0) return inr(0);
    return (value > 0 ? "+" : "−") + inr(Math.abs(value));
  }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function uid(prefix) { return prefix + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8); }
  function todayInIndia() { return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); }
  function initials(name) {
    return String(name).split(/\s+/).slice(0, 2).map(function (part) { return part.charAt(0); }).join("").toUpperCase();
  }
  function sourceLabel(source) { return { gmail: "Email", sms: "SMS", manual: "Manual", import: "Import" }[source] || "Manual"; }
  function relativeDate(value) {
    var date = new Date(value);
    var day = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
    var time = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(date);
    return day + " · " + time;
  }
  function daysUntil(date, from) {
    var startDate = from || todayInIndia();
    var start = new Date(startDate + "T00:00:00+05:30").getTime();
    var end = new Date(date + "T00:00:00+05:30").getTime();
    return Math.ceil((end - start) / 86400000);
  }
  function addCalendarMonth(date) {
    var parts = date.split("-").map(Number);
    var nextMonthIndex = parts[0] * 12 + parts[1];
    var nextYear = Math.floor(nextMonthIndex / 12);
    var nextMonth = nextMonthIndex % 12 + 1;
    var lastDay = new Date(Date.UTC(nextYear, nextMonth, 0)).getUTCDate();
    return nextYear + "-" + String(nextMonth).padStart(2, "0") + "-" + String(Math.min(parts[2], lastDay)).padStart(2, "0");
  }
  function nextSalaryCutoff(transactions) {
    var today = todayInIndia();
    var salary = transactions.filter(function (transaction) {
      return transaction.kind === "income" && transaction.amount > 0 && transaction.date.slice(0, 10) <= today;
    }).sort(function (a, b) { return b.date.localeCompare(a.date); })[0];
    var cutoff = addCalendarMonth(salary ? salary.date.slice(0, 10) : today);
    while (cutoff <= today) cutoff = addCalendarMonth(cutoff);
    return cutoff;
  }
  function liquidCash(accounts) {
    return accounts.filter(function (account) { return account.type === "bank" || account.type === "cash"; })
      .reduce(function (sum, account) { return sum + account.balance; }, 0);
  }
  function netWorth(accounts) { return accounts.reduce(function (sum, account) { return sum + account.balance; }, 0); }
  function utilization(account) { return account.type === "credit" && account.limit ? Math.round(Math.abs(account.balance) / account.limit * 100) : 0; }
  function monthFlow(transactions) {
    var month = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", timeZone: "Asia/Kolkata" });
    return transactions.filter(function (transaction) { return transaction.date.indexOf(month) === 0; }).reduce(function (total, transaction) {
      if (transaction.kind === "income" || transaction.kind === "refund") total.income += Math.max(0, transaction.amount);
      else if (transaction.kind === "investment") total.invested += Math.abs(transaction.amount);
      else if (transaction.kind === "expense") total.spent += Math.abs(transaction.amount);
      return total;
    }, { income: 0, spent: 0, invested: 0 });
  }
  function safeSpendLines() {
    var snapshot = state.snapshot;
    var liquid = liquidCash(snapshot.accounts);
    var cutoff = nextSalaryCutoff(snapshot.transactions);
    var obligationsList = snapshot.recurring.filter(function (item) { return item.status !== "settled" && item.dueDate <= cutoff; });
    var obligations = obligationsList.reduce(function (sum, item) { return sum + item.amount; }, 0);
    var flex = snapshot.budgets.filter(function (budget) { return budget.group === "flex"; })
      .reduce(function (sum, budget) { return sum + Math.max(0, budget.cap + (budget.rollover || 0) - budget.spent); }, 0);
    var future = snapshot.budgets.filter(function (budget) { return budget.group === "future"; })
      .reduce(function (sum, budget) { return sum + Math.max(0, budget.cap + (budget.rollover || 0) - budget.spent); }, 0);
    var buffer = Math.min(20000, Math.max(5000, Math.round(liquid * 0.1)));
    var uncertainty = Math.max(5000, Math.round(obligationsList.filter(function (item) { return item.certainty === "estimated"; })
      .reduce(function (sum, item) { return sum + item.amount; }, 0) * 0.25));
    return [
      { id: "liquid", label: "Liquid money", detail: "Bank accounts and cash", amount: liquid, tone: "positive" },
      { id: "bills", label: "Bills before next salary", detail: "Cards, EMIs and scheduled obligations", amount: -obligations, tone: "negative" },
      { id: "reserves", label: "Flexible budget still reserved", detail: "Unspent category allowances", amount: -flex, tone: "negative" },
      { id: "goals", label: "Goals and sinking funds", detail: "Future categories and rollovers", amount: -future, tone: "negative" },
      { id: "buffers", label: "Account minimums", detail: "Protected operating buffer", amount: -buffer, tone: "negative" },
      { id: "uncertainty", label: "Uncertainty reserve", detail: "Cushion for estimated or variable bills", amount: -uncertainty, tone: "negative" }
    ];
  }
  function safeSpend() { return Math.max(0, safeSpendLines().reduce(function (sum, line) { return sum + line.amount; }, 0)); }
  function reviewCount() {
    return state.snapshot.transactions.filter(function (transaction) {
      return transaction.status === "needs_review" || transaction.status === "duplicate_candidate";
    }).length;
  }
  function icon(name) {
    var icons = {
      "overview": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\"></rect><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"></rect></svg>",
      "activity": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M13 16H8\"></path><path d=\"M14 8H8\"></path><path d=\"M16 12H8\"></path><path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\"></path></svg>",
      "plan": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle></svg>",
      "accounts": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21\"></path><path d=\"M3 7h18\"></path><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect></svg>",
      "upcoming": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M16 14v2.2l1.6 1\"></path><path d=\"M16 2v3\"></path><path d=\"M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338\"></path><path d=\"M3 9h5.859\"></path><path d=\"M8 2v3\"></path><circle cx=\"16\" cy=\"16\" r=\"6\"></circle></svg>",
      "settings": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle></svg>",
      "shield": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path><path d=\"m9 12 2 2 4-4\"></path></svg>",
      "menu": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 5h16\"></path><path d=\"M4 12h16\"></path><path d=\"M4 19h16\"></path></svg>",
      "close": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path></svg>",
      "sync": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path></svg>",
      "wifi": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20h.01\"></path><path d=\"M2 8.82a15 15 0 0 1 20 0\"></path><path d=\"M5 12.859a10 10 0 0 1 14 0\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path></svg>",
      "moon": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"></path></svg>",
      "sun": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.93 4.93 1.41 1.41\"></path><path d=\"m17.66 17.66 1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.34 17.66-1.41 1.41\"></path><path d=\"m19.07 4.93-1.41 1.41\"></path></svg>",
      "bell": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10.268 21a2 2 0 0 0 3.464 0\"></path><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"></path></svg>",
      "plus": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path></svg>",
      "arrow": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14\"></path><path d=\"m12 5 7 7-7 7\"></path></svg>",
      "chevron": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m9 18 6-6-6-6\"></path></svg>",
      "info": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path></svg>",
      "trend": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M16 7h6v6\"></path><path d=\"m22 7-8.5 8.5-5-5L2 17\"></path></svg>",
      "more": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>",
      "sparkles": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"></path><path d=\"M20 2v4\"></path><path d=\"M22 4h-4\"></path><circle cx=\"4\" cy=\"20\" r=\"2\"></circle></svg>",
      "check": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 6 9 17l-5-5\"></path></svg>",
      "search": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m21 21-4.34-4.34\"></path><circle cx=\"11\" cy=\"11\" r=\"8\"></circle></svg>",
      "sliders": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 5H3\"></path><path d=\"M12 19H3\"></path><path d=\"M14 3v4\"></path><path d=\"M16 17v4\"></path><path d=\"M21 12h-9\"></path><path d=\"M21 19h-5\"></path><path d=\"M21 5h-7\"></path><path d=\"M8 10v4\"></path><path d=\"M8 12H3\"></path></svg>",
      "edit": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"></path><path d=\"m15 5 4 4\"></path></svg>",
      "trash": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 11v6\"></path><path d=\"M14 11v6\"></path><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"></path><path d=\"M3 6h18\"></path><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path></svg>",
      "target": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle></svg>",
      "down": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m7 7 10 10\"></path><path d=\"M17 7v10H7\"></path></svg>",
      "calendar": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M16 14v2.2l1.6 1\"></path><path d=\"M16 2v3\"></path><path d=\"M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338\"></path><path d=\"M3 9h5.859\"></path><path d=\"M8 2v3\"></path><circle cx=\"16\" cy=\"16\" r=\"6\"></circle></svg>",
      "bank": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 18v-7\"></path><path d=\"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z\"></path><path d=\"M14 18v-7\"></path><path d=\"M18 18v-7\"></path><path d=\"M3 22h18\"></path><path d=\"M6 18v-7\"></path></svg>",
      "card": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"></rect><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\"></line></svg>",
      "clock": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 6v6h4\"></path></svg>",
      "upload": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v12\"></path><path d=\"m17 8-5-5-5 5\"></path><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path></svg>",
      "download": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 15V3\"></path><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><path d=\"m7 10 5 5 5-5\"></path></svg>",
      "lock": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"16\" r=\"1\"></circle><rect x=\"3\" y=\"10\" width=\"18\" height=\"12\" rx=\"2\"></rect><path d=\"M7 10V7a5 5 0 0 1 10 0v3\"></path></svg>",
      "database": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"></ellipse><path d=\"M3 5V19A9 3 0 0 0 21 19V5\"></path><path d=\"M3 12A9 3 0 0 0 21 12\"></path></svg>",
      "fingerprint": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4\"></path><path d=\"M14 13.12c0 2.38 0 6.38-1 8.88\"></path><path d=\"M17.29 21.02c.12-.6.43-2.3.5-3.02\"></path><path d=\"M2 12a10 10 0 0 1 18-6\"></path><path d=\"M2 16h.01\"></path><path d=\"M21.8 16c.2-2 .131-5.354 0-6\"></path><path d=\"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2\"></path><path d=\"M8.65 22c.21-.66.45-1.32.57-2\"></path><path d=\"M9 6.8a6 6 0 0 1 9 5.2v2\"></path></svg>",
      "eye": "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle></svg>"
    };
    return icons[name] || icons.info;
  }
  function button(action, label, className, iconName, attrs) {
    return '<button class="' + (className || "text-button") + '" data-action="' + action + '" ' + (attrs || "") + ">" +
      (iconName ? icon(iconName) : "") + esc(label) + "</button>";
  }
  function pageHeading(eyebrow, title, copy, action) {
    return '<div class="page-heading"><div><span class="eyebrow">' + esc(eyebrow) + "</span><h1>" + esc(title) +
      "</h1><p>" + esc(copy) + "</p></div>" + (action || "") + "</div>";
  }
  function sectionHeader(title, detail, action) {
    return '<div class="section-header"><div><h2>' + esc(title) + "</h2>" + (detail ? "<p>" + esc(detail) + "</p>" : "") +
      "</div>" + (action || "") + "</div>";
  }
  function statCard(label, value, detail, iconName, tone) {
    return '<div class="stat-card panel-card"><div class="stat-icon ' + tone + '">' + icon(iconName) +
      '</div><div><span>' + esc(label) + "</span><strong>" + esc(value) + "</strong><small>" + esc(detail) + "</small></div></div>";
  }
  function options(values, selected) {
    return values.map(function (value) {
      var item = typeof value === "string" ? { value: value, label: value } : value;
      return '<option value="' + esc(item.value) + '"' + (item.value === selected ? " selected" : "") + ">" + esc(item.label) + "</option>";
    }).join("");
  }

  function loadState() {
    try {
      var storedTheme = localStorage.getItem(THEME_KEY);
      if (storedTheme === "dark" || storedTheme === "light") state.theme = storedTheme;
      state.accent = localStorage.getItem(ACCENT_KEY) || "green";
      var rawSnapshot = localStorage.getItem(SNAPSHOT_KEY);
      if (rawSnapshot) {
        var parsedSnapshot = JSON.parse(rawSnapshot);
        if (parsedSnapshot.accounts && parsedSnapshot.transactions && parsedSnapshot.budgets && parsedSnapshot.recurring) state.snapshot = parsedSnapshot;
      }
      var rawConfig = sessionStorage.getItem(CONFIG_KEY) || localStorage.getItem(CONFIG_KEY);
      if (rawConfig) {
        state.connection = JSON.parse(rawConfig);
        state.sync = {
          mode: navigator.onLine ? "connected" : "offline",
          lastSync: "Cached",
          message: navigator.onLine ? "Sheet connected" : "Offline snapshot"
        };
      }
      state.locked = Boolean(localStorage.getItem(PIN_KEY));
    } catch (error) {
      state.snapshot = clone(DEMO);
    }
    applyTheme();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.accent = state.accent;
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = state.theme === "dark" ? "#000000" : "#173f34";
  }
  function updateSnapshot(next) {
    next.generatedAt = new Date().toISOString();
    state.snapshot = next;
    if (state.connection.offlineCache) {
      try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next)); } catch (error) { showToast("Local storage is unavailable"); }
    }
  }

  function renderApp() {
    var count = reviewCount();
    var current = NAV.filter(function (item) { return item.key === state.view; })[0] || NAV[0];
    var nav = NAV.map(function (item) {
      return '<button data-action="navigate" data-view="' + item.key + '" class="' + (state.view === item.key ? "active" : "") + '">' +
        icon(item.icon) + "<span>" + esc(item.label) + "</span>" +
        (item.key === "activity" && count ? '<span class="nav-count">' + count + "</span>" : "") + "</button>";
    }).join("");
    var mobileNav = NAV.slice(0, 5).map(function (item) {
      return '<button data-action="navigate" data-view="' + item.key + '" class="' + (state.view === item.key ? "active" : "") + '">' +
        icon(item.icon) + "<span>" + esc(item.label) + "</span></button>";
    }).join("");
    var html = '<div class="finance-shell">' +
      '<aside class="sidebar ' + (state.menuOpen ? "is-open" : "") + '">' +
        '<div class="brand-row"><div class="brand-mark" aria-hidden="true">₹</div><div><strong>FinanceOS</strong><span>Your money, on purpose.</span></div>' +
        '<button class="icon-button sidebar-close" data-action="menu-close" aria-label="Close menu">' + icon("close") + "</button></div>" +
        '<nav class="primary-nav" aria-label="Main navigation"><span class="nav-eyebrow">Workspace</span>' + nav + "</nav>" +
        '<div class="sidebar-pulse"><div class="pulse-icon">' + icon("shield") + "</div><div><strong>" +
        (state.connection.endpoint ? "Private Sheet" : "Demo workspace") + "</strong><span>" +
        (state.connection.endpoint ? "Device authorised" : "Connect when ready") + '</span></div><span class="status-dot ' +
        (state.connection.endpoint ? "online" : "demo") + '"></span></div></aside>' +
      (state.menuOpen ? '<button class="sidebar-scrim" data-action="menu-close" aria-label="Close navigation"></button>' : "") +
      '<main class="main-panel"><header class="topbar">' +
        '<button class="icon-button menu-button" data-action="menu-open" aria-label="Open menu">' + icon("menu") + "</button>" +
        '<div class="topbar-title"><span>' + (state.view === "overview" ? esc(new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date())) : "FinanceOS") +
        "</span><strong>" + esc(current.label) + "</strong></div>" +
        '<div class="topbar-actions"><button class="sync-pill" data-action="sync" aria-label="Sync data">' +
          icon(state.sync.mode === "offline" ? "clock" : "wifi") + "<span>" + esc(state.sync.message) + "</span>" + icon("sync") + "</button>" +
          '<button class="icon-button" data-action="theme-toggle" aria-label="Use ' + (state.theme === "light" ? "dark" : "light") + ' theme">' + icon(state.theme === "light" ? "moon" : "sun") + "</button>" +
          '<button class="icon-button notification-button" data-action="review-queue" aria-label="Notifications">' + icon("bell") + (count ? "<span></span>" : "") + "</button>" +
          '<button class="avatar-button" data-action="settings" aria-label="Open settings">SA</button></div></header>' +
        '<div class="content-area">' + renderView() + "</div></main>" +
      '<nav class="mobile-nav" aria-label="Mobile navigation">' + mobileNav + "</nav></div>" +
      '<div id="overlay-root">' + renderOverlay() + "</div>" +
      '<div id="toast-root"></div>';
    document.getElementById("app").innerHTML = html;
    if (state.locked) document.getElementById("overlay-root").innerHTML = renderLock();
  }

  function renderView() {
    if (state.view === "activity") return renderActivity();
    if (state.view === "plan") return renderPlan();
    if (state.view === "accounts") return renderAccounts();
    if (state.view === "upcoming") return renderUpcoming();
    if (state.view === "settings") return renderSettings();
    return renderOverview();
  }

  function renderOverview() {
    var snapshot = state.snapshot;
    var safe = safeSpend();
    var worth = netWorth(snapshot.accounts);
    var flow = monthFlow(snapshot.transactions);
    var liquid = liquidCash(snapshot.accounts);
    var upcoming = snapshot.recurring.filter(function (item) { return item.status !== "settled"; });
    var review = snapshot.transactions.filter(function (item) { return item.status !== "confirmed"; });
    var min = Math.min.apply(null, TREND.map(function (point) { return point.value; }));
    var max = Math.max.apply(null, TREND.map(function (point) { return point.value; }));
    var bars = TREND.map(function (point) {
      var height = 28 + (point.value - min) / (max - min) * 72;
      return '<div class="worth-bar-wrap" title="' + esc(point.month + ": " + inr(point.value)) + '"><span class="worth-bar" style="height:' +
        height + '%"></span><small>' + point.month + "</small></div>";
    }).join("");
    var accountCards = snapshot.accounts.slice(0, 5).map(function (account) {
      return '<button class="mini-account-card" data-action="navigate" data-view="accounts"><span class="account-color" style="background:' + esc(account.color) +
        '"></span><div class="mini-account-top"><span>' + esc(account.institution) + "</span>" + icon("more") + "</div><strong>" +
        inr(account.type === "credit" ? Math.abs(account.balance) : account.balance) + '</strong><div class="mini-account-bottom"><span>' +
        esc(account.name + (account.last4 ? " · " + account.last4 : "")) + "</span><small>" +
        esc(account.type === "credit" ? utilization(account) + "% used" : account.freshness) + "</small></div></button>";
    }).join("");
    var coming = upcoming.slice(0, 4).map(function (item) {
      var month = new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(item.dueDate + "T00:00:00"));
      return '<div class="compact-row"><div class="date-tile"><strong>' + Number(item.dueDate.slice(-2)) + "</strong><span>" + esc(month) +
        "</span></div><div><strong>" + esc(item.name) + "</strong><span>" + esc(item.category + " · " + relativeDays(item.dueDate)) +
        "</span></div><strong>" + inr(item.amount) + "</strong></div>";
    }).join("");
    var reviewRows = review.slice(0, 3).map(function (transaction) {
      return '<div class="review-row"><div class="merchant-avatar">' + esc(initials(transaction.merchant)) + '</div><div class="review-copy"><strong>' +
        esc(transaction.merchant) + "</strong><span>" + esc(sourceLabel(transaction.source) + " · " + relativeDate(transaction.date)) +
        '</span></div><span class="category-pill">' + esc(transaction.category) + '</span><strong class="amount negative">' +
        signedInr(transaction.amount) + '</strong><button class="approve-button" data-action="approve-transaction" data-id="' + esc(transaction.id) +
        '">' + icon("check") + "Confirm</button></div>";
    }).join("");
    var allocated = Math.round((flow.spent + flow.invested) / Math.max(flow.income, 1) * 100);
    return '<div class="view-stack overview-view">' +
      pageHeading("Your command centre", "Good morning, Shivam.", "September is funded. Here’s what your money can do next.",
        button("add-transaction", "Add transaction", "primary-button", "plus")) +
      (state.sync.mode === "demo" ? '<div class="demo-banner"><div class="demo-icon">' + icon("sparkles") +
        '</div><div><strong>You’re exploring a private demo.</strong><span>Every interaction works locally. Connect your own Sheet when you’re ready.</span></div>' +
        '<button data-action="settings">Connect my data ' + icon("arrow") + "</button></div>" : "") +
      '<div class="hero-grid"><section class="safe-card"><div class="card-topline"><span class="card-kicker">' + icon("plan") +
        ' Safe to spend</span><button class="icon-button ghost" data-action="safe-spend" aria-label="Safe to spend information">' + icon("info") +
        '</button></div><div class="safe-number">' + inr(safe) +
        "</div><p>available until your next salary, after every known obligation and reserve.</p>" +
        '<div class="safe-meter" aria-label="Safe-to-spend confidence 87 percent"><span style="width:87%"></span></div>' +
        '<div class="safe-meta"><div><span>Confidence</span><strong>High · 87%</strong></div><div><span>Protected cash</span><strong>' +
        compactInr(liquid - safe) + '</strong></div></div><button class="text-button light" data-action="safe-spend">See exactly how it’s calculated ' +
        icon("chevron") + '</button></section><section class="networth-card panel-card"><div class="card-topline"><span class="card-kicker">Net worth</span>' +
        '<button class="chip-button">12 months ' + icon("chevron") + '</button></div><div class="networth-value-row"><div><strong>' + inr(worth) +
        '</strong><span>' + icon("trend") + " +" + inr(26720) + ' this month</span></div><div class="growth-pill">' + icon("trend") +
        ' 2.9%</div></div><div class="worth-chart" aria-label="Net worth trend over twelve months">' + bars + "</div></section></div>" +
      '<section>' + sectionHeader("Money at a glance", "Verified balances from your connected accounts",
        button("navigate", "All accounts", "text-button", "arrow", 'data-view="accounts"')) +
        '<div class="account-strip">' + accountCards + "</div></section>" +
      '<div class="flow-grid"><section class="panel-card cashflow-card">' + sectionHeader("This month’s flow", "Income, spending and future-you") +
        '<div class="flow-content"><div class="flow-donut" style="background:conic-gradient(var(--green) 0 62%,var(--coral) 62% 83%,var(--gold) 83% 100%)"><div><strong>' +
        allocated + '%</strong><span>allocated</span></div></div><div class="flow-legend"><div><span class="legend-dot green"></span><span>Income</span><strong>' +
        compactInr(flow.income) + '</strong></div><div><span class="legend-dot coral"></span><span>Spent</span><strong>' +
        compactInr(flow.spent) + '</strong></div><div><span class="legend-dot gold"></span><span>Invested</span><strong>' +
        compactInr(flow.invested) + "</strong></div></div></div></section>" +
        '<section class="panel-card upcoming-card">' + sectionHeader("Coming up", upcoming.slice(0, 4).length + " of " + upcoming.length + " obligations shown",
          button("navigate", "Calendar", "text-button", "arrow", 'data-view="upcoming"')) + '<div class="compact-list">' + coming + "</div></section></div>" +
      '<section class="panel-card review-card">' + sectionHeader("Needs your eyes", review.length ? review.length + " imported transactions need a quick check" : "Your review queue is clear",
        button("navigate", "Open activity", "text-button", "arrow", 'data-view="activity"')) +
        (review.length ? '<div class="review-list">' + reviewRows + "</div>" : '<div class="empty-state compact">' + icon("check") +
          "<div><strong>All caught up</strong><span>New imports will wait here for review.</span></div></div>") + "</section>" +
      '<button class="mobile-fab" data-action="add-transaction" aria-label="Add transaction">' + icon("plus") + "</button></div>";
  }

  function relativeDays(date) {
    var days = daysUntil(date);
    if (days === 0) return "today";
    if (days === 1) return "tomorrow";
    if (days > 1) return "in " + days + " days";
    return Math.abs(days) + " days ago";
  }

  function renderActivity() {
    var query = state.activityQuery.toLowerCase();
    var filtered = state.snapshot.transactions.filter(function (transaction) {
      var matchesQuery = (transaction.merchant + " " + transaction.category).toLowerCase().indexOf(query) !== -1;
      var filter = state.activityFilter;
      var matchesFilter = filter === "all" ||
        (filter === "review" && transaction.status !== "confirmed") ||
        (filter === "income" && (transaction.kind === "income" || transaction.kind === "refund")) ||
        (filter === "expense" && (transaction.kind === "expense" || transaction.kind === "investment"));
      return matchesQuery && matchesFilter;
    });
    var filters = ["all", "review", "income", "expense"].map(function (filter) {
      var label = filter === "review" ? "Needs review" : filter.charAt(0).toUpperCase() + filter.slice(1);
      return '<button data-action="activity-filter" data-filter="' + filter + '" class="' +
        (state.activityFilter === filter ? "active" : "") + '">' + label + "</button>";
    }).join("");
    var rows = filtered.map(function (transaction) {
      var account = state.snapshot.accounts.filter(function (item) { return item.id === transaction.accountId; })[0];
      return '<div class="transaction-row"><div class="transaction-merchant"><div class="merchant-avatar">' + esc(initials(transaction.merchant)) +
        '</div><div><strong>' + esc(transaction.merchant) + "</strong><span>" +
        esc(relativeDate(transaction.date) + " · " + sourceLabel(transaction.source)) + '</span></div></div><span class="category-pill">' +
        esc(transaction.category) + '</span><span class="account-label"><span style="background:' + esc(account ? account.color : "#909792") +
        '"></span>' + esc(account ? account.name : "Unknown") + '</span><span class="status-badge ' + esc(transaction.status) + '">' +
        icon(transaction.status === "confirmed" ? "check" : "clock") + esc(transaction.status.replace(/_/g, " ")) +
        '</span><strong class="amount ' + (transaction.amount >= 0 ? "positive" : "negative") + '">' + signedInr(transaction.amount) +
        '</strong><div class="row-actions">' +
        (transaction.status !== "confirmed" ? '<button class="icon-button ghost" data-action="approve-transaction" data-id="' + esc(transaction.id) +
          '" aria-label="Confirm ' + esc(transaction.merchant) + '">' + icon("check") + "</button>" : "") +
        '<button class="icon-button ghost" data-action="edit-transaction" data-id="' + esc(transaction.id) + '" aria-label="Edit ' +
        esc(transaction.merchant) + '">' + icon("edit") + '</button><button class="icon-button ghost danger" data-action="delete-transaction" data-id="' +
        esc(transaction.id) + '" aria-label="Delete ' + esc(transaction.merchant) + '">' + icon("trash") + "</button></div></div>";
    }).join("");
    return '<div class="view-stack">' +
      pageHeading("The ledger", "Activity", "Every rupee in, out, moved or invested—with its source and review state.",
        button("add-transaction", "Add transaction", "primary-button", "plus")) +
      '<div class="toolbar-card"><label class="search-field">' + icon("search") +
        '<input id="activity-search" value="' + esc(state.activityQuery) + '" placeholder="Search merchant or category" aria-label="Search transactions"></label>' +
        '<div class="segmented-control" aria-label="Transaction filters">' + filters + '</div>' +
        button("more-filters", "More filters", "secondary-button", "sliders") + "</div>" +
      '<section class="panel-card transaction-table-card"><div class="table-heading-row"><span>Transaction</span><span>Category</span><span>Account</span><span>Status</span><span>Amount</span><span></span></div>' +
        '<div class="transaction-table">' + rows + "</div>" +
        (!filtered.length ? '<div class="empty-state">' + icon("search") + "<div><strong>No transactions match</strong><span>Try a different search or filter.</span></div></div>" : "") +
      "</section></div>";
  }

  function renderPlan() {
    var budgets = state.snapshot.budgets;
    var totalCap = budgets.reduce(function (sum, budget) { return sum + budget.cap; }, 0);
    var totalSpent = budgets.reduce(function (sum, budget) { return sum + budget.spent; }, 0);
    var due = state.snapshot.recurring.filter(function (item) { return item.status !== "settled"; })
      .reduce(function (sum, item) { return sum + item.amount; }, 0);
    var cards = budgets.map(function (budget) {
      var total = budget.cap + (budget.rollover || 0);
      var available = total - budget.spent;
      var progress = Math.min(100, Math.round(budget.spent / Math.max(1, total) * 100));
      return '<button class="budget-card" data-action="edit-budget" data-id="' + esc(budget.id) + '"><div class="budget-top">' +
        '<span class="budget-icon" style="background:' + esc(budget.color) + '22;color:' + esc(budget.color) + '">' + esc(initials(budget.name)) +
        '</span><span class="budget-group ' + esc(budget.group) + '">' + esc(budget.group) + "</span></div><strong>" + esc(budget.name) +
        '</strong><div class="budget-values"><span>' + inr(budget.spent) + " spent</span><span>" + inr(Math.max(0, available)) +
        ' left</span></div><div class="budget-progress"><span style="width:' + progress + "%;background:" + esc(budget.color) +
        '"></span></div><div class="budget-footer"><span>' + progress + "% used</span><span>" +
        (budget.rollover ? inr(budget.rollover) + " rolled over" : inr(budget.cap) + " cap") + "</span></div></button>";
    }).join("");
    return '<div class="view-stack">' +
      pageHeading("Forward, not backward", "September plan", "Protect the important things first, then spend the rest without second-guessing.",
        button("safe-spend", "Explain " + compactInr(safeSpend()), "primary-button", "plan")) +
      '<div class="stat-grid three">' +
        statCard("Planned", inr(totalCap), "Across " + budgets.length + " categories", "target", "green") +
        statCard("Used", inr(totalSpent), Math.round(totalSpent / Math.max(totalCap, 1) * 100) + "% of plan", "down", "coral") +
        statCard("Known obligations", inr(due), "Next 30 days", "calendar", "gold") + "</div>" +
      '<section class="panel-card">' + sectionHeader("Category plan", "Caps, rollovers and progress for this month",
        button("new-budget", "New category", "secondary-button", "plus")) + '<div class="budget-grid">' + cards + "</div></section>" +
      '<section class="panel-card goals-panel">' + sectionHeader("Future-you funds", "Money protected for goals beyond this month") +
        '<div class="goal-row"><div class="goal-ring" style="--goal:72%"><span>72%</span></div><div><strong>Emergency fund</strong><span>₹3.6L of ₹5L · 4.8 months covered</span></div><div class="goal-trend">' +
        icon("trend") + ' ₹20,000 this month</div></div><div class="goal-row"><div class="goal-ring teal" style="--goal:48%"><span>48%</span></div><div><strong>Japan · Spring 2027</strong><span>₹1.2L of ₹2.5L · on track</span></div><div class="goal-trend">' +
        icon("trend") + " ₹15,000 this month</div></div></section></div>";
  }

  function renderAccounts() {
    var accounts = state.snapshot.accounts;
    var transactions = state.snapshot.transactions;
    var assets = accounts.filter(function (account) { return account.balance > 0; }).reduce(function (sum, account) { return sum + account.balance; }, 0);
    var liabilities = Math.abs(accounts.filter(function (account) { return account.balance < 0; }).reduce(function (sum, account) { return sum + account.balance; }, 0));
    var cards = accounts.map(function (account) {
      var recent = transactions.filter(function (transaction) { return transaction.accountId === account.id; }).slice(0, 3);
      var mismatch = account.reportedBalance !== undefined && account.reportedBalance !== account.balance;
      var recentRows = recent.length ? recent.map(function (transaction) {
        return "<div><span>" + esc(transaction.merchant) + "</span><strong>" + signedInr(transaction.amount) + "</strong></div>";
      }).join("") : '<span class="muted">No recent cash-flow transactions</span>';
      var use = utilization(account);
      var utilisation = account.type === "credit" && account.limit ?
        '<div class="utilisation"><div><span>Utilisation</span><strong>' + use +
        '%</strong></div><div class="budget-progress"><span style="width:' + use + "%;background:" + (use > 30 ? "var(--coral)" : "var(--green)") +
        '"></span></div><span>' + inr(account.limit - Math.abs(account.balance)) + " available of " + inr(account.limit) + "</span></div>" : "";
      return '<section class="account-detail-card panel-card"><div class="account-detail-head"><div class="account-logo" style="background:' + esc(account.color) + '">' +
        esc(initials(account.institution)) + "</div><div><strong>" + esc(account.name) + "</strong><span>" + esc(account.institution + (account.last4 ? " · •••• " + account.last4 : "")) +
        '</span></div><button class="icon-button ghost" data-action="account-menu" aria-label="Account options">' + icon("more") +
        '</button></div><div class="account-balance"><span>' + (account.type === "credit" ? "Current balance" : "Available balance") +
        "</span><strong>" + inr(Math.abs(account.balance)) + "</strong></div>" + utilisation +
        '<div class="account-trust-row"><div>' + icon("check") + "<span>" + esc(mismatch ? "Needs reconciliation" : "Reconciled " + (account.reconciledAt || "manually")) +
        "</span></div><span>Updated " + esc(account.freshness) + '</span></div><div class="account-recent">' + recentRows +
        '</div><button class="secondary-button full" data-action="reconcile-account" data-id="' + esc(account.id) + '">' +
        icon(account.type === "investment" ? "trend" : "sync") + (account.type === "investment" ? " Update valuation" : " Reconcile balance") + "</button></section>";
    }).join("");
    return '<div class="view-stack">' +
      pageHeading("One trusted ledger", "Accounts", "Balances are estimates until reconciled against a reported balance.",
        button("add-account", "Add account", "primary-button", "plus")) +
      '<div class="stat-grid three">' +
        statCard("Net worth", inr(netWorth(accounts)), "+2.9% this month", "trend", "green") +
        statCard("Assets", inr(assets), "Banks, cash and investments", "bank", "blue") +
        statCard("Liabilities", inr(liabilities), "Credit card balances", "card", "coral") +
      '</div><div class="accounts-grid">' + cards + "</div></div>";
  }

  function renderUpcoming() {
    var recurring = state.snapshot.recurring;
    var active = recurring.filter(function (item) { return item.status !== "settled"; });
    var dueTotal = active.reduce(function (sum, item) { return sum + item.amount; }, 0);
    var dueWeek = active.filter(function (item) { var days = daysUntil(item.dueDate); return days >= 0 && days <= 7; })
      .reduce(function (sum, item) { return sum + item.amount; }, 0);
    var switcher = '<div class="segmented-control small"><button data-action="upcoming-mode" data-mode="list" class="' +
      (state.upcomingMode === "list" ? "active" : "") + '">List</button><button data-action="upcoming-mode" data-mode="calendar" class="' +
      (state.upcomingMode === "calendar" ? "active" : "") + '">Calendar</button></div>';
    var content = state.upcomingMode === "calendar" ? renderUpcomingCalendar(recurring) : '<div class="timeline-list">' +
      recurring.map(function (item) {
        var account = state.snapshot.accounts.filter(function (entry) { return entry.id === item.accountId; })[0];
        var days = daysUntil(item.dueDate);
        var timing = item.status === "settled" ? "settled" : days === 0 ? "today" : days > 0 ? "in " + days + " days" : Math.abs(days) + " days ago";
        return '<div class="timeline-row ' + esc(item.status) + '"><div class="timeline-date"><strong>' + Number(item.dueDate.slice(-2)) +
          '</strong><span>' + esc(new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(item.dueDate + "T00:00:00")).toUpperCase()) +
          '</span></div><span class="timeline-dot ' + esc(item.certainty) + '"></span><div class="timeline-copy"><strong>' +
          esc(item.name) + "</strong><span>" + esc(item.category + " · from " + (account ? account.name : "account") + " · " + item.cadence) +
          '</span></div><span class="certainty-badge ' + esc(item.certainty) + '">' + esc(item.certainty) +
          '</span><div class="timeline-amount"><strong>' + inr(item.amount) + "</strong><span>" + esc(timing) + "</span></div>" +
          (item.status !== "settled" ? '<button class="approve-button" data-action="settle-recurring" data-id="' + esc(item.id) + '">' +
            icon("check") + "Mark paid</button>" : '<span class="settled-check">' + icon("check") + "</span>") + "</div>";
      }).join("") + "</div>";
    return '<div class="view-stack">' +
      pageHeading("Know before it lands", "Upcoming", "A chronological view of every bill, EMI, card payment and planned transfer.",
        button("add-recurring", "Add obligation", "primary-button", "plus")) +
      '<div class="stat-grid three">' +
        statCard("Next 30 days", inr(dueTotal), active.length + " known obligations", "calendar", "gold") +
        statCard("Due this week", inr(dueWeek), "Current seven-day window", "clock", "coral") +
        statCard("Already settled", String(recurring.length - active.length), "This calendar month", "check", "green") +
      '</div><section class="panel-card timeline-card">' +
        sectionHeader("September calendar", "Estimated items use a dotted marker and remain editable", switcher) + content + "</section></div>";
  }

  function renderUpcomingCalendar(recurring) {
    var year = Number((recurring[0] && recurring[0].dueDate.slice(0, 4)) || todayInIndia().slice(0, 4));
    var month = Number((recurring[0] && recurring[0].dueDate.slice(5, 7)) || todayInIndia().slice(5, 7));
    var days = new Date(Date.UTC(year, month, 0)).getUTCDate();
    var start = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    var cells = "";
    for (var pad = 0; pad < start; pad += 1) cells += '<div class="calendar-day empty"></div>';
    for (var day = 1; day <= days; day += 1) {
      var matches = recurring.filter(function (item) { return Number(item.dueDate.slice(-2)) === day; });
      cells += '<div class="calendar-day"><strong>' + day + "</strong>" + matches.map(function (item) {
        return '<span class="' + esc(item.status) + '" title="' + esc(item.name + " · " + inr(item.amount)) + '">' + esc(item.name) + "</span>";
      }).join("") + "</div>";
    }
    return '<div class="calendar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>' +
      '<div class="calendar-grid">' + cells + "</div>";
  }

  function toggleRow(name, title, detail, checked) {
    return '<label class="toggle-row"><div><strong>' + esc(title) + "</strong><span>" + esc(detail) +
      '</span></div><input name="' + name + '" aria-label="' + esc(title) + '" type="checkbox"' + (checked ? " checked" : "") +
      '><span class="toggle-ui"></span></label>';
  }

  function renderSettings() {
    var connection = state.connection;
    var lockExists = false;
    try { lockExists = Boolean(localStorage.getItem(PIN_KEY)); } catch (error) {}
    return '<div class="view-stack settings-view">' +
      pageHeading("Make it yours", "Settings", "Configure your private data source, device controls, appearance and backups.") +
      '<div class="settings-layout"><div class="settings-main">' +
      '<section class="panel-card settings-card"><div class="settings-card-head"><div class="settings-icon green">' + icon("database") +
        '</div><div><h2>Connect your Sheet</h2><p>The endpoint and token stay on this device. FinanceOS never sees your Google password.</p></div>' +
        '<span class="connection-status ' + (connection.endpoint ? "connected" : "demo") + '">' + (connection.endpoint ? "Configured" : "Demo mode") +
        '</span></div><div class="setup-steps"><div class="done"><span>1</span><div><strong>Create your FinanceOS Sheet</strong><small>Run setupFinanceOS() in the included Apps Script.</small></div></div>' +
        '<div class="' + (connection.endpoint ? "done" : "") + '"><span>2</span><div><strong>Paste the private endpoint</strong><small>Use the deployed /exec URL—not an editor or preview URL.</small></div></div>' +
        '<div class="' + (connection.token ? "done" : "") + '"><span>3</span><div><strong>Add this device’s token</strong><small>Generate and rotate tokens from your Sheet menu.</small></div></div></div>' +
        '<form data-form="connection"><div class="form-grid"><label class="field full"><span>Apps Script web-app URL</span><div class="input-with-icon">' + icon("database") +
        '<input name="endpoint" value="' + esc(connection.endpoint) + '" placeholder="https://script.google.com/macros/s/…/exec"></div></label>' +
        '<label class="field full"><span>Device token</span><div class="input-with-icon">' + icon("shield") +
        '<input id="device-token" name="token" value="' + esc(connection.token) + '" type="password" placeholder="fos_••••••••••••••••">' +
        '<button type="button" data-action="toggle-token" aria-label="Show token">' + icon("eye") + "</button></div></label></div>" +
        '<div class="toggle-list compact-toggles">' +
          toggleRow("rememberDevice", "Remember the token on this device", "Otherwise it is forgotten when this browser session ends.", connection.rememberDevice) +
          toggleRow("offlineCache", "Keep an offline snapshot", "Allows read-only access without a connection. Disable on shared devices.", connection.offlineCache) +
        '</div><div class="button-row"><button class="primary-button" type="submit">Save connection</button>' +
        button("sync", "Test and sync", "secondary-button", "sync", 'type="button"') +
        '<span class="inline-status">' + esc(state.sync.message + " · " + state.sync.lastSync) + "</span></div></form></section>" +
      '<section class="panel-card settings-card"><div class="settings-card-head"><div class="settings-icon gold">' + icon("lock") +
        '</div><div><h2>Device privacy lock</h2><p>A local shoulder-surfing guard. Backend access is still controlled by your device token.</p></div></div>' +
        '<form class="pin-form" data-form="pin"><label class="field"><span>New 6-digit PIN</span><input name="pin" inputmode="numeric" maxlength="6" placeholder="••••••" type="password"></label>' +
        '<label class="field"><span>Confirm PIN</span><input name="confirmPin" inputmode="numeric" maxlength="6" placeholder="••••••" type="password"></label>' +
        '<button class="secondary-button" type="submit">' + icon("fingerprint") + " Enable lock</button>" +
        (lockExists ? button("remove-lock", "Remove lock", "text-button danger-text", "", 'type="button"') : "") +
        button("lock-now", "Lock now", "text-button", "", 'type="button"') + "</form></section>" +
      '<section class="panel-card settings-card"><div class="settings-card-head"><div class="settings-icon blue">' + icon("download") +
        '</div><div><h2>Data and recovery</h2><p>Portable JSON backups include the complete ledger snapshot, not your endpoint token.</p></div></div>' +
        '<div class="data-actions">' + button("export", "Export backup", "secondary-button", "download") +
        button("import", "Import backup", "secondary-button", "upload") +
        '<input id="backup-input" type="file" accept="application/json,.json" hidden>' +
        button("reset-demo", "Restore demo", "secondary-button danger-outline", "sync") + "</div></section></div>" +
      '<aside class="settings-side"><section class="panel-card settings-card sticky-card"><div class="settings-card-head"><div class="settings-icon coral">' +
        icon("sun") + '</div><div><h2>Appearance</h2><p>Calm contrast, reduced blur and accessible motion.</p></div></div>' +
        '<div class="theme-choice"><button data-action="set-theme" data-theme="light" class="' + (state.theme === "light" ? "active" : "") +
        '"><span class="theme-preview light"><i></i><i></i><i></i></span><span>' + icon("sun") + ' Light</span></button>' +
        '<button data-action="set-theme" data-theme="dark" class="' + (state.theme === "dark" ? "active" : "") +
        '"><span class="theme-preview dark"><i></i><i></i><i></i></span><span>' + icon("moon") + " AMOLED</span></button></div>" +
        '<div class="accent-row"><span>Accent</span><div>' +
        ["green", "blue", "coral", "gold"].map(function (accent) {
          return '<button data-action="set-accent" data-accent="' + accent + '" class="accent ' + accent + " " +
            (state.accent === accent ? "active" : "") + '" aria-label="' + accent + ' accent"></button>';
        }).join("") + '</div></div></section><section class="privacy-note">' + icon("shield") +
        '<div><strong>Your privacy boundary</strong><p>Your financial data lives in your Sheet and optional device cache. The static app has no analytics, ads or shared FinanceOS database.</p></div></section>' +
        '<section class="version-note"><span>FinanceOS package-free build</span><strong>Schema 1 · September 2026</strong></section></aside></div></div>';
  }

  function modalShell(title, copy, body, extraClass) {
    return '<div class="modal-layer" role="presentation"><button class="modal-backdrop" data-action="close-overlay" aria-label="Close dialog"></button>' +
      '<section class="modal-card ' + (extraClass || "") + '" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<div class="modal-head"><div><h2 id="modal-title">' + esc(title) + "</h2><p>" + esc(copy) +
      '</p></div><button class="icon-button" data-action="close-overlay" aria-label="Close dialog">' + icon("close") + "</button></div>" + body + "</section></div>";
  }

  function renderOverlay() {
    if (!state.modal) return "";
    if (state.modal === "safe") return renderSafeDrawer();
    if (state.modal === "transaction") return renderTransactionModal();
    if (state.modal === "reconcile") return renderReconcileModal();
    if (state.modal === "budget") return renderBudgetModal();
    if (state.modal === "new-budget") return renderNewBudgetModal();
    if (state.modal === "account") return renderAccountModal();
    if (state.modal === "recurring") return renderRecurringModal();
    return "";
  }

  function renderSafeDrawer() {
    var lines = safeSpendLines();
    var safe = safeSpend();
    var uncertainty = Math.abs((lines.filter(function (line) { return line.id === "uncertainty"; })[0] || { amount: 0 }).amount);
    var rows = lines.map(function (line) {
      return '<div class="math-line"><span class="math-sign ' + line.tone + '">' + icon(line.amount >= 0 ? "plus" : "down") +
        '</span><div><strong>' + esc(line.label) + "</strong><span>" + esc(line.detail) + '</span></div><strong class="' +
        (line.amount >= 0 ? "positive" : "negative") + '">' + signedInr(line.amount) + "</strong></div>";
    }).join("");
    return '<div class="drawer-layer"><button class="modal-backdrop" data-action="close-overlay" aria-label="Close safe-to-spend explanation"></button>' +
      '<aside class="safe-drawer" role="dialog" aria-modal="true" aria-labelledby="safe-title"><div class="drawer-head"><div>' +
      '<span class="eyebrow">Explain the number</span><h2 id="safe-title">Safe to spend</h2></div><button class="icon-button" data-action="close-overlay" aria-label="Close">' +
      icon("close") + '</button></div><div class="drawer-safe-total"><span>Until next salary</span><strong>' + inr(safe) +
      "</strong><p>Based on the latest balances, category reserves and active obligations.</p></div><div class=\"math-lines\">" + rows +
      '</div><div class="math-total"><span>Available without touching protected money</span><strong>' + inr(safe) +
      '</strong></div><div class="confidence-note">' + icon("shield") + '<div><strong>Conservative forecast</strong><span>An uncertainty reserve of ' +
      inr(uncertainty) + ' is already included for estimated or variable bills.</span></div></div><button class="primary-button full" data-action="close-overlay">Got it</button></aside></div>';
  }

  function transactionDraft() {
    var existing = state.snapshot.transactions.filter(function (item) { return item.id === state.editingId; })[0];
    return state.modalDraft || {
      id: existing ? existing.id : "",
      merchant: existing ? existing.merchant : "",
      amount: existing ? String(Math.abs(existing.amount)) : "",
      kind: existing ? existing.kind : "expense",
      category: existing ? existing.category : "Groceries",
      accountId: existing ? existing.accountId : (state.snapshot.accounts[0] ? state.snapshot.accounts[0].id : ""),
      destinationAccountId: existing && existing.destinationAccountId ? existing.destinationAccountId : "",
      note: existing && existing.note ? existing.note : "",
      date: existing ? existing.date.slice(0, 10) : todayInIndia(),
      source: existing ? existing.source : "manual"
    };
  }

  function renderTransactionModal() {
    var draft = transactionDraft();
    state.modalDraft = draft;
    var needsDestination = draft.kind === "transfer" || draft.kind === "investment";
    var sourceAccounts = draft.kind === "investment" ? state.snapshot.accounts.filter(function (account) { return account.type !== "investment"; }) : state.snapshot.accounts;
    if (!sourceAccounts.some(function (account) { return account.id === draft.accountId; })) draft.accountId = sourceAccounts[0] ? sourceAccounts[0].id : "";
    var destinations = state.snapshot.accounts.filter(function (account) {
      return account.id !== draft.accountId && (draft.kind !== "investment" || account.type === "investment");
    });
    if (needsDestination && !destinations.some(function (account) { return account.id === draft.destinationAccountId; })) {
      draft.destinationAccountId = destinations[0] ? destinations[0].id : "";
    }
    var kinds = ["expense", "income", "transfer", "investment", "refund"].map(function (kind) {
      return '<button type="button" data-action="transaction-kind" data-kind="' + kind + '" class="' + (draft.kind === kind ? "active" : "") + '">' + kind + "</button>";
    }).join("");
    var accountOptions = options(sourceAccounts.map(function (account) {
      return { value: account.id, label: account.name + " · " + account.institution };
    }), draft.accountId);
    var destinationOptions = options(destinations.map(function (account) {
      return { value: account.id, label: account.name + " · " + account.institution };
    }), draft.destinationAccountId);
    var body = '<form class="modal-form" data-form="transaction"><div class="kind-picker">' + kinds + '</div>' +
      '<label class="field full"><span>Merchant or description</span><input name="merchant" value="' + esc(draft.merchant) +
      '" placeholder="e.g. Third Wave Coffee" required></label><div class="form-grid">' +
      '<label class="field"><span>Amount</span><div class="amount-input"><span>₹</span><input name="amount" inputmode="decimal" value="' +
      esc(draft.amount) + '" placeholder="0" required></div></label>' +
      '<label class="field"><span>Date</span><input name="date" type="date" value="' + esc(draft.date) + '" required></label>' +
      '<label class="field"><span>Category</span><select name="category">' + options(CATEGORIES, draft.category) + "</select></label>" +
      '<label class="field"><span>' + (needsDestination ? "From account" : "Account") + '</span><select name="accountId" data-role="transaction-source" required>' +
      accountOptions + "</select></label>" +
      (needsDestination ? '<label class="field full"><span>To account</span><select name="destinationAccountId" required>' + destinationOptions + "</select></label>" : "") +
      '<label class="field full"><span>Note <small>optional</small></span><textarea name="note" placeholder="Add context future-you will understand">' +
      esc(draft.note) + '</textarea></label></div><div class="modal-actions"><button type="button" class="text-button" data-action="close-overlay">Cancel</button>' +
      '<button class="primary-button" type="submit">' + (state.editingId ? "Save changes" : "Add transaction") + "</button></div></form>";
    return modalShell(state.editingId ? "Edit transaction" : "Add a transaction",
      "Manual entries are confirmed immediately and synced to your ledger.", body);
  }

  function renderReconcileModal() {
    var account = state.snapshot.accounts.filter(function (item) { return item.id === state.editingId; })[0];
    if (!account) return "";
    var numeric = Math.abs(account.reportedBalance !== undefined ? account.reportedBalance : account.balance);
    var label = account.type === "investment" ? "Valuation shown by " + account.institution : "Balance shown by " + account.institution;
    var body = '<form data-form="reconcile"><div class="reconcile-summary"><div><span>Calculated balance</span><strong>' +
      inr(Math.abs(account.balance)) + '</strong></div>' + icon("arrow") + '<div><span>Reported balance</span><strong id="reported-preview">' +
      inr(numeric) + '</strong></div></div><label class="field full"><span>' + esc(label) +
      '</span><div class="amount-input"><span>₹</span><input name="amount" data-role="reconcile-amount" inputmode="decimal" value="' +
      esc(numeric) + '"></div></label><div id="difference-note">' + reconciliationNote(account, numeric) +
      '</div><div class="modal-actions"><button type="button" class="text-button" data-action="close-overlay">Cancel</button>' +
      '<button class="primary-button" type="submit">' + (account.type === "investment" ? "Update valuation" : "Reconcile account") + "</button></div></form>";
    return modalShell(account.type === "investment" ? "Update " + account.name : "Reconcile " + account.name,
      account.type === "investment" ? "Record the latest portfolio valuation as a transparent snapshot." : "Compare FinanceOS with the balance shown by your bank or card issuer.", body);
  }

  function reconciliationNote(account, numeric) {
    var signed = account.type === "credit" ? -Math.abs(numeric) : numeric;
    var difference = signed - account.balance;
    return '<div class="difference-note ' + (difference === 0 ? "match" : "mismatch") + '">' + icon(difference === 0 ? "check" : "info") +
      '<div><strong>' + esc(difference === 0 ? "Balances match" : signedInr(difference) + " adjustment needed") + "</strong><span>" +
      esc(difference === 0 ? "This account can be marked reconciled." : "FinanceOS will record a visible balance adjustment and audit entry.") + "</span></div></div>";
  }

  function renderBudgetModal() {
    var budget = state.snapshot.budgets.filter(function (item) { return item.id === state.editingId; })[0];
    if (!budget) return "";
    var body = '<form data-form="budget"><label class="field full"><span>Monthly cap</span><div class="amount-input"><span>₹</span>' +
      '<input name="cap" inputmode="decimal" value="' + esc(budget.cap) + '"></div></label><div class="difference-note match">' +
      icon("info") + "<div><strong>" + inr(budget.spent) + " spent so far</strong><span>" +
      esc(budget.rollover ? inr(budget.rollover) + " rolled in from last month." : "No rollover is applied to this category.") +
      '</span></div></div><div class="modal-actions"><button type="button" class="text-button" data-action="close-overlay">Cancel</button>' +
      '<button class="primary-button" type="submit">Save budget</button></div></form>';
    return modalShell("Edit " + budget.name, "Changing the cap updates the month’s available amount immediately.", body);
  }

  function renderNewBudgetModal() {
    var body = '<form class="modal-form" data-form="new-budget"><label class="field full"><span>Category name</span>' +
      '<input name="name" placeholder="e.g. Fitness" required></label><div class="form-grid"><label class="field"><span>Monthly cap</span>' +
      '<div class="amount-input"><span>₹</span><input name="cap" inputmode="decimal" placeholder="0" required></div></label>' +
      '<label class="field"><span>Planning group</span><select name="group"><option value="fixed">Fixed</option><option value="flex" selected>Flexible</option>' +
      '<option value="future">Future / sinking fund</option></select></label></div><div class="modal-actions">' +
      '<button type="button" class="text-button" data-action="close-overlay">Cancel</button><button class="primary-button" type="submit">Add category</button></div></form>';
    return modalShell("New budget category", "Set aside money for a fixed cost, flexible spending or a future goal.", body);
  }

  function renderAccountModal() {
    var accountTypes = [
      { value: "bank", label: "Bank account" }, { value: "cash", label: "Cash wallet" },
      { value: "credit", label: "Credit card" }, { value: "investment", label: "Investment snapshot" }
    ];
    var body = '<form class="modal-form" data-form="account"><div class="form-grid"><label class="field"><span>Nickname</span>' +
      '<input name="name" placeholder="e.g. Salary account" required></label><label class="field"><span>Institution</span>' +
      '<input name="institution" placeholder="e.g. HDFC Bank" required></label><label class="field"><span>Account type</span>' +
      '<select name="type" data-role="account-type">' + options(accountTypes, "bank") + '</select></label><label class="field"><span>Last 4 digits</span>' +
      '<input name="last4" inputmode="numeric" maxlength="4" placeholder="Optional"></label><label class="field"><span id="balance-label">Opening balance</span>' +
      '<div class="amount-input"><span>₹</span><input name="balance" inputmode="decimal" placeholder="0" required></div></label>' +
      '<label class="field" id="credit-limit-field" hidden><span>Credit limit</span><div class="amount-input"><span>₹</span>' +
      '<input name="limit" inputmode="decimal" placeholder="0"></div></label></div><div class="difference-note match">' + icon("info") +
      '<div><strong>This becomes the opening balance</strong><span>Reconcile again after importing historical transactions to avoid double counting.</span></div></div>' +
      '<div class="modal-actions"><button type="button" class="text-button" data-action="close-overlay">Cancel</button>' +
      '<button class="primary-button" type="submit">Add account</button></div></form>';
    return modalShell("Add an account", "Start from the balance shown today. Future postings will move it automatically.", body);
  }

  function renderRecurringModal() {
    var payableAccounts = state.snapshot.accounts.filter(function (account) { return account.type === "bank" || account.type === "credit"; });
    var accountOptions = options(payableAccounts.map(function (account) {
      return { value: account.id, label: account.name + " · " + account.institution };
    }), payableAccounts[0] ? payableAccounts[0].id : "");
    var body = '<form class="modal-form" data-form="recurring"><div class="form-grid"><label class="field full"><span>Name</span>' +
      '<input name="name" placeholder="e.g. Annual vehicle insurance" required></label><label class="field"><span>Amount</span>' +
      '<div class="amount-input"><span>₹</span><input name="amount" inputmode="decimal" placeholder="0" required></div></label>' +
      '<label class="field"><span>Due date</span><input name="dueDate" type="date" value="' + todayInIndia() + '" required></label>' +
      '<label class="field"><span>Category</span><select name="category">' + options(CATEGORIES, "Subscriptions") + "</select></label>" +
      '<label class="field"><span>Pay from</span><select name="accountId" required>' + accountOptions + '</select></label>' +
      '<label class="field"><span>Cadence</span><select name="cadence"><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></label>' +
      '<label class="field"><span>Amount confidence</span><select name="certainty"><option value="exact">Exact</option><option value="estimated">Estimated</option></select></label></div>' +
      (!payableAccounts.length ? '<div class="difference-note mismatch">' + icon("info") + "<div><strong>Add an account first</strong><span>An obligation needs a source account.</span></div></div>" : "") +
      '<div class="modal-actions"><button type="button" class="text-button" data-action="close-overlay">Cancel</button>' +
      '<button class="primary-button" type="submit"' + (!payableAccounts.length ? " disabled" : "") + ">Add obligation</button></div></form>";
    return modalShell("Add an upcoming obligation", "Known dues are reserved before FinanceOS calculates what is safe to spend.", body);
  }

  function renderLock() {
    return '<div class="lock-screen"><div class="lock-orb"><div class="brand-mark">₹</div></div><form class="lock-card" data-form="unlock">' +
      '<div class="lock-brand">FinanceOS</div>' + icon("lock") + '<h1>Welcome back</h1><p>Unlock the private snapshot stored on this device.</p>' +
      '<label class="pin-input"><input id="unlock-pin" name="pin" inputmode="numeric" maxlength="6" placeholder="6-digit PIN" type="password">' +
      '<button type="button" data-action="toggle-unlock-pin" aria-label="Show PIN">' + icon("eye") + '</button></label>' +
      '<button class="primary-button full" id="unlock-button" disabled>Unlock FinanceOS</button><span class="lock-disclaimer">' +
      icon("info") + " This protects the local view; your Sheet token controls backend access.</span></form></div>";
  }

  function closeOverlay() {
    state.modal = null;
    state.editingId = null;
    state.modalDraft = null;
    renderApp();
  }

  function navigate(view) {
    if (!NAV.some(function (item) { return item.key === view; })) return;
    state.view = view;
    state.menuOpen = false;
    if (location.hash !== "#" + view) history.pushState(null, "", "#" + view);
    renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message) {
    var root = document.getElementById("toast-root");
    if (!root) {
      setTimeout(function () { showToast(message); }, 0);
      return;
    }
    root.innerHTML = '<div class="toast" role="status">' + icon("check") + esc(message) + "</div>";
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () {
      var current = document.getElementById("toast-root");
      if (current) current.innerHTML = "";
    }, 3200);
  }

  function downloadJson(data, filename) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
  }

  function bytesToBase64(bytes) {
    var binary = "";
    bytes.forEach(function (byte) { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function pinVerifier(pin, saltBase64) {
    var encoder = new TextEncoder();
    return crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]).then(function (source) {
      var salt = Uint8Array.from(atob(saltBase64), function (character) { return character.charCodeAt(0); });
      return crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: 210000, hash: "SHA-256" }, source, 256);
    }).then(function (bits) { return bytesToBase64(new Uint8Array(bits)); });
  }

  function postToBackend(action, payload) {
    if (!state.connection.endpoint || !state.connection.token) return Promise.resolve(undefined);
    return fetch(state.connection.endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: action, token: state.connection.token, payload: payload || {} }),
      redirect: "follow"
    }).then(function (response) {
      if (!response.ok) throw new Error("Backend returned " + response.status);
      return response.json();
    }).then(function (result) {
      if (!result.ok) throw new Error(result.error || "The backend rejected the request");
      return result;
    });
  }

  function syncNow() {
    state.sync.message = "Syncing…";
    renderApp();
    if (!state.connection.endpoint || !state.connection.token) {
      setTimeout(function () {
        state.sync = { mode: "demo", lastSync: "Just now", message: "Demo refreshed" };
        renderApp();
        showToast("Demo workspace refreshed");
      }, 480);
      return;
    }
    postToBackend("bootstrap").then(function (result) {
      if (result && result.data) updateSnapshot(result.data);
      state.sync = { mode: "connected", lastSync: "Just now", message: "Sheet is current" };
      renderApp();
      showToast("Everything is up to date");
    }).catch(function (error) {
      state.sync = { mode: navigator.onLine ? "error" : "offline", lastSync: "Cached", message: error.message || "Sync failed" };
      renderApp();
      showToast("Could not sync; showing the last snapshot");
    });
  }

  function queueMutation(action, payload) {
    if (!state.connection.endpoint || !state.connection.token) return;
    state.sync.message = "Saving to Sheet…";
    postToBackend(action, payload).then(function () {
      state.sync = { mode: "connected", lastSync: "Just now", message: "Sheet is current" };
      renderApp();
    }).catch(function (error) {
      state.sync = {
        mode: navigator.onLine ? "error" : "offline",
        lastSync: "Local change pending",
        message: error.message || "Sheet update failed"
      };
      renderApp();
      showToast("Saved locally; check the Sheet connection before making more changes");
    });
  }

  function openModal(name, id) {
    state.modal = name;
    state.editingId = id || null;
    state.modalDraft = null;
    renderApp();
    setTimeout(function () {
      var first = document.querySelector(".modal-card input:not([type=hidden]), .safe-drawer button, .modal-card button");
      if (first) first.focus();
    }, 0);
  }

  function captureTransactionForm() {
    var form = document.querySelector('form[data-form="transaction"]');
    if (!form) return transactionDraft();
    var data = new FormData(form);
    var draft = state.modalDraft || transactionDraft();
    draft.merchant = String(data.get("merchant") || "");
    draft.amount = String(data.get("amount") || "");
    draft.date = String(data.get("date") || todayInIndia());
    draft.category = String(data.get("category") || "Groceries");
    draft.accountId = String(data.get("accountId") || "");
    draft.destinationAccountId = String(data.get("destinationAccountId") || "");
    draft.note = String(data.get("note") || "");
    state.modalDraft = draft;
    return draft;
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) return;
    var action = target.dataset.action;

    if (action === "navigate") navigate(target.dataset.view);
    else if (action === "settings") navigate("settings");
    else if (action === "menu-open") { state.menuOpen = true; renderApp(); }
    else if (action === "menu-close") { state.menuOpen = false; renderApp(); }
    else if (action === "theme-toggle") {
      state.theme = state.theme === "light" ? "dark" : "light";
      try { localStorage.setItem(THEME_KEY, state.theme); } catch (error) {}
      applyTheme();
      renderApp();
    } else if (action === "set-theme") {
      state.theme = target.dataset.theme;
      try { localStorage.setItem(THEME_KEY, state.theme); } catch (error) {}
      applyTheme();
      renderApp();
    } else if (action === "set-accent") {
      state.accent = target.dataset.accent;
      try { localStorage.setItem(ACCENT_KEY, state.accent); } catch (error) {}
      applyTheme();
      renderApp();
      showToast("Accent updated");
    } else if (action === "sync") syncNow();
    else if (action === "review-queue") {
      state.activityFilter = "review";
      navigate("activity");
    } else if (action === "safe-spend") openModal("safe");
    else if (action === "add-transaction") openModal("transaction");
    else if (action === "edit-transaction") openModal("transaction", target.dataset.id);
    else if (action === "approve-transaction") {
      var approvedId = target.dataset.id;
      updateSnapshot(Object.assign({}, state.snapshot, {
        transactions: state.snapshot.transactions.map(function (transaction) {
          return transaction.id === approvedId ? Object.assign({}, transaction, { status: "confirmed" }) : transaction;
        })
      }));
      queueMutation("confirm_transaction", { id: approvedId });
      renderApp();
      showToast("Transaction confirmed");
    } else if (action === "delete-transaction") {
      var deletedId = target.dataset.id;
      var deleted = state.snapshot.transactions.filter(function (item) { return item.id === deletedId; })[0];
      if (deleted && window.confirm("Remove " + deleted.merchant + " from the ledger?")) {
        updateSnapshot(Object.assign({}, state.snapshot, {
          transactions: state.snapshot.transactions.filter(function (transaction) { return transaction.id !== deletedId; })
        }));
        queueMutation("delete_transaction", { id: deletedId });
        renderApp();
        showToast("Transaction removed · audit entry created");
      }
    } else if (action === "activity-filter") {
      state.activityFilter = target.dataset.filter;
      renderApp();
    } else if (action === "more-filters") {
      showToast("Search and quick filters cover the local ledger");
    } else if (action === "edit-budget") openModal("budget", target.dataset.id);
    else if (action === "new-budget") openModal("new-budget");
    else if (action === "add-account") openModal("account");
    else if (action === "reconcile-account") openModal("reconcile", target.dataset.id);
    else if (action === "account-menu") showToast("Account controls are available through reconciliation");
    else if (action === "add-recurring") openModal("recurring");
    else if (action === "settle-recurring") {
      var recurringId = target.dataset.id;
      updateSnapshot(Object.assign({}, state.snapshot, {
        recurring: state.snapshot.recurring.map(function (item) {
          return item.id === recurringId ? Object.assign({}, item, { status: "settled" }) : item;
        })
      }));
      queueMutation("settle_recurring", { id: recurringId });
      renderApp();
      showToast("Obligation marked as settled");
    } else if (action === "upcoming-mode") {
      state.upcomingMode = target.dataset.mode;
      renderApp();
    } else if (action === "close-overlay") closeOverlay();
    else if (action === "transaction-kind") {
      var draft = captureTransactionForm();
      draft.kind = target.dataset.kind;
      if (draft.kind === "investment") draft.category = "Investments";
      else if (draft.kind === "transfer") draft.category = "Transfers";
      if (draft.kind !== "investment" && draft.kind !== "transfer") draft.destinationAccountId = "";
      state.modalDraft = draft;
      renderApp();
    } else if (action === "toggle-token") {
      var tokenInput = document.getElementById("device-token");
      if (tokenInput) {
        tokenInput.type = tokenInput.type === "password" ? "text" : "password";
        target.setAttribute("aria-label", tokenInput.type === "password" ? "Show token" : "Hide token");
      }
    } else if (action === "toggle-unlock-pin") {
      var unlockInput = document.getElementById("unlock-pin");
      if (unlockInput) {
        unlockInput.type = unlockInput.type === "password" ? "text" : "password";
        target.setAttribute("aria-label", unlockInput.type === "password" ? "Show PIN" : "Hide PIN");
      }
    } else if (action === "remove-lock") {
      try { localStorage.removeItem(PIN_KEY); } catch (error) {}
      renderApp();
      showToast("Device lock removed");
    } else if (action === "lock-now") {
      var hasPin = false;
      try { hasPin = Boolean(localStorage.getItem(PIN_KEY)); } catch (error) {}
      if (!hasPin) showToast("Set a 6-digit PIN first");
      else {
        state.locked = true;
        renderApp();
      }
    } else if (action === "export") {
      downloadJson(state.snapshot, "financeos-backup-" + todayInIndia() + ".json");
      showToast("Backup exported");
    } else if (action === "import") {
      var fileInput = document.getElementById("backup-input");
      if (fileInput) fileInput.click();
    } else if (action === "reset-demo") {
      if (window.confirm("Restore the demo and replace the current local snapshot?")) {
        state.snapshot = clone(DEMO);
        try {
          localStorage.removeItem(SNAPSHOT_KEY);
          if (state.connection.offlineCache) localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(state.snapshot));
        } catch (error) {}
        renderApp();
        showToast("Demo data restored");
      }
    }
  });

  document.addEventListener("input", function (event) {
    var target = event.target;
    if (target.id === "activity-search") {
      state.activityQuery = target.value;
      var position = target.selectionStart;
      renderApp();
      var replacement = document.getElementById("activity-search");
      if (replacement) {
        replacement.focus();
        replacement.setSelectionRange(position, position);
      }
    }
    if ((target.name === "pin" || target.name === "confirmPin" || target.id === "unlock-pin" || target.name === "last4") && /\D/.test(target.value)) {
      target.value = target.value.replace(/\D/g, "");
    }
    if (target.id === "unlock-pin") {
      var unlockButton = document.getElementById("unlock-button");
      if (unlockButton) unlockButton.disabled = !/^\d{6}$/.test(target.value);
    }
    if (target.dataset.role === "reconcile-amount") {
      var account = state.snapshot.accounts.filter(function (item) { return item.id === state.editingId; })[0];
      var numeric = Number(target.value);
      var preview = document.getElementById("reported-preview");
      var note = document.getElementById("difference-note");
      if (preview) preview.textContent = Number.isFinite(numeric) ? inr(numeric) : "—";
      if (note && account && Number.isFinite(numeric)) note.innerHTML = reconciliationNote(account, numeric);
    }
  });

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (target.id === "backup-input" && target.files && target.files[0]) {
      target.files[0].text().then(function (text) {
        var next = JSON.parse(text);
        if (!Array.isArray(next.accounts) || !Array.isArray(next.transactions) || !Array.isArray(next.budgets) || !Array.isArray(next.recurring)) {
          throw new Error("Missing FinanceOS collections");
        }
        updateSnapshot(next);
        renderApp();
        showToast("Backup imported successfully");
      }).catch(function () { showToast("That file is not a valid FinanceOS backup"); });
    }
    if (target.dataset.role === "account-type") {
      var isCredit = target.value === "credit";
      var limitField = document.getElementById("credit-limit-field");
      var balanceLabel = document.getElementById("balance-label");
      if (limitField) limitField.hidden = !isCredit;
      if (balanceLabel) balanceLabel.textContent = isCredit ? "Current amount owed" : "Opening balance";
    }
    if (target.dataset.role === "transaction-source") {
      var draft = captureTransactionForm();
      draft.accountId = target.value;
      state.modalDraft = draft;
      renderApp();
    }
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form.dataset.form) return;
    event.preventDefault();
    var data = new FormData(form);

    if (form.dataset.form === "connection") {
      var config = {
        endpoint: String(data.get("endpoint") || "").trim(),
        token: String(data.get("token") || "").trim(),
        rememberDevice: data.get("rememberDevice") === "on",
        offlineCache: data.get("offlineCache") === "on"
      };
      if (Boolean(config.endpoint) !== Boolean(config.token)) {
        showToast("Enter both the endpoint and device token, or leave both blank");
        return;
      }
      try {
        var storage = config.rememberDevice ? localStorage : sessionStorage;
        var other = config.rememberDevice ? sessionStorage : localStorage;
        storage.setItem(CONFIG_KEY, JSON.stringify(config));
        other.removeItem(CONFIG_KEY);
        if (!config.offlineCache) localStorage.removeItem(SNAPSHOT_KEY);
        else localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(state.snapshot));
      } catch (error) {
        showToast("Browser storage is unavailable");
        return;
      }
      state.connection = config;
      state.sync = {
        mode: config.endpoint ? "connected" : "demo",
        lastSync: config.endpoint ? "Not tested" : "10:32 AM",
        message: config.endpoint ? "Ready to test" : "Demo workspace"
      };
      renderApp();
      showToast(config.endpoint ? "Connection saved on this device" : "Using demo workspace");
    }

    if (form.dataset.form === "pin") {
      var pin = String(data.get("pin") || "");
      var confirmPin = String(data.get("confirmPin") || "");
      if (!/^\d{6}$/.test(pin) || pin !== confirmPin) {
        showToast("Use the same 6-digit PIN in both fields");
        return;
      }
      if (!window.crypto || !crypto.subtle) {
        showToast("This browser requires a secure page to enable the privacy PIN");
        return;
      }
      var salt = crypto.getRandomValues(new Uint8Array(16));
      var saltBase64 = bytesToBase64(salt);
      pinVerifier(pin, saltBase64).then(function (verifier) {
        localStorage.setItem(PIN_KEY, JSON.stringify({ salt: saltBase64, verifier: verifier }));
        renderApp();
        showToast("Device privacy lock enabled");
      }).catch(function () { showToast("Could not enable the privacy lock in this browser"); });
    }

    if (form.dataset.form === "unlock") {
      var unlockPin = String(data.get("pin") || "");
      var raw = null;
      try { raw = localStorage.getItem(PIN_KEY); } catch (error) {}
      if (!raw) {
        state.locked = false;
        renderApp();
        return;
      }
      try {
        var record = JSON.parse(raw);
        pinVerifier(unlockPin, record.salt).then(function (verifier) {
          if (verifier !== record.verifier) throw new Error("Wrong PIN");
          state.locked = false;
          renderApp();
          showToast("FinanceOS unlocked");
        }).catch(function () {
          var input = document.getElementById("unlock-pin");
          if (input) { input.value = ""; input.focus(); }
          var button = document.getElementById("unlock-button");
          if (button) button.disabled = true;
          showToast("That PIN didn’t match");
        });
      } catch (error) { showToast("The saved lock is invalid; remove it from browser storage"); }
    }

    if (form.dataset.form === "transaction") {
      var draftTransaction = captureTransactionForm();
      var value = Number(draftTransaction.amount);
      var needsDestination = draftTransaction.kind === "transfer" || draftTransaction.kind === "investment";
      if (!draftTransaction.merchant.trim() || !Number.isFinite(value) || value <= 0 || !draftTransaction.accountId ||
          (needsDestination && (!draftTransaction.destinationAccountId || draftTransaction.destinationAccountId === draftTransaction.accountId))) {
        showToast("Complete the transaction details with two different accounts when needed");
        return;
      }
      var existing = state.snapshot.transactions.filter(function (item) { return item.id === state.editingId; })[0];
      var transaction = {
        id: existing ? existing.id : uid("txn"),
        date: draftTransaction.date + "T12:00:00+05:30",
        merchant: draftTransaction.merchant.trim(),
        note: draftTransaction.note.trim() || undefined,
        category: draftTransaction.category,
        amount: draftTransaction.kind === "income" || draftTransaction.kind === "refund" ? value : -value,
        accountId: draftTransaction.accountId,
        destinationAccountId: needsDestination ? draftTransaction.destinationAccountId : undefined,
        source: existing ? existing.source : "manual",
        status: "confirmed",
        kind: draftTransaction.kind
      };
      var exists = Boolean(existing);
      updateSnapshot(Object.assign({}, state.snapshot, {
        transactions: exists ? state.snapshot.transactions.map(function (item) { return item.id === transaction.id ? transaction : item; }) :
          [transaction].concat(state.snapshot.transactions)
      }));
      queueMutation("upsert_transaction", transaction);
      closeOverlay();
      showToast(exists ? "Transaction updated" : "Transaction added");
    }

    if (form.dataset.form === "reconcile") {
      var reconcileAccount = state.snapshot.accounts.filter(function (item) { return item.id === state.editingId; })[0];
      var reported = Number(data.get("amount"));
      if (!reconcileAccount || !Number.isFinite(reported)) {
        showToast("Enter a valid reported balance");
        return;
      }
      var signed = reconcileAccount.type === "credit" ? -Math.abs(reported) : reported;
      updateSnapshot(Object.assign({}, state.snapshot, {
        accounts: state.snapshot.accounts.map(function (account) {
          return account.id === reconcileAccount.id ? Object.assign({}, account, {
            balance: signed, reportedBalance: signed, reconciledAt: todayInIndia(), freshness: "Just now"
          }) : account;
        })
      }));
      queueMutation("reconcile_account", { accountId: reconcileAccount.id, reportedBalance: signed });
      closeOverlay();
      showToast(reconcileAccount.type === "investment" ? "Investment valuation updated" : "Account reconciled");
    }

    if (form.dataset.form === "budget") {
      var budgetId = state.editingId;
      var cap = Math.max(0, Number(data.get("cap")));
      if (!Number.isFinite(cap)) { showToast("Enter a valid budget cap"); return; }
      updateSnapshot(Object.assign({}, state.snapshot, {
        budgets: state.snapshot.budgets.map(function (budget) { return budget.id === budgetId ? Object.assign({}, budget, { cap: cap }) : budget; })
      }));
      queueMutation("upsert_budget", { id: budgetId, cap: cap });
      closeOverlay();
      showToast("Budget updated");
    }

    if (form.dataset.form === "new-budget") {
      var budgetName = String(data.get("name") || "").trim();
      var budgetCap = Number(data.get("cap"));
      var group = String(data.get("group") || "flex");
      if (!budgetName || !Number.isFinite(budgetCap) || budgetCap <= 0) { showToast("Enter a category name and positive cap"); return; }
      var budget = {
        id: uid("bud"), name: budgetName, group: group, cap: budgetCap, spent: 0,
        color: group === "fixed" ? "#557d9e" : group === "future" ? "#497b7a" : "#ce765e", rollover: 0
      };
      updateSnapshot(Object.assign({}, state.snapshot, { budgets: [budget].concat(state.snapshot.budgets) }));
      queueMutation("upsert_budget", budget);
      closeOverlay();
      showToast("Budget category added");
    }

    if (form.dataset.form === "account") {
      var accountName = String(data.get("name") || "").trim();
      var institution = String(data.get("institution") || "").trim();
      var accountType = String(data.get("type") || "bank");
      var opening = Number(data.get("balance"));
      var limit = Number(data.get("limit"));
      if (!accountName || !institution || !Number.isFinite(opening) || (accountType === "credit" && (!Number.isFinite(limit) || limit <= 0))) {
        showToast("Complete the account details");
        return;
      }
      var openingSigned = accountType === "credit" ? -Math.abs(opening) : opening;
      var account = {
        id: uid("acc"), name: accountName, institution: institution, type: accountType,
        last4: String(data.get("last4") || "") || undefined, balance: openingSigned, reportedBalance: openingSigned,
        limit: accountType === "credit" ? limit : undefined,
        color: accountType === "credit" ? "#a34848" : accountType === "investment" ? "#467b70" : accountType === "cash" ? "#96752f" : "#1f6b55",
        freshness: "Just now", reconciledAt: todayInIndia()
      };
      updateSnapshot(Object.assign({}, state.snapshot, { accounts: [account].concat(state.snapshot.accounts) }));
      queueMutation("upsert_account", {
        id: account.id, name: account.name, institution: account.institution, type: account.type, last4: account.last4,
        openingBalance: account.balance, reportedBalance: account.reportedBalance, limit: account.limit, color: account.color
      });
      closeOverlay();
      showToast("Account added to the ledger");
    }

    if (form.dataset.form === "recurring") {
      var recurringName = String(data.get("name") || "").trim();
      var recurringAmount = Number(data.get("amount"));
      var recurringAccount = String(data.get("accountId") || "");
      if (!recurringName || !recurringAccount || !Number.isFinite(recurringAmount) || recurringAmount <= 0) {
        showToast("Complete the obligation details");
        return;
      }
      var item = {
        id: uid("rec"), name: recurringName, category: String(data.get("category") || "Subscriptions"),
        amount: recurringAmount, dueDate: String(data.get("dueDate") || todayInIndia()), accountId: recurringAccount,
        cadence: String(data.get("cadence") || "monthly"), status: "upcoming", certainty: String(data.get("certainty") || "exact")
      };
      var nextRecurring = state.snapshot.recurring.concat([item]).sort(function (a, b) { return a.dueDate.localeCompare(b.dueDate); });
      updateSnapshot(Object.assign({}, state.snapshot, { recurring: nextRecurring }));
      queueMutation("upsert_recurring", item);
      closeOverlay();
      showToast("Upcoming obligation added");
    }
  });

  window.addEventListener("hashchange", function () {
    var view = location.hash.slice(1);
    if (NAV.some(function (item) { return item.key === view; }) && view !== state.view) {
      state.view = view;
      renderApp();
    }
  });

  window.addEventListener("online", function () {
    if (state.connection.endpoint) {
      state.sync.mode = "connected";
      state.sync.message = "Back online · sync when ready";
      renderApp();
    }
  });

  window.addEventListener("offline", function () {
    state.sync.mode = "offline";
    state.sync.message = "Offline snapshot";
    state.sync.lastSync = "Cached";
    renderApp();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.modal && !state.locked) closeOverlay();
  });

  loadState();
  renderApp();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register(new URL("./sw.js", document.baseURI)).catch(function () {});
  }
})();
