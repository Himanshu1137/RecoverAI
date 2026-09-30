import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowRight, Bot, CheckCircle2, CreditCard, IndianRupee,
  Lightbulb, Sparkles, TrendingUp
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";
import { getAnalytics, getRecommendations } from "../services/api";

const names = ["Aarav Kumar", "Priya Sharma", "Rahul Verma", "Neha Mehta", "Vikram Singh"];
const colors = ["#7c5cff", "#ff6b79", "#0db8c4", "#29bf77", "#945eea"];
const weekData = [
  { day: "Mon", recovered: 50000, failed: 18000 },
  { day: "Tue", recovered: 66000, failed: 26000 },
  { day: "Wed", recovered: 47000, failed: 15000 },
  { day: "Thu", recovered: 75000, failed: 22000 },
  { day: "Fri", recovered: 61000, failed: 13000 },
  { day: "Sat", recovered: 82000, failed: 17000 },
  { day: "Sun", recovered: 72000, failed: 11000 }
];
const breakdown = [
  { name: "UPI", value: 42, color: "#7654f6" },
  { name: "Cards", value: 31, color: "#08b8bf" },
  { name: "Net banking", value: 17, color: "#ffad19" },
  { name: "Wallets", value: 10, color: "#ff6375" }
];

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Dashboard({ setPage }) {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAnalytics(), getRecommendations()])
      .then(([analytics, recovery]) => {
        setStats(analytics);
        setRecommendations(recovery.recommendations || []);
      })
      .catch((err) => setError(err.message || "Unable to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const cards = useMemo(() => stats ? [
    { title: "Recoverable revenue", value: money(stats.at_risk_revenue), detail: "↑ 18.2% from last month", icon: CreditCard, tone: "violet" },
    { title: "Recovery success rate", value: `${stats.recovery_rate || 0}%`, detail: "↑ 6.1% this week", icon: TrendingUp, tone: "cyan" },
    { title: "Failed payments", value: stats.failed_payments, detail: "High-priority queue", icon: AlertTriangle, tone: "rose" },
    { title: "AI actions today", value: stats.successful_recoveries || 0, detail: "Recommended actions ready", icon: Sparkles, tone: "amber" }
  ] : [], [stats]);

  if (loading) return <div className="loading-card">Loading recovery intelligence…</div>;
  if (error) return <div className="error-card"><AlertTriangle /> <div><strong>Dashboard could not load</strong><p>{error}</p></div></div>;

  return (
    <div className="dashboard-page">
      <section className="page-intro">
        <p className="eyebrow">RECOVERY COMMAND CENTER</p>
        <h1>Revenue recovery overview</h1>
        <p>Prioritize failed payments with intelligent scoring and AI-guided actions.</p>
      </section>

      <section className="metric-grid">
        {cards.map(({ title, value, detail, icon: Icon, tone }) => (
          <article className={`metric-card ${tone}`} key={title}>
            <span className="metric-icon"><Icon /></span>
            <div><p>{title}</p><h2>{value}</h2><small>{detail}</small></div>
          </article>
        ))}
      </section>

      <section className="dashboard-split">
        <article className="panel queue-panel">
          <div className="panel-heading"><div><h2>Priority recovery queue</h2><p>AI-ranked by recovery probability and value</p></div><span className="live-pill"><i /> Live</span></div>
          <div className="table-container queue-table">
            <table>
              <thead><tr><th>Transaction</th><th>Customer</th><th>Amount</th><th>Reason</th><th>AI score</th><th>Priority</th><th /></tr></thead>
              <tbody>
                {recommendations.slice(0, 5).map((payment, index) => (
                  <tr key={payment.transaction_id}>
                    <td><strong>#{payment.transaction_id}</strong><small>{payment.payment_method}</small></td>
                    <td><span className="customer"><i style={{ background: colors[index] }}>{names[index]?.split(" ").map((n) => n[0]).join("")}</i>{names[index]}</span></td>
                    <td><strong>{money(payment.amount)}</strong></td>
                    <td>{payment.failure_reason}</td>
                    <td><span className="score"><i><b style={{ width: `${payment.recovery_probability}%` }} /></i>{payment.recovery_probability}%</span></td>
                    <td><span className={`priority ${payment.priority.toLowerCase()}`}>{payment.priority}</span></td>
                    <td><button className="review-button" onClick={() => setPage("recovery")}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="view-all-button" onClick={() => setPage("recovery")}>View all transactions <ArrowRight size={16} /></button>
        </article>

        <article className="copilot-card">
          <div className="copilot-top"><span><Bot /></span><div><small>AI AGENT</small><strong><i /> Online</strong></div></div>
          <div><h2>Recovery copilot</h2><p>Make faster decisions with explainable AI recommendations.</p></div>
          <div className="copilot-stats"><div><span>High-confidence value</span><strong>{money(stats.expected_recovery)}</strong></div><div><span>Recommended actions</span><strong>{recommendations.length}</strong></div></div>
          <div className="insight-box"><Lightbulb /><div><b>TOP INSIGHT</b><p>Retrying high-confidence payments during peak response hours may improve recovery outcomes.</p></div></div>
          <button className="agent-cta" onClick={() => setPage("agent")}><span><Sparkles /></span><div><strong>Open AI Recovery Agent</strong><small>Ask questions and review recommendations</small></div><ArrowRight /></button>
        </article>
      </section>

      <section className="analytics-row">
        <article className="panel performance-panel">
          <div className="panel-heading"><div className="title-with-icon"><span className="soft-icon violet"><TrendingUp /></span><div><h2>Recovery performance</h2><p>Recovered vs failed revenue · last 7 days</p></div></div><button className="range-button">Last 7 days</button></div>
          <div className="mini-stats"><div><CheckCircle2 /><span>Recovered this week<strong>{money(stats.recovered_revenue)}</strong></span></div><div><AlertTriangle /><span>Expected recovery<strong>{money(stats.expected_recovery)}</strong></span></div></div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={weekData} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}K`} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [money(value), name === "recovered" ? "Recovered" : "Failed"]} cursor={{ fill: "rgba(124,92,255,.08)" }} />
                <Bar dataKey="recovered" fill="#7654f6" radius={[7, 7, 0, 0]} />
                <Bar dataKey="failed" fill="#ffad19" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel breakdown-panel">
          <div className="title-with-icon"><span className="soft-icon cyan"><CreditCard /></span><div><h2>Failure breakdown</h2><p>By payment method</p></div></div>
          <div className="donut-layout">
            <div className="donut-wrap"><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={breakdown} dataKey="value" innerRadius={60} outerRadius={88} paddingAngle={1}>{breakdown.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart></ResponsiveContainer><span><strong>{stats.failed_payments}</strong><small>Total failed</small></span></div>
            <div className="legend-list">{breakdown.map((item) => <div key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><strong>{item.value}%</strong></div>)}</div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;

