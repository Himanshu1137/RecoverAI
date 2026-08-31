import { useState } from "react";
import { registerMerchant } from "../services/api";

function Register({ onShowLogin }) {
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    password: "",
    phone: "",
    business_type: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result =
        await registerMerchant(form);

      setMessage(
        `Merchant account created successfully. ID: ${result.merchant_id}`
      );

    } catch (err) {
      setError(
        err.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>RecoverAI</h1>

        <h2>Create Merchant Account</h2>

        <form onSubmit={handleSubmit}>

          <label>Business Name</label>

          <input
            name="business_name"
            value={form.business_name}
            onChange={updateField}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            minLength="8"
            required
          />

          <label>Phone</label>

          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
          />

          <label>Business Type</label>

          <input
            name="business_type"
            value={form.business_type}
            onChange={updateField}
            placeholder="Electronics"
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onShowLogin}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;