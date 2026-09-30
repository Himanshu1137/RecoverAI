import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "dist/index.html"), "utf8");
const js = readFileSync(join(root, "dist/app.js"), "utf8");
const css = readFileSync(join(root, "dist/styles.css"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert(ids.length === new Set(ids).size, "Duplicate HTML IDs detected");

for (const asset of ["styles.css", "app.js"]) {
  assert(existsSync(join(root, "dist", asset)), "Missing asset: " + asset);
}

for (const match of html.matchAll(/data-view="([^"]+)"/g)) {
  assert(ids.includes(match[1]), "Navigation target missing: " + match[1]);
}

for (const match of html.matchAll(/data-jump="([^"]+)"/g)) {
  assert(ids.includes(match[1]), "Jump target missing: " + match[1]);
}

for (const match of js.matchAll(/\$\("#([^"]+)"\)/g)) {
  const targetId = match[1].split(" ")[0];
  assert(ids.includes(targetId), "JavaScript target missing: #" + targetId);
}

const priorityStart = html.indexOf('class="panel priority-panel"');
const tableEnd = html.indexOf("</table>", priorityStart);
const viewAll = html.indexOf("View all transactions", priorityStart);
assert(priorityStart >= 0 && tableEnd >= 0 && viewAll > tableEnd, "View all transactions must remain below the priority table");
const dashboardRows = [...html.slice(priorityStart, tableEnd).matchAll(/class="row-action"/g)].length;
assert(dashboardRows === 5, "Dashboard must show exactly five priority payments");

assert(css.includes("@media(max-width:650px)"), "Mobile responsive rules missing");
assert(css.includes("button:focus-visible"), "Keyboard focus styles missing");
assert(css.includes("td:nth-child(2){display:table-cell}"), "Customer row divider alignment fix missing");
assert(css.includes(".priority-panel tbody tr{height:66px}"), "Uniform dashboard row height missing");
assert(css.includes("body.dark .nav-item svg{color:#fff"), "Dark-mode workspace icon visibility missing");
assert(html.includes('class="direct-icon"') && css.includes(".direct-icon{display:block;fill:none!important;stroke:currentColor!important"), "Marked navigation icons must remain visible");
assert(html.includes('id="sidebarBackdrop"') && js.includes("setMenuOpen"), "Mobile menu backdrop or toggle behavior missing");
assert(css.includes(".sidebar-collapsed .sidebar{transform:translateX(-100%)}") && js.includes('document.body.classList.toggle("sidebar-collapsed"'), "Desktop sidebar close and reopen behavior missing");
assert(css.includes(".priority-panel thead{display:none}") && css.includes('content:"Transaction"'), "Mobile priority queue card layout missing");
assert(css.includes("main{width:100%;max-width:100vw;min-width:0;overflow-x:hidden}"), "Mobile dashboard overflow containment missing");
assert(html.includes('id="notificationBtn"') && html.includes("theme-sun") && css.includes(".top-actions .mobile-header-action{display:grid"), "Mobile notification and theme controls missing");
assert(js.includes("updateThemeButton") && js.includes('$("#notificationBtn").addEventListener'), "Mobile header actions must be interactive");
assert(css.includes("body.dark .chat.bot-chat p{background:#242d46;color:#f4f6fb"), "Dark-mode Recovery Agent answer contrast missing");
assert(css.includes(".dashboard-grid{align-items:start}") && js.includes("syncDashboardPanels"), "Dashboard queue and AI panel height alignment missing");
assert(css.includes(".queue-footer{padding:12px 18px"), "Priority queue footer spacing was not compacted");
assert(css.includes(".close-menu,.modal-close{color:#fff;background:#7257f5"), "Close icons need a visible high-contrast style");
assert(html.includes("dashboard-analytics-icon") && html.includes("chartTooltip"), "Dashboard analytics icons or chart tooltip missing");
assert(html.includes("performance-summary") && html.includes("recovered-icon") && html.includes("failed-icon"), "Recovery performance icon metrics missing");
assert(!html.includes('title-with-icon"><span class="section-icon dashboard-analytics-icon"><svg><use href="#i-chart"'), "Recovery performance blank icon box must be removed");
assert(html.includes("Open AI Recovery Agent") && !html.includes('id="agentInput"'), "Dashboard copilot must use a direct AI workspace action instead of a search input");
assert(js.includes('setView("agent")') && js.includes('$("#bigAgentInput").value = question'), "Dashboard copilot suggestions must open and prefill the AI Recovery Agent");
assert([...html.matchAll(/class="trend-point chart-hover"/g)].length === 4, "Analytics trend must expose four hoverable amount points");
assert(js.includes("showChartTooltip") && js.includes("agent.classList.add(\"compact\")"), "Chart hover values or compact agent fallback missing");
assert(html.includes('role="dialog"') && html.includes('aria-modal="true"'), "Accessible dialogs missing");
assert(html.includes("agent-flow") && html.includes("section-icon") && html.includes("data-chart-value"), "AI flow, analytics icons or chart values missing");
assert(js.includes("handleCsv") && js.includes("openReview") && js.includes("renderCards") && js.includes("period-select") && js.includes('$$(".chart-click")'), "Core interactions missing");

console.log("RecoverAI QA passed: navigation, assets, IDs, responsive styles, dialogs, filters, CSV and review flows verified.");
