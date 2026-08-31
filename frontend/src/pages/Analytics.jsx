import { useEffect, useState } from "react";
import { getAnalytics } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";


function Analytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const result = await getAnalytics();
        setStats(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load analytics.");
      }
    }

    loadAnalytics();
  }, []);


  if (error) {
    return <p>{error}</p>;
  }

  if (!stats) {
    return <p>Loading analytics...</p>;
  }


  const revenueData = [
    {
      stage: "Before RecoverAI",
      revenue: stats.before_at_risk_revenue
    },
    {
      stage: "After RecoverAI",
      revenue: stats.after_at_risk_revenue
    }
  ];


  return (
    <div>

      <div className="card-section">

        <h2>Business Impact</h2>

        <p>
          See how RecoverAI reduces payment risk
          and recovers lost revenue.
        </p>


        <div className="analytics-grid">

          <Stat
            title="Revenue Saved"
            value={`INR ${stats.revenue_saved.toLocaleString()}`}
          />

          <Stat
            title="Successful Recoveries"
            value={stats.successful_recoveries}
          />

          <Stat
            title="Recovery Rate"
            value={`${stats.recovery_rate}%`}
          />

          <Stat
            title="Remaining At-Risk"
            value={`INR ${stats.after_at_risk_revenue.toLocaleString()}`}
          />

        </div>

      </div>


      <div className="card-section">

        <h2>Before vs After RecoverAI</h2>

        <div className="analytics-grid">

          <Stat
            title="Failed Payments Before"
            value={stats.before_failed_payments}
          />

          <Stat
            title="Failed Payments After"
            value={stats.after_failed_payments}
          />

          <Stat
            title="At-Risk Revenue Before"
            value={`INR ${stats.before_at_risk_revenue.toLocaleString()}`}
          />

          <Stat
            title="At-Risk Revenue After"
            value={`INR ${stats.after_at_risk_revenue.toLocaleString()}`}
          />

        </div>

      </div>


      <div className="card-section">

        <h2>Revenue Risk Reduction</h2>

        <div className="chart">

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={revenueData}>

              <CartesianGrid />

              <XAxis
                dataKey="stage"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `INR ${Number(value).toLocaleString()}`
                }
              />

              <Bar
                dataKey="revenue"
                name="At-Risk Revenue"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      <div className="card-section">

        <h2>Recovery Performance</h2>

        <div className="analytics-grid">

          <Stat
            title="Expected Recovery"
            value={`INR ${stats.expected_recovery.toLocaleString()}`}
          />

          <Stat
            title="Recovered Revenue"
            value={`INR ${stats.recovered_revenue.toLocaleString()}`}
          />

          <Stat
            title="Failed Payments Remaining"
            value={stats.failed_payments}
          />

          <Stat
            title="Current At-Risk Revenue"
            value={`INR ${stats.at_risk_revenue.toLocaleString()}`}
          />

        </div>

      </div>

    </div>
  );
}


function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}


export default Analytics;