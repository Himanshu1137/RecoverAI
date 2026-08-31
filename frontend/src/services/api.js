const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


function getToken() {
  return localStorage.getItem("recoverai_token");
}


export function isLoggedIn() {
  return Boolean(getToken());
}


export function logoutMerchant() {
  localStorage.removeItem("recoverai_token");
  localStorage.removeItem("recoverai_merchant");
}


async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    let detail = fallbackMessage;

    try {
      const body = await response.json();
      detail = body.detail || fallbackMessage;
    } catch {}

    if (response.status === 401) {
      logoutMerchant();
    }

    throw new Error(detail);
  }

  return response.json();
}


async function authenticatedFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}


// -------------------------
// Merchant Registration
// -------------------------

export async function registerMerchant(data) {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return parseResponse(
    response,
    "Merchant registration failed"
  );
}


// -------------------------
// Merchant Login
// -------------------------

export async function loginMerchant(email, password) {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const result = await parseResponse(
    response,
    "Merchant login failed"
  );

  localStorage.setItem(
    "recoverai_token",
    result.access_token
  );

  localStorage.setItem(
    "recoverai_merchant",
    JSON.stringify({
      merchant_id: result.merchant_id,
      business_name: result.business_name,
    })
  );

  return result;
}


// -------------------------
// Current Merchant
// -------------------------

export async function getCurrentMerchant() {
  const response = await authenticatedFetch(
    `${API_URL}/api/auth/me`
  );

  return parseResponse(
    response,
    "Unable to load merchant profile"
  );
}


// -------------------------
// Recovery Recommendations
// -------------------------

export async function getRecommendations() {
  const response = await authenticatedFetch(
    `${API_URL}/api/agent/recommendations`
  );

  return parseResponse(
    response,
    "Failed to fetch recommendations"
  );
}


// -------------------------
// Recovery Simulation
// -------------------------

export async function simulateRecovery(payment) {
  const response = await authenticatedFetch(
    `${API_URL}/api/recovery/simulate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_id: payment.transaction_id,
        action_type: payment.recommended_action,
        expected_recovery: payment.expected_recovery,
        recovery_probability:
          payment.recovery_probability,
      }),
    }
  );

  return parseResponse(
    response,
    "Recovery simulation failed"
  );
}


// -------------------------
// Analytics
// -------------------------

export async function getAnalytics() {
  const response = await authenticatedFetch(
    `${API_URL}/api/analytics/summary`
  );

  return parseResponse(
    response,
    "Failed to fetch analytics"
  );
}


// -------------------------
// Gemini AI Agent
// -------------------------

export async function chatWithAgent(message) {
  const response = await authenticatedFetch(
    `${API_URL}/api/agent/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  return parseResponse(
    response,
    "AI Agent request failed"
  );
}
export async function addTransaction(data) {
  const response = await authenticatedFetch(
    `${API_URL}/api/transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return parseResponse(
    response,
    "Failed to add transaction"
  );
}
export async function uploadTransactionsCSV(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await authenticatedFetch(
    `${API_URL}/api/transactions/upload-csv`,
    {
      method: "POST",
      body: formData
    }
  );

  return parseResponse(
    response,
    "CSV upload failed"
  );
}