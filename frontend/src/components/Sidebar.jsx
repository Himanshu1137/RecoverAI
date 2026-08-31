function Sidebar({ page, setPage }) {
  const items = [
    ["dashboard", "Dashboard"],
    ["transactions", "Transactions"],
    ["recovery", "Recovery"],
    ["agent", "AI Agent"],
    ["analytics", "Analytics"]
  ];

  return (
    <aside className="sidebar">
      <div className="logo">RecoverAI</div>

      <nav>
        {items.map(([id, label]) => (
          <button
            key={id}
            className={
              page === id
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setPage(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;