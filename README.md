


# RecoverAI – Intelligent Revenue Recovery Agent

RecoverAI is an AI-powered failed payment recovery platform that uses Machine Learning and Gemini AI to prioritize failed transactions, recommend recovery actions, and track recovered revenue.

## 🚀 Overview

Failed digital payments can result in significant revenue loss for businesses. RecoverAI helps merchants identify high-potential recovery opportunities and take smarter, data-driven recovery decisions.

The platform combines Machine Learning, Gemini AI, FastAPI, React, and PostgreSQL to provide intelligent payment recovery recommendations and business analytics.

---

## 🎯 Problem Statement

Businesses often face revenue loss because of failed digital payments.

Traditional recovery systems do not clearly identify:

- Which failed payment should be prioritized
- Which transaction has the highest recovery probability
- What recovery action should be taken
- How much revenue can potentially be recovered

RecoverAI solves these problems using AI and Machine Learning.

---

## 💡 Solution

RecoverAI analyzes failed transactions and generates:

- Recovery probability
- Priority level
- Expected recovery amount
- Recommended recovery action
- Human-readable prediction explanation

It also provides an AI-powered assistant that helps merchants understand their recovery data using natural language.

---

## ✨ Key Features

- 🤖 AI-powered failed payment analysis
- 📊 Machine Learning recovery probability prediction
- 🎯 High-value transaction prioritization
- 💡 Explainable recovery recommendations
- 🧠 Gemini AI Recovery Agent
- 📁 Bulk failed-payment CSV upload
- ➕ Manual failed-payment entry
- 🔄 Recovery action simulation
- 💰 Recovered revenue tracking
- 📈 Business recovery analytics
- 🔐 JWT-based authentication
- 👤 Merchant registration and login
- 🏢 Merchant-specific data isolation
- 📋 Individual merchant profile

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- CSS

### Backend
- Python
- FastAPI
- REST APIs

### Database
- PostgreSQL
- SQLAlchemy

### Machine Learning
- Scikit-learn

### Artificial Intelligence
- Gemini AI
- Function / Tool Calling

### Security
- JWT Authentication
- Password Hashing

---

## 🏗️ System Architecture

```text
                Merchant
                   |
                   v
             React Frontend
                   |
                   v
              FastAPI API
                   |
          ---------------------
          |                   |
          v                   v
     PostgreSQL          ML Recovery Model
          |                   |
          |                   v
          |          Recovery Probability
          |          Priority & Recommendation
          |
          v
     Gemini AI Agent
          |
          v
   Recovery Insights
          |
          v
     Analytics Dashboard
````

---

## 🔄 How RecoverAI Works

```text
Failed Payment
      |
      v
Transaction Analysis
      |
      v
Machine Learning Model
      |
      v
Recovery Probability
      |
      v
Priority Assignment
      |
      v
Recommended Recovery Action
      |
      v
Recovery Attempt
      |
      v
Revenue & Recovery Analytics
```

---

## 🤖 Explainable Machine Learning

RecoverAI does not provide only a recovery score.

It also explains why a transaction received a particular recommendation using factors such as:

* Failure reason
* Previous payment success rate
* Customer lifetime value
* Number of previous attempts
* Customer transaction history
* ML recovery probability

This makes recovery recommendations easier for merchants to understand.

---

## 🧠 RecoverAI Agent

RecoverAI includes a Gemini-powered AI Agent that can answer questions using actual merchant recovery data.

Example questions:

```text
Give me recovery summary.

Which failed payments should I prioritize?

Show me top recovery opportunities.

Tell me about transaction TXR1001.

Why does this transaction have this recovery probability?
```

The AI Agent uses tool calling to retrieve relevant merchant-specific transaction and recovery information.

---

## 📊 Analytics

RecoverAI provides business-focused recovery analytics including:

* Failed Payments
* At-Risk Revenue
* Expected Recovery
* Recovered Revenue
* Recovery Rate
* Successful Recoveries
* Before vs After Recovery Analysis

This helps merchants measure the actual impact of recovery actions.

---

## 🔐 Merchant Security

RecoverAI supports individual merchant accounts.

Each merchant receives a unique merchant identity.

JWT authentication ensures that:

* Merchants can securely login
* Protected APIs require authentication
* Each merchant sees only their own transactions
* Merchant recovery data remains isolated

---

## 📁 CSV Upload

Merchants can upload multiple failed payments using a CSV file.

Required columns:

```text
transaction_id
customer_id
amount
payment_method
failure_reason
attempt_number
previous_success_rate
customer_transaction_count
customer_lifetime_value
```

RecoverAI automatically associates uploaded transactions with the logged-in merchant.

---

## 🔌 API Highlights

```text
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me

POST  /api/transactions
POST  /api/transactions/upload-csv

POST  /api/recovery/simulate

GET   /api/analytics/summary
```

---

## 📂 Project Structure

```text
RecoverAI/
│
├── backend/
│   ├── app/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── ml/
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/RecoverAI.git
cd RecoverAI
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

### Windows

```bash
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🌐 Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=YOUR_POSTGRESQL_DATABASE_URL

LLM_PROVIDER=gemini
LLM_API_KEY=YOUR_GEMINI_API_KEY
LLM_MODEL=YOUR_GEMINI_MODEL

JWT_SECRET=YOUR_SECRET_KEY
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

> Never upload your real API keys, database passwords, or JWT secrets to GitHub.

---

## 📸 Screenshots

Add screenshots of:

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Transactions

![Transactions](screenshots/transactions.png)

### Recovery Recommendations

![Recovery](screenshots/recovery.png)

### RecoverAI Agent

![AI Agent](screenshots/agent.png)

### Analytics

![Analytics](screenshots/analytics.png)

---

**Live Demo:**
Link : `https://recover-ai-orcin-two.vercel.app/ `

---

## 📈 Business Impact

RecoverAI helps businesses:

* Reduce revenue leakage
* Identify high-value recovery opportunities
* Prioritize failed payments intelligently
* Improve recovery efficiency
* Make data-driven recovery decisions
* Track recovered revenue in real time

---

## 🔮 Future Improvements

Future versions of RecoverAI can include:

* Real payment gateway integration
* Automated retry scheduling
* Email and SMS recovery workflows
* Advanced ML model monitoring
* Real-time payment events
* Merchant recovery strategy optimization
* Advanced customer segmentation

---

## 👨‍💻 Developer

**Himanshu Pal**

B.Tech CSE (AI)

GitHub: `https://github.com/Himanshu1137`

LinkedIn: `linkedin.com/in/himanshu-23663929a `

---

## ⭐ Support

If you find RecoverAI useful, consider giving the repository a ⭐.

---

## 📄 License

This project is developed for educational, hackathon, and demonstration purposes.

````

### GitHub par aur professional banane ke liye

Repository me ye folder bhi banao:

```text
screenshots/
├── dashboard.png
├── transactions.png
├── recovery.png
├── agent.png
└── analytics.png
```
