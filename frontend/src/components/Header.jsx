import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Moon, Search, Sun, Upload, X } from "lucide-react";
import { getCurrentMerchant } from "../services/api";

function Header({ page, setPage, onLogout, onMenu, theme, onToggleTheme }) {
  const [merchant, setMerchant] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef(null);

  useEffect(() => { getCurrentMerchant().then(setMerchant).catch(console.error); }, []);
  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    if (search.trim()) setPage("recovery");
  }

  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open or close menu"><Menu /></button>
      <form className="search-box" onSubmit={submitSearch}>
        <Search size={19} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transaction or customer..." aria-label="Search" />
        {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={17} /></button>}
      </form>
      <div className="top-actions">
        <button className="icon-button" onClick={onToggleTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun /> : <Moon />}</button>
        <div className="notice-wrap">
          <button className="icon-button has-alert" onClick={() => setShowNotices((v) => !v)} aria-label="Notifications"><Bell /></button>
          {showNotices && <div className="popover notice-popover"><strong>Notifications</strong><p>5 high-priority payments are ready for review.</p><p>Recovery performance is up this week.</p></div>}
        </div>
        <button className="primary-button import-button" onClick={() => setPage("transactions")}><Upload size={17} /> Import payments</button>
        <div className="merchant-profile-wrapper" ref={profileRef}>
          <button className="avatar" onClick={() => setShowProfile((v) => !v)} aria-label="Merchant profile">{(merchant?.business_name || "M").charAt(0).toUpperCase()}</button>
          {showProfile && <div className="merchant-profile-card">
            <h3>Merchant Profile</h3>
            <div className="profile-row"><span>Business Name</span><strong>{merchant?.business_name || "Merchant Account"}</strong></div>
            <div className="profile-row"><span>Email</span><strong>{merchant?.email || "—"}</strong></div>
            <div className="profile-row"><span>Status</span><strong>{merchant?.status || "Active"}</strong></div>
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>}
        </div>
      </div>
      <span className="sr-only">Current page: {page}</span>
    </header>
  );
}

export default Header;

