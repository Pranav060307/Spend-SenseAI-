from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class TransactionItem(BaseModel):
    order_id: str
    customer_id: str
    customer_name: str
    customer_email: Optional[str] = None
    purchase_date: str # YYYY-MM-DD
    product_category: str
    product_name: str
    order_value: float
    payment_method: Optional[str] = "UPI"
    channel: Optional[str] = "Online"

class CustomerRFMModel(BaseModel):
    customer_id: str
    customer_name: str
    email: str
    recency_days: int
    frequency: int
    monetary: float
    avg_order_value: float
    first_purchase: str
    last_purchase: str
    r_score: int
    f_score: int
    m_score: int
    rfm_score: float
    segment: str
    churn_risk: str # 'Low' | 'Medium' | 'High' | 'Critical'
    top_category: str

class SegmentSummaryModel(BaseModel):
    type: str
    label: str
    description: str
    customer_count: int
    total_revenue: float
    avg_order_value: float
    avg_recency: int
    revenue_share: float
    recommended_action: str
    color: str
    badge_color: str

class BehaviorAnalysisModel(BaseModel):
    total_revenue: float
    unique_customers: int
    total_orders: int
    avg_order_value: float
    repeat_purchase_rate: float
    top_selling_categories: List[Dict[str, Any]]
    rising_products: List[Dict[str, Any]]
    co_purchase_opportunities: List[Dict[str, Any]]
    key_behavioral_insights: List[str]

class CampaignRequestModel(BaseModel):
    objective: str
    target_segment: str
    product_category: Optional[str] = None
    budget: float = 10000.0
    currency: str = "INR"

class SimulationRequestModel(BaseModel):
    name: str
    target_segment: str
    budget: float
    target_audience_size: int
    assumed_conversion_rate: float # in percent e.g. 5.0
    assumed_aov: float
    gross_margin_percent: float = 40.0
    discount_cost_percent: float = 10.0

class BudgetOptimizationRequest(BaseModel):
    total_budget: float
    target_segments: List[str]
    channels: List[str]
    objective: str = "MAXIMIZE_PROFITABLE_REVENUE"

class FeedbackReviewModel(BaseModel):
    review_id: str
    customer_id: str
    product_category: str
    product_name: str
    rating: int # 1 to 5
    review_text: str
    sentiment: Literal['positive', 'neutral', 'negative']
    complaint_tag: Optional[str] = None

class AgentQueryRequest(BaseModel):
    query: str
    transactions: Optional[List[TransactionItem]] = None
    currency_symbol: str = "₹"
