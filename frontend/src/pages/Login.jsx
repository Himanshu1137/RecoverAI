import { useState } from "react";
import { loginMerchant } from "../services/api";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await loginMerchant(
        email,
        password
      );

      onLogin(result);
    } catch (err) {
      setError(
        err.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>RecoverAI</h1>

        <h2>Merchant Login</h2>

        <p>
          Sign in to manage failed payments
          and revenue recovery.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="merchant@example.com"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            required
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

        <p>
          Don't have a merchant account?{" "}
          <button
            type="button"
            onClick={onShowRegister}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;