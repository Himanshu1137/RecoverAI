function StatCard({ title, value, description }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </div>
  );
}

export default StatCard;
