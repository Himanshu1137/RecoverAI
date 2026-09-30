import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Recovery from "./pages/Recovery";
import Agent from "./pages/Agent";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { isLoggedIn, logoutMerchant } from "./services/api";

function App() {
  const [page, setPage] = useState("dashboard");
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const [authPage, setAuthPage] = useState("login");
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 900);
  const [theme, setTheme] = useState(() => localStorage.getItem("recoverai_theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("recoverai_theme", theme);
  }, [theme]);

  useEffect(() => {
    const closeOnMobile = () => {
      if (window.innerWidth <= 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", closeOnMobile);
    return () => window.removeEventListener("resize", closeOnMobile);
  }, []);

  function navigate(nextPage) {
    setPage(nextPage);
    if (window.innerWidth <= 900) setSidebarOpen(false);
  }

  function handleLogin() {
    setAuthenticated(true);
    setPage("dashboard");
  }

  function handleLogout() {
    logoutMerchant();
    setAuthenticated(false);
    setAuthPage("login");
    setPage("dashboard");
  }

  if (!authenticated) {
    return authPage === "register" ? (
      <Register onShowLogin={() => setAuthPage("login")} />
    ) : (
      <Login onLogin={handleLogin} onShowRegister={() => setAuthPage("register")} />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      {sidebarOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

      <main className="main">
        <Header
          page={page}
          setPage={navigate}
          onLogout={handleLogout}
          onMenu={() => setSidebarOpen((value) => !value)}
          theme={theme}
          onToggleTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")}
        />
        <div className="content">
          {page === "dashboard" && <Dashboard setPage={navigate} />}
          {page === "transactions" && <Transactions />}
          {page === "recovery" && <Recovery />}
          {page === "agent" && <Agent />}
          {page === "analytics" && <Analytics />}
        </div>
      </main>
    </div>
  );
}

export default App;
