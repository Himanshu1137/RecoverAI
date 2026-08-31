import { useEffect, useState } from "react";
import { getCurrentMerchant } from "../services/api";

function Header({ page, onLogout }) {
  const titles = {
    dashboard: "Revenue Recovery Overview",
    recovery: "Recovery Opportunities",
    agent: "RecoverAI Agent",
    analytics: "Recovery Analytics"
  };

  const [merchant, setMerchant] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    async function loadMerchant() {
      try {
        const data = await getCurrentMerchant();
        setMerchant(data);
      } catch (error) {
        console.error("Unable to load merchant profile:", error);
      }
    }

    loadMerchant();
  }, []);

  return (
    <header className="header">
      <div>
        <h1>{titles[page]}</h1>
        <p>AI-powered revenue recovery dashboard</p>
      </div>

      <div className="merchant-actions">
        <div className="merchant-profile-wrapper">

          <button
            className="merchant"
            onClick={() => setShowProfile(!showProfile)}
          >
            {merchant?.business_name || "Merchant Account"}
          </button>

          {showProfile && merchant && (
            <div className="merchant-profile-card">

              <h3>Merchant Profile</h3>

              <div className="profile-row">
                <span>Business Name</span>
                <strong>{merchant.business_name}</strong>
              </div>

              <div className="profile-row">
                <span>Merchant ID</span>
                <strong>{merchant.merchant_id}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>{merchant.email}</strong>
              </div>

              <div className="profile-row">
                <span>Phone</span>
                <strong>{merchant.phone || "Not provided"}</strong>
              </div>

              <div className="profile-row">
                <span>Business Type</span>
                <strong>{merchant.business_type || "Not provided"}</strong>
              </div>

              <div className="profile-row">
                <span>Status</span>
                <strong>{merchant.status}</strong>
              </div>

            </div>
          )}
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;