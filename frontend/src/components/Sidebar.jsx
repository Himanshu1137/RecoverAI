import { BarChart3, Bot, CreditCard, Gauge, LogOut, Sparkles, TrendingUp, Upload, X } from "lucide-react";

const items = [
  ["dashboard", "Dashboard", Gauge],
  ["transactions", "Transactions", CreditCard],
  ["recovery", "Recovery", TrendingUp],
  ["agent", "AI Recovery Agent", Bot],
  ["analytics", "Analytics", BarChart3]
];

function Sidebar({ page, setPage, open, onClose, onLogout }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="brand-row">
        <div className="brand-mark"><Sparkles size={24} /></div>
        <div className="brand-copy"><strong>Recover<span>AI</span></strong><small>Revenue Intelligence</small></div>
        <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu"><X /></button>
      </div>

      <p className="nav-label">WORKSPACE</p>
      <nav>
        {items.map(([id, label, Icon]) => (
          <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
            <span className={`nav-icon nav-${id}`}><Icon size={19} /></span><span>{label}</span>
            {id === "transactions" && <b className="nav-badge">12</b>}
          </button>
        ))}
      </nav>

      <p className="nav-label">ACTIONS</p>
      <button className="nav-item" onClick={() => setPage("transactions")}>
        <span className="nav-icon nav-import"><Upload size={19} /></span><span>Import Payments</span>
      </button>

      <div className="sidebar-spacer" />
      <div className="health-card"><span><i /> System healthy</span><strong>98%</strong><div><b /></div><small>Prediction API and agent online</small></div>
      <button className="nav-item logout-nav" onClick={onLogout}><span className="nav-icon"><LogOut size={18} /></span>Sign out</button>
    </aside>
  );
}

export default Sidebar;
