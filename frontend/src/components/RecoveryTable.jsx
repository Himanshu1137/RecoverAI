import { Fragment, useState } from "react";
import { simulateRecovery } from "../services/api";

function RecoveryTable({ data, onRecovered }) {
  const [running, setRunning] = useState(null);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(null);

  async function handleRecovery(payment) {
    setRunning(payment.transaction_id);
    setMessage("");

    try {
      const result = await simulateRecovery(payment);

      setMessage(
        `${result.transaction_id}: ${result.outcome} - INR ${result.recovered_amount}`
      );

      if (result.outcome === "SUCCESS") {
        onRecovered?.();
      }
    } catch (error) {
      setMessage(
        error.message || "Recovery action failed."
      );
    } finally {
      setRunning(null);
    }
  }

  function toggleExplanation(transactionId) {
    setExpanded(
      expanded === transactionId
        ? null
        : transactionId
    );
  }

  return (
    <div className="table-container">
      {message && (
        <div className="notice">
          {message}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Probability</th>
            <th>Priority</th>
            <th>Expected Recovery</th>
            <th>ML Explanation</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((payment) => (
            <Fragment key={payment.transaction_id}>
              <tr>
                <td>
                  {payment.transaction_id}
                </td>

                <td>
                  INR {payment.amount}
                </td>

                <td>
                  {payment.recovery_probability}%
                </td>

                <td>
                  <span
                    className={`priority ${payment.priority.toLowerCase()}`}
                  >
                    {payment.priority}
                  </span>
                </td>

                <td>
                  INR {payment.expected_recovery}
                </td>

                <td>
                  <button
                    className="small-button"
                    onClick={() =>
                      toggleExplanation(
                        payment.transaction_id
                      )
                    }
                  >
                    {expanded === payment.transaction_id
                      ? "Hide"
                      : "Why?"}
                  </button>
                </td>

                <td>
                  <button
                    className="small-button"
                    disabled={
                      running ===
                      payment.transaction_id
                    }
                    onClick={() =>
                      handleRecovery(payment)
                    }
                  >
                    {running === payment.transaction_id
                      ? "Processing..."
                      : "Approve"}
                  </button>
                </td>
              </tr>

              {expanded ===
                payment.transaction_id && (
                <tr
                  key={`${payment.transaction_id}-explanation`}
                >
                  <td colSpan="7">
                    <div className="ml-explanation">
                      <strong>
                        Why this ML prediction?
                      </strong>

                      {payment.explanation?.length ? (
                        <ul>
                          {payment.explanation.map(
                            (reason, index) => (
                              <li key={index}>
                                {reason}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>
                          No explanation available.
                        </p>
                      )}

                      <p>
                        <strong>
                          Recommended Action:
                        </strong>{" "}
                        {
                          payment.recommended_action
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecoveryTable;
