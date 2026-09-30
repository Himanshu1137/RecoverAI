const transactions = [
  { id: "TX-8942", name: "Aarav Kumar", amount: "₹24,900", reason: "Network error", method: "UPI", score: 92, priority: "high" },
  { id: "TX-8938", name: "Priya Sharma", amount: "₹18,450", reason: "Insufficient funds", method: "Card", score: 84, priority: "high" },
  { id: "TX-8921", name: "Rahul Verma", amount: "₹12,700", reason: "Bank timeout", method: "Net banking", score: 71, priority: "medium" },
  { id: "TX-8914", name: "Neha Mehta", amount: "₹8,250", reason: "Limit exceeded", method: "Wallet", score: 58, priority: "low" },
  { id: "TX-8907", name: "Vikram Singh", amount: "₹31,200", reason: "Issuer unavailable", method: "Card", score: 89, priority: "high" },
  { id: "TX-8895", name: "Ananya Gupta", amount: "₹15,800", reason: "Authentication failed", method: "UPI", score: 76, priority: "medium" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
let activeModal = null;
let lastFocused = null;
let reviewingTransaction = null;
let apiToken = null;
const API_URL = window.RECOVERAI_API_URL || "http://127.0.0.1:8000";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function formatRupees(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (apiToken) headers.Authorization = "Bearer " + apiToken;
  const response = await fetch(API_URL + path, { ...options, headers });
  if (!response.ok) throw new Error("RecoverAI API request failed");
  return response.json();
}

async function connectDemoBackend() {
  try {
    const savedToken = localStorage.getItem("recoverai_token");
    if (savedToken) apiToken = savedToken;
    if (!apiToken) {
      const login = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@recoverai.local", password: "RecoverAI123!" })
      });
      apiToken = login.access_token;
      localStorage.setItem("recoverai_token", apiToken);
    }
    const [recovery, analytics] = await Promise.all([
      apiRequest("/api/agent/recommendations"),
      apiRequest("/api/analytics/summary")
    ]);
    hydrateDashboard(recovery.recommendations || [], analytics);
    document.body.dataset.api = "online";
  } catch {
    document.body.dataset.api = "demo";
  }
}

function hydrateDashboard(recommendations, analytics) {
  if (recommendations.length) {
    const fallbackNames = ["Aarav Kumar", "Priya Sharma", "Rahul Verma", "Neha Mehta", "Vikram Singh"];
    transactions.splice(0, transactions.length, ...recommendations.map((item, index) => ({
      id: item.transaction_id,
      name: fallbackNames[index] || "Customer " + (index + 1),
      amount: formatRupees(item.amount),
      reason: item.failure_reason,
      method: item.payment_method,
      score: item.recovery_probability,
      priority: String(item.priority).toLowerCase(),
      expectedRecovery: item.expected_recovery,
      recommendedAction: item.recommended_action
    })));
    const colors = ["c1", "c2", "c3", "c4", "c5"];
    $("#transactionRows").innerHTML = transactions.slice(0, 5).map((item, index) => {
      const initials = item.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
      return `<tr><td><strong>#${escapeHtml(item.id)}</strong><small>${escapeHtml(item.method)} · Live</small></td><td><span class="customer ${colors[index % colors.length]}">${escapeHtml(initials)}</span><strong>${escapeHtml(item.name)}</strong></td><td><strong>${escapeHtml(item.amount)}</strong></td><td>${escapeHtml(item.reason)}</td><td><div class="score"><span style="width:${Number(item.score)}%"></span></div><strong>${Number(item.score)}%</strong></td><td><span class="badge ${escapeHtml(item.priority)}">${escapeHtml(item.priority[0].toUpperCase() + item.priority.slice(1))}</span></td><td><button class="row-action" data-id="${escapeHtml(item.id)}">Review</button></td></tr>`;
    }).join("");
    $$(".row-action").forEach((button) => button.addEventListener("click", () => openReview(button.dataset.id)));
    renderCards();
    syncDashboardPanels();
  }

  if (analytics) {
    const values = $$(".stat .stat-meta strong");
    if (values[0]) values[0].textContent = formatRupees(analytics.at_risk_revenue);
    if (values[1]) values[1].textContent = Number(analytics.recovery_rate || 0).toFixed(1) + "%";
    if (values[2]) values[2].textContent = analytics.failed_payments;
    if (values[3]) values[3].textContent = analytics.successful_recoveries;
  }
}

function formatToday() {
  const value = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());
  $("#dateLabel").textContent = value.toUpperCase();
}

function setMenuOpen(isOpen) {
  const isMobile = window.innerWidth <= 900;
  $("#sidebar").classList.toggle("open", isMobile && isOpen);
  $("#sidebarBackdrop").classList.toggle("show", isMobile && isOpen);
  $("#menuBtn").setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isMobile && isOpen);
  document.body.classList.toggle("sidebar-collapsed", !isMobile && !isOpen);
}

let panelSyncFrame;
function syncDashboardPanels() {
  const queue = $(".priority-panel");
  const agent = $(".agent-card");
  if (!queue || !agent) return;
  agent.style.height = "";
  window.cancelAnimationFrame(panelSyncFrame);
  if (window.innerWidth <= 1250) return;
  panelSyncFrame = window.requestAnimationFrame(() => {
    agent.classList.remove("compact");
    agent.style.height = Math.ceil(queue.getBoundingClientRect().height) + "px";
    if (agent.scrollHeight > agent.clientHeight) agent.classList.add("compact");
  });
}

function setView(id) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  $$(".nav-item[data-view]").forEach((button) => {
    const selected = button.dataset.view === id;
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (window.innerWidth <= 900) setMenuOpen(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "dashboard") syncDashboardPanels();
}

function showModal(modal) {
  lastFocused = document.activeElement;
  activeModal = modal;
  modal.classList.add("open");
  modal.querySelector("button, input")?.focus();
}

function hideModal(modal) {
  modal.classList.remove("open");
  activeModal = null;
  lastFocused?.focus();
}

function toast(text) {
  $("#toast span").textContent = text;
  $("#toast").classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => $("#toast").classList.remove("show"), 2300);
}

function renderCards() {
  const query = ($("#tableSearch")?.value || "").trim().toLowerCase();
  const priority = $("#priorityFilter")?.value || "all";
  const filtered = transactions.filter((transaction) => {
    const matchesPriority = priority === "all" || transaction.priority === priority;
    return matchesPriority && Object.values(transaction).join(" ").toLowerCase().includes(query);
  });

  $("#transactionCount").textContent = filtered.length + (filtered.length === 1 ? " payment shown" : " payments shown");
  $("#transactionCards").innerHTML = filtered.length
    ? filtered.map((transaction) => `
      <article class="tx-card">
        <div class="tx-top"><strong>#${transaction.id}</strong><span class="badge ${transaction.priority}">${transaction.priority[0].toUpperCase() + transaction.priority.slice(1)}</span></div>
        <h3>${transaction.name}</h3>
        <p>${transaction.method} · ${transaction.reason}</p>
        <span class="amount">${transaction.amount}</span>
        <div class="tx-bottom"><span>AI recovery score</span><span class="tx-score">${transaction.score}%</span></div>
      </article>`
    ).join("")
    : '<p class="empty-state">No matching transactions found. Try a different search or priority.</p>';
}

function openReview(transactionId) {
  const transaction = transactions.find((item) => item.id === transactionId);
  if (!transaction) return;
  reviewingTransaction = transaction;
  $("#reviewTitle").textContent = "#" + transaction.id + " review";
  $("#reviewCustomer").textContent = transaction.name;
  $("#reviewAmount").textContent = transaction.amount;
  $("#reviewReason").textContent = transaction.reason;
  $("#reviewScore").textContent = transaction.score + "% · " + transaction.priority.toUpperCase();
  $("#reviewAdvice").textContent = transaction.score >= 80
    ? "Retry between 6:00–8:00 PM using the preferred " + transaction.method + " route."
    : "Send a payment reminder first, then retry in the next recommended window.";
  showModal($("#reviewModal"));
}

async function handleCsv(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".csv")) {
    toast("Please choose a valid CSV file");
    return;
  }
  hideModal($("#importModal"));
  if (apiToken) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiRequest("/api/transactions/upload-csv", { method: "POST", body: formData });
      toast(file.name + " analyzed — " + result.added + " payments added");
      connectDemoBackend();
    } catch {
      toast(file.name + " analyzed in demo mode");
    }
  } else {
    toast(file.name + " analyzed — 6 payments prioritized");
  }
  $("#fileInput").value = "";
}

const answers = {
  "Which payments should I prioritize?": "Prioritize TX-8942, TX-8907 and TX-8938. Together they represent ₹74,550 with an average 88% recovery score.",
  "Show best retry time": "The strongest retry window is 6:00–8:00 PM today, based on previous success patterns.",
  "Analyze failure patterns": "UPI network errors are the largest cluster today. Card insufficient-fund failures perform better after evening salary-credit hours.",
  "What is the best retry time?": "The best predicted retry window is today between 6:00 PM and 8:00 PM.",
  "Why are UPI payments failing?": "Most UPI failures are temporary network or authentication errors, making them strong candidates for a timed retry.",
  "Show high-value customers at risk": "Aarav Kumar, Vikram Singh and Priya Sharma are the top high-value customers needing action."
};

function agentAnswer(question) {
  return answers[question] || "Start with high-value transactions above 80% recovery probability, then schedule medium-priority retries for the recommended window.";
}

function sendSmall(question) {
  setView("agent");
  $("#bigAgentInput").value = question;
  $("#bigAgentInput").focus();
}

async function sendBig(question) {
  if (!question) return;
  const safeQuestion = question.replace(/[<>]/g, "");
  const history = $("#chatHistory");
  history.insertAdjacentHTML("beforeend", '<div class="chat user-chat"><p>' + safeQuestion + "</p></div>");
  $("#bigAgentInput").value = "";
  history.scrollTop = history.scrollHeight;
  window.setTimeout(async () => {
    let responseText = agentAnswer(question);
    if (apiToken) {
      try {
        const result = await apiRequest("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question })
        });
        responseText = result.answer || responseText;
      } catch {}
    }
    history.insertAdjacentHTML("beforeend", '<div class="chat bot-chat"><div class="bot"><svg><use href="#i-spark"/></svg></div><p>' + escapeHtml(responseText) + "</p></div>");
    history.scrollTop = history.scrollHeight;
  }, 250);
}

$$(".nav-item[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
$$("[data-jump]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.jump)));
$("#menuBtn").addEventListener("click", () => {
  const isOpen = window.innerWidth <= 900
    ? $("#sidebar").classList.contains("open")
    : !document.body.classList.contains("sidebar-collapsed");
  setMenuOpen(!isOpen);
});
$("#closeMenu").addEventListener("click", () => setMenuOpen(false));
$("#sidebarBackdrop").addEventListener("click", () => setMenuOpen(false));

try {
  if (localStorage.getItem("recoverai-theme") === "dark") document.body.classList.add("dark");
} catch {}
function updateThemeButton() {
  const isDark = document.body.classList.contains("dark");
  $("#themeBtn").setAttribute("aria-pressed", String(isDark));
  $("#themeBtn").setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}
updateThemeButton();
$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  updateThemeButton();
  try {
    localStorage.setItem("recoverai-theme", document.body.classList.contains("dark") ? "dark" : "light");
  } catch {}
});
$("#notificationBtn").addEventListener("click", () => toast("3 recovery alerts: 2 high-priority retries and 1 payment review."));

const importModal = $("#importModal");
$("#importBtn").addEventListener("click", () => showModal(importModal));
$("#importNav").addEventListener("click", () => showModal(importModal));
$$(".import-alt").forEach((button) => button.addEventListener("click", () => showModal(importModal)));
$("#modalClose").addEventListener("click", () => hideModal(importModal));
$("#reviewClose").addEventListener("click", () => hideModal($("#reviewModal")));
$$(".modal").forEach((modal) => modal.addEventListener("click", (event) => {
  if (event.target === modal) hideModal(modal);
}));

const dropZone = $(".drop-zone");
["dragenter", "dragover"].forEach((type) => dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  dropZone.classList.add("dragging");
}));
["dragleave", "drop"].forEach((type) => dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
}));
dropZone.addEventListener("drop", (event) => handleCsv(event.dataTransfer.files[0]));
$("#fileInput").addEventListener("change", (event) => handleCsv(event.target.files[0]));

$("#tableSearch").addEventListener("input", renderCards);
$("#priorityFilter").addEventListener("change", renderCards);
$("#globalSearch").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    setView("transactions");
    $("#tableSearch").value = event.target.value;
    renderCards();
    $("#tableSearch").focus();
  }
});

$$(".row-action").forEach((button) => button.addEventListener("click", () => openReview(button.dataset.id)));
$("#approveAction").addEventListener("click", async () => {
  if (apiToken && reviewingTransaction?.recommendedAction) {
    try {
      await apiRequest("/api/recovery/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: reviewingTransaction.id,
          action_type: reviewingTransaction.recommendedAction,
          expected_recovery: reviewingTransaction.expectedRecovery || 0,
          recovery_probability: reviewingTransaction.score
        })
      });
    } catch {}
  }
  hideModal($("#reviewModal"));
  toast("Recovery action approved and scheduled");
});
$(".notification").addEventListener("click", () => toast("No new alerts — system is healthy"));
$(".chart-panel select")?.addEventListener("change", (event) => toast("Chart updated to " + event.target.value));
$(".period-select")?.addEventListener("change", (event) => toast("Analytics updated to " + event.target.value));
$(".timeline-filter")?.addEventListener("click", () => toast("Showing all recovery outcomes"));
$$(".chart-click").forEach((item) => {
  item.addEventListener("click", () => toast(item.dataset.chartValue));
  if (item.tagName !== "BUTTON") {
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
      }
    });
  }
});

const chartTooltip = $("#chartTooltip");
function positionChartTooltip(item, event) {
  const rect = item.getBoundingClientRect();
  const x = event?.clientX ?? rect.left + rect.width / 2;
  const y = event?.clientY ?? rect.top;
  chartTooltip.style.left = Math.min(window.innerWidth - 12, Math.max(12, x)) + "px";
  chartTooltip.style.top = Math.max(12, y - 14) + "px";
}
function showChartTooltip(item, event) {
  chartTooltip.textContent = item.dataset.chartValue;
  chartTooltip.classList.add("show");
  positionChartTooltip(item, event);
}
function hideChartTooltip() {
  chartTooltip.classList.remove("show");
}
$$('[data-chart-value]').forEach((item) => {
  item.addEventListener("mouseenter", (event) => showChartTooltip(item, event));
  item.addEventListener("mousemove", (event) => positionChartTooltip(item, event));
  item.addEventListener("mouseleave", hideChartTooltip);
  item.addEventListener("focus", () => showChartTooltip(item));
  item.addEventListener("blur", hideChartTooltip);
});

$$(".suggestions button").forEach((button) => button.addEventListener("click", () => sendSmall(button.dataset.prompt)));
$("#bigAgentSend").addEventListener("click", () => sendBig($("#bigAgentInput").value.trim()));
$("#bigAgentInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") $("#bigAgentSend").click();
});
$$(".insight-list > button").forEach((button) => button.addEventListener("click", () => sendBig(button.textContent)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeModal) hideModal(activeModal);
  else if (event.key === "Escape" && $("#sidebar").classList.contains("open")) setMenuOpen(false);
  else if (event.key === "Escape" && window.innerWidth > 900 && !document.body.classList.contains("sidebar-collapsed")) setMenuOpen(false);
});

window.addEventListener("resize", () => {
  $("#sidebar").classList.remove("open");
  $("#sidebarBackdrop").classList.remove("show");
  document.body.classList.remove("menu-open");
  if (window.innerWidth <= 900) {
    document.body.classList.remove("sidebar-collapsed");
    $("#menuBtn").setAttribute("aria-expanded", "false");
  } else {
    $("#menuBtn").setAttribute("aria-expanded", String(!document.body.classList.contains("sidebar-collapsed")));
  }
});

formatToday();
if (window.innerWidth > 900) $("#menuBtn").setAttribute("aria-expanded", "true");
renderCards();
syncDashboardPanels();
window.addEventListener("resize", syncDashboardPanels);
connectDemoBackend();
