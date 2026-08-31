import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  getAnalytics,
  getRecommendations
} from "../services/api";


function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [analytics, recovery] = await Promise.all([
        getAnalytics(),
        getRecommendations()
      ]);

      setStats(analytics);

      setRecommendations(
        recovery.recommendations || []
      );

    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadDashboard();
  }, []);


  if (loading) {
    return <p>Loading dashboard...</p>;
  }


  if (error) {
    return (
      <div className="card-section">
        <h2>Dashboard Error</h2>
        <p>{error}</p>
      </div>
    );
  }


  return (
    <div>

      <div className="stats">

        <StatCard
          title="Failed Payments"
          value={stats.failed_payments}
          description="Total failed transactions"
        />

        <StatCard
          title="At-Risk Revenue"
          value={`INR ${stats.at_risk_revenue.toLocaleString()}`}
          description="Failed payment value"
        />

        <StatCard
          title="Expected Recovery"
          value={`INR ${stats.expected_recovery.toLocaleString()}`}
          description="ML predicted recovery"
        />

        <StatCard
          title="Recovered Revenue"
          value={`INR ${stats.recovered_revenue.toLocaleString()}`}
          description="Successfully recovered"
        />

      </div>


      <div className="card-section">

        <h2>Top Recovery Opportunities</h2>

        <p>
          AI-ranked failed payments with the highest
          recovery potential.
        </p>


        {recommendations.length === 0 ? (

          <p>No recovery opportunities found.</p>

        ) : (

          recommendations
            .slice(0, 5)
            .map((payment) => (

              <div
                className="opportunity"
                key={payment.transaction_id}
              >

                <div>

                  <strong>
                    {payment.transaction_id}
                  </strong>

                  <span>
                    {payment.payment_method}
                    {" • "}
                    {payment.recovery_probability}%
                    {" • "}
                    {payment.priority}
                  </span>

                  <span>
                    {payment.recommended_action}
                  </span>

                </div>


                <div>

                  <strong>
                    INR{" "}
                    {payment.expected_recovery.toLocaleString()}
                  </strong>

                  <span>
                    Expected Recovery
                  </span>

                </div>

              </div>

            ))
        )}

      </div>

    </div>
  );
}


export default Dashboard;