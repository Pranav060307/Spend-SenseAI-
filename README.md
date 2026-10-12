# SpendSense AI 🚀
> **Consumer Intelligence + Financially-Grounded Marketing Agent**  
> *Understand why customers spend. Predict what they need. Market with intelligence.*

---

## 🏗️ Architecture & Technology Stack
* **Frontend**: React 19 + Vite + TypeScript + Recharts + Lucide Icons + Canvas Confetti
* **Backend**: Python 3.11 + FastAPI + Uvicorn + Pydantic (Pure Data Science Analytics)
* **Styling**: Vanilla CSS Design System with dark mode, glow effects, responsive cards, and glassmorphism matching modern FinTech standards.

### The 5-Stage Agent Dispatch Pipeline
```
                    [User Asks A Question]
                              ↓
                    [Marketing AI Agent]
                              ↓
    ┌──────────────────────┬────────────────────┬────────────────────┬──────────────────────┐
[Customer Analytics]   [Segmentation Tool]   [Campaign Generator]   [Budget Simulator]   [Feedback Intel]
    └──────────────────────┴────────────────────┴────────────────────┴──────────────────────┘
                              ↓
                      [Verified Results]
                              ↓
               [Explanation & Recommendations]
                              ↓
                    [Dashboard Directives]
```

---

## ⚡ The 10 AI Functions Implemented

### 1. AI Consumer Behavior Analyst *(Core)*
* Analyzes purchase frequency, basket sizes, average order value (AOV), and rising categories.
* Identifies co-purchase affinities (e.g., *"Customers who purchase headphones frequently also buy chargers. Consider a bundle offer."*).

### 2. AI Customer Segmentation Assistant *(Core)*
* Groups customers using mathematical **RFM (Recency, Frequency, Monetary)** scores into 5 distinct cohorts:
  1. **High-Spending Champions**
  2. **Loyal Customers**
  3. **New & Promising Customers**
  4. **At-Risk Customers**
  5. **Inactive / Dormant Customers**
* Explains the behavioral traits of each cohort and recommends specific actions.

### 3. AI Campaign Generator *(Core)*
* Generates complete data-grounded campaigns from target segment, product category, objective, and budget.
* Automatically splits budget across channels (WhatsApp 55%, Meta Ads 30%, Email 15%) and generates ready-to-use creatives.

### 4. AI Campaign Performance Advisor *(Core Differentiator)*
* Interactive **What-If Simulator** comparing two campaigns (e.g., *VIP Loyalty Discount* vs *Inactive Win-Back*).
* Live sliders for Budget, Audience Size, Conversion Rate %, AOV, Gross Margin %, and Discount %.
* Displays projected orders, total cost, net profit, breakeven volume, and sensitivity analysis. Clearly labels all metrics as grounded projections.

### 5. AI Marketing Copilot Agent *(Core)*
* Interactive conversational assistant with real-time tool execution traces.
* Dispatches to internal analytical tools to verify facts before answering questions such as:
  * *"Why did repeat purchases decrease?"*
  * *"How should I use a ₹10,000 campaign budget?"*
  * *"Compare discounting loyal users vs win-back campaign"*
  * *"Which customer segment has the highest risk of churn?"*

### 6. Customer Churn Risk Predictor *(Advanced)*
* Heuristic model monitoring purchase recency and frequency drop-offs to flag customers at critical churn danger.
* Recommends tailored retention incentives based on past customer lifetime value.

### 7. Smart Product Recommendation Engine *(Advanced)*
* Market basket association analysis deriving frequent co-purchase pairs with confidence scores, bundle pricing, and customer savings.

### 8. Budget Optimization Agent *(Advanced)*
* Mathematical capital distributor allocating fixed marketing funds across segments and channels to maximize expected ROAS under constraints.

### 9. Multilingual Marketing Assistant *(Advanced)*
* Instantly generates localized campaign copy in **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.

### 10. Customer Feedback Intelligence *(Advanced)*
* Analyzes reviews and customer feedback sentiment, tags recurring complaints (e.g., delivery delays, hardware defects), and links sentiment drops to decelerating sales in specific categories.

---

## 🚀 Running the Prototype Locally

### 1. Python FastAPI Backend
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://127.0.0.1:8000/docs`

### 2. React Frontend
```bash
npm install
npm run dev
```
Open in browser: `http://127.0.0.1:5173/`
