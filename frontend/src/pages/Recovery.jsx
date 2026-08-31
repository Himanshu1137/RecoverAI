import { useEffect, useState } from "react";
import RecoveryTable from "../components/RecoveryTable";
import { getRecommendations } from "../services/api";

function Recovery() {
  const [data, setData] = useState([]);

  async function load() {
    const result = await getRecommendations();
    setData(result.recommendations);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return (
    <div className="card-section">
      <h2>AI Recovery Opportunities</h2>
      <p>Approve a simulated recovery action for a failed payment.</p>
      {data.length ? (
        <RecoveryTable data={data} onRecovered={load} />
      ) : (
        <p>No recovery opportunities found.</p>
      )}
    </div>
  );
}

export default Recovery;
