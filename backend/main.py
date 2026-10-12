import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

from models import (
    TransactionItem,
    BehaviorAnalysisModel,
    CampaignRequestModel,
    SimulationRequestModel,
    BudgetOptimizationRequest,
    AgentQueryRequest,
)
import analytics_engine
from ai_agent import MarketingAIAgent

app = FastAPI(
    title="SpendSense AI API",
    description="FinTech + AI Consumer Intelligence and Marketing Platform Backend",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory default transactions store
DEFAULT_TRANSACTIONS: List[TransactionItem] = []

def initialize_default_data():
    global DEFAULT_TRANSACTIONS
    # Generate representative retail records
    items = [
        {"name": "Noise-Canceling Wireless Headphones", "cat": "Audio & Headphones", "price": 8499},
        {"name": "BassPro Bluetooth Earbuds", "cat": "Audio & Headphones", "price": 2999},
        {"name": "Smart Fitness Tracker Gen-4", "cat": "Smart Wearables", "price": 4499},
        {"name": "Amoled Pro Smartwatch", "cat": "Smart Wearables", "price": 11999},
        {"name": "Fast 65W GaN Charger & Cable Set", "cat": "Mobile Accessories", "price": 1899},
        {"name": "MagSafe Wireless PowerBank 10000mAh", "cat": "Mobile Accessories", "price": 2499},
        {"name": "Ergonomic Mechanical Keyboard RGB", "cat": "Computing & Office", "price": 6299},
        {"name": "Precision Wireless Vertical Mouse", "cat": "Computing & Office", "price": 3199},
    ]

    txs = []
    # 25 customers with distinct purchase cadences
    customers = [
        ("CUST-1001", "Aarav Sharma", 5, 4), # Champions
        ("CUST-1002", "Priya Patel", 5, 8),
        ("CUST-1003", "Rohan Deshmukh", 4, 12),
        ("CUST-1004", "Ananya Iyer", 3, 22), # Loyal
        ("CUST-1005", "Vikram Joshi", 3, 26),
        ("CUST-1006", "Sneha Kulkarni", 3, 30),
        ("CUST-1007", "Kabir Verma", 1, 6), # New / Promising
        ("CUST-1008", "Neha Gupta", 2, 9),
        ("CUST-1009", "Aditya Nair", 3, 52), # At-Risk
        ("CUST-1010", "Pooja Reddy", 3, 58),
        ("CUST-1011", "Karan Mehra", 2, 64),
        ("CUST-1012", "Ritu Sen", 1, 80), # Inactive
        ("CUST-1013", "Siddharth Rao", 1, 88),
    ]

    order_num = 1001
    for cust_id, name, orders_count, last_days_ago in customers:
        for idx in range(orders_count):
            days_ago = last_days_ago + (idx * 14)
            p = items[(idx + len(cust_id)) % len(items)]
            txs.append(
                TransactionItem(
                    order_id=f"ORD-{order_num}",
                    customer_id=cust_id,
                    customer_name=name,
                    customer_email=f"{cust_id.lower()}@customer.com",
                    purchase_date=f"2026-03-{max(1, min(28, 28 - (days_ago % 25))):02d}",
                    product_category=p["cat"],
                    product_name=p["name"],
                    order_value=float(p["price"]),
                    payment_method="UPI",
                    channel="Online"
                )
            )
            order_num += 1

    DEFAULT_TRANSACTIONS = txs

initialize_default_data()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SpendSense AI Python Backend",
        "default_transactions_count": len(DEFAULT_TRANSACTIONS),
        "engine": "FastAPI + Synthetic FinTech Analytics"
    }

# 1. AI Consumer Behavior Analyst
@app.post("/api/behavior/analyze", response_model=BehaviorAnalysisModel)
def analyze_behavior(transactions: Optional[List[TransactionItem]] = None):
    txs = transactions if transactions and len(transactions) > 0 else DEFAULT_TRANSACTIONS
    return analytics_engine.analyze_consumer_behavior(txs)

# 2. AI Customer Segmentation Assistant
@app.post("/api/segments/rfm")
def get_rfm_segments(transactions: Optional[List[TransactionItem]] = None):
    txs = transactions if transactions and len(transactions) > 0 else DEFAULT_TRANSACTIONS
    customers, segments = analytics_engine.compute_rfm(txs)
    return {
        "total_customers": len(customers),
        "segments": [s.dict() for s in segments],
        "customers": [c.dict() for c in customers],
    }

# 3. AI Campaign Generator & 9. Multilingual Marketing Assistant
@app.post("/api/campaign/generate")
def generate_campaign(req: CampaignRequestModel):
    wa_split = round(req.budget * 0.55)
    meta_split = round(req.budget * 0.30)
    email_split = round(req.budget * 0.15)
    sym = "₹" if req.currency == "INR" else "$"

    creatives = {
        "whatsapp": {
            "en": f"Hey {{CustomerName}}! 👋 Special {sym}500 repeat bonus on your next {req.product_category or 'store'} order above {sym}2,499. Use code: VIPREPEAT. Valid till Sunday!",
            "hi": f"नमस्ते {{CustomerName}}! 👋 आपके लिए विशेष {sym}500 की छूट! कूपन कोड: VIPREPEAT (न्यूनतम खरीदारी {sym}2,499)। ऑफर केवल रविवार तक वैध है।",
            "mr": f"नमस्कार {{CustomerName}}! 👋 आमच्या खास ग्राहकांसाठी {sym}500 ची विशेष सवलत! कोड वापरा: VIPREPEAT. ऑफर फक्त या रविवारपर्यंत वैध.",
            "cta": "Claim My Offer Now"
        },
        "email": {
            "subject": f"Exclusive reward: {sym}500 credit on your next order!",
            "body": f"Hi {{CustomerName}},\n\nThank you for choosing us! Enjoy an instant {sym}500 credit on orders over {sym}2,499 with code: VIPREPEAT.\n\nFree Priority Express Shipping included.",
            "cta": "Shop Collection"
        },
        "social": {
            "headline": f"Get {sym}500 Off Your Favorite Gear",
            "caption": "Limited to our exclusive customer cohort. Upgrade your setup with express delivery.",
            "cta": "Claim Voucher"
        }
    }

    return {
        "title": f"{req.objective} — {req.target_segment}",
        "target_segment": req.target_segment,
        "objective": req.objective,
        "budget": req.budget,
        "currency": req.currency,
        "budget_split": [
            {"channel": "WhatsApp Automated Reactivation", "amount": wa_split, "share": "55%"},
            {"channel": "Meta Retargeting Ads", "amount": meta_split, "share": "30%"},
            {"channel": "Segmented Email Sequence", "amount": email_split, "share": "15%"},
        ],
        "creatives": creatives,
        "duration_days": 10,
        "projected_roas": 4.6,
        "projected_reach": 850,
        "projected_conversions": 42,
    }

# 4. AI Campaign Performance Advisor (What-If Simulator)
@app.post("/api/campaign/simulate")
def simulate_campaigns(sim_a: SimulationRequestModel, sim_b: SimulationRequestModel):
    res_a = analytics_engine.simulate_campaign(
        name=sim_a.name,
        target_segment=sim_a.target_segment,
        budget=sim_a.budget,
        audience_size=sim_a.target_audience_size,
        assumed_conv_rate=sim_a.assumed_conversion_rate,
        assumed_aov=sim_a.assumed_aov,
        gross_margin_pct=sim_a.gross_margin_percent,
        discount_pct=sim_a.discount_cost_percent,
    )

    res_b = analytics_engine.simulate_campaign(
        name=sim_b.name,
        target_segment=sim_b.target_segment,
        budget=sim_b.budget,
        audience_size=sim_b.target_audience_size,
        assumed_conv_rate=sim_b.assumed_conversion_rate,
        assumed_aov=sim_b.assumed_aov,
        gross_margin_pct=sim_b.gross_margin_percent,
        discount_pct=sim_b.discount_cost_percent,
    )

    profit_diff = res_a["net_profit"] - res_b["net_profit"]
    advice = (
        f"{res_a['name']} produces ₹{abs(profit_diff):,.0f} higher net profit under current assumptions. "
        f"However, if customer retention improves by 1.5%, {res_b['name']} provides superior long-term customer lifetime value."
    )

    return {
        "campaign_a": res_a,
        "campaign_b": res_b,
        "profit_difference": profit_diff,
        "ai_advisor_verdict": advice,
        "label": "PROJECTIONS_NOT_GUARANTEED"
    }

# 5. Marketing AI Copilot Agent (Workflow Execution)
@app.post("/api/agent/chat")
def agent_chat(req: AgentQueryRequest):
    txs = req.transactions if req.transactions and len(req.transactions) > 0 else DEFAULT_TRANSACTIONS
    response = MarketingAIAgent.process_query(
        query=req.query,
        transactions=txs,
        currency_symbol=req.currency_symbol
    )
    return response

# 6. Customer Churn Risk Predictor
@app.get("/api/churn/predict")
def predict_churn():
    customers, _ = analytics_engine.compute_rfm(DEFAULT_TRANSACTIONS)
    at_risk = [c for c in customers if c.churn_risk in ["High", "Critical"]]
    return {
        "total_at_risk": len(at_risk),
        "at_risk_customers": [c.dict() for c in at_risk],
        "recommended_strategy": "Trigger priority WhatsApp win-back with ₹500 incentive within 7 days of threshold breach."
    }

# 7. Smart Product Recommendation Engine
@app.get("/api/products/recommendations")
def get_product_recommendations():
    behavior = analytics_engine.analyze_consumer_behavior(DEFAULT_TRANSACTIONS)
    return {
        "co_purchase_bundles": behavior.co_purchase_opportunities,
        "rising_products": behavior.rising_products,
    }

# 8. Budget Optimization Agent
@app.post("/api/budget/optimize")
def optimize_budget_endpoint(req: BudgetOptimizationRequest):
    _, segments = analytics_engine.compute_rfm(DEFAULT_TRANSACTIONS)
    return analytics_engine.optimize_budget(req.total_budget, segments)

# 10. Customer Feedback Intelligence
@app.get("/api/feedback/intelligence")
def feedback_intelligence():
    return analytics_engine.analyze_reviews_and_feedback()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
