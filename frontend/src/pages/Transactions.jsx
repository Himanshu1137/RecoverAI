import { useState } from "react";

import {
  addTransaction,
  uploadTransactionsCSV
} from "../services/api";


function Transactions() {
  const [form, setForm] = useState({
    transaction_id: "",
    customer_id: "",
    amount: "",
    payment_method: "UPI",
    failure_reason: "Network Error",
    attempt_number: 1,
    previous_success_rate: 0.5,
    customer_transaction_count: 0,
    customer_lifetime_value: 0
  });

  const [csvFile, setCsvFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);


  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const data = {
        ...form,

        amount: Number(form.amount),

        attempt_number:
          Number(form.attempt_number),

        previous_success_rate:
          Number(form.previous_success_rate),

        customer_transaction_count:
          Number(form.customer_transaction_count),

        customer_lifetime_value:
          Number(form.customer_lifetime_value)
      };

      const result =
        await addTransaction(data);

      setMessage(
        `${result.transaction_id} added successfully`
      );

      setForm({
        transaction_id: "",
        customer_id: "",
        amount: "",
        payment_method: "UPI",
        failure_reason: "Network Error",
        attempt_number: 1,
        previous_success_rate: 0.5,
        customer_transaction_count: 0,
        customer_lifetime_value: 0
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  async function handleCSVUpload(event) {
    event.preventDefault();

    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setCsvLoading(true);
      setMessage("");
      setError("");

      const result =
        await uploadTransactionsCSV(csvFile);

      setMessage(
        `CSV uploaded successfully. ${result.added} payments added, ${result.skipped} skipped.`
      );

      setCsvFile(null);

      const input =
        document.getElementById("csv-upload");

      if (input) {
        input.value = "";
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setCsvLoading(false);
    }
  }


  return (
    <div className="transaction-page">

      <div className="transaction-grid">

        {/* Manual Add */}

        <div className="transaction-form-card">

          <h2>Add Failed Payment</h2>

          <p>
            Manually add a failed transaction for
            AI-powered recovery analysis.
          </p>

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label>Transaction ID</label>

            <input
              name="transaction_id"
              value={form.transaction_id}
              onChange={handleChange}
              placeholder="TX9001"
              required
            />


            <label>Customer ID</label>

            <input
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              placeholder="CUST9001"
              required
            />


            <label>Amount</label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="12000"
              min="1"
              required
            />


            <label>Payment Method</label>

            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              <option value="UPI">
                UPI
              </option>

              <option value="Card">
                Card
              </option>

              <option value="NetBanking">
                Net Banking
              </option>

              <option value="Wallet">
                Wallet
              </option>
            </select>


            <label>Failure Reason</label>

            <select
              name="failure_reason"
              value={form.failure_reason}
              onChange={handleChange}
            >
              <option value="Network Error">
                Network Error
              </option>

              <option value="Insufficient Funds">
                Insufficient Funds
              </option>

              <option value="Bank Timeout">
                Bank Timeout
              </option>

              <option value="Authentication Failed">
                Authentication Failed
              </option>

              <option value="Payment Declined">
                Payment Declined
              </option>
            </select>


            <label>Attempt Number</label>

            <input
              type="number"
              name="attempt_number"
              value={form.attempt_number}
              onChange={handleChange}
              min="1"
            />


            <label>Previous Success Rate</label>

            <input
              type="number"
              name="previous_success_rate"
              value={form.previous_success_rate}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
            />


            <label>
              Customer Transaction Count
            </label>

            <input
              type="number"
              name="customer_transaction_count"
              value={
                form.customer_transaction_count
              }
              onChange={handleChange}
              min="0"
            />


            <label>
              Customer Lifetime Value
            </label>

            <input
              type="number"
              name="customer_lifetime_value"
              value={
                form.customer_lifetime_value
              }
              onChange={handleChange}
              min="0"
            />


            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Adding Payment..."
                : "Add Failed Payment"}
            </button>

          </form>

        </div>


        {/* CSV Upload */}

        <div className="csv-upload-card">

          <h2>Upload CSV</h2>

          <p>
            Upload multiple failed payments at once.
          </p>

          <form onSubmit={handleCSVUpload}>

            <div className="csv-drop-area">

              <strong>
                Select Failed Payments CSV
              </strong>

              <span>
                Upload a .csv file containing
                transaction data.
              </span>

              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={(event) =>
                  setCsvFile(
                    event.target.files[0]
                  )
                }
              />

            </div>


            {csvFile && (
              <div className="selected-file">
                Selected: {csvFile.name}
              </div>
            )}


            <button
              type="submit"
              disabled={csvLoading}
            >
              {csvLoading
                ? "Uploading CSV..."
                : "Upload CSV"}
            </button>

          </form>


          <div className="csv-format">

            <h3>Required CSV Columns</h3>

            <p>transaction_id</p>
            <p>customer_id</p>
            <p>amount</p>
            <p>payment_method</p>
            <p>failure_reason</p>
            <p>attempt_number</p>
            <p>previous_success_rate</p>
            <p>customer_transaction_count</p>
            <p>customer_lifetime_value</p>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Transactions;