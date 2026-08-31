import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Recovery from "./pages/Recovery";
import Agent from "./pages/Agent";
import Analytics from "./pages/Analytics";

import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  isLoggedIn,
  logoutMerchant
} from "./services/api";


function App() {
  const [page, setPage] = useState("dashboard");

  const [authenticated, setAuthenticated] =
    useState(isLoggedIn());

  const [authPage, setAuthPage] =
    useState("login");


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
    if (authPage === "register") {
      return (
        <Register
          onShowLogin={() =>
            setAuthPage("login")
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() =>
          setAuthPage("register")
        }
      />
    );
  }


  return (
    <div className="app">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="main">

        <Header
          page={page}
          onLogout={handleLogout}
        />

        <div className="content">

          {page === "dashboard" && (
            <Dashboard />
          )}

          {page === "transactions" && (
            <Transactions />
          )}

          {page === "recovery" && (
            <Recovery />
          )}

          {page === "agent" && (
            <Agent />
          )}

          {page === "analytics" && (
            <Analytics />
          )}

        </div>
      </main>
    </div>
  );
}

export default App;