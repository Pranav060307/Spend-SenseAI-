export interface Transaction {
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  purchase_date: string; // YYYY-MM-DD
  product_category: string;
  product_name: string;
  order_value: number;
  payment_method: string;
  channel: 'Online' | 'In-Store' | 'App';
}

export type RFMSegmentType = 
  | 'Champions'
  | 'Loyal Customers'
  | 'Potential Loyalists'
  | 'At-Risk Spenders'
  | 'Inactive / Churned';

export interface CustomerRFM {
  customer_id: string;
  customer_name: string;
  email: string;
  recency_days: number;
  frequency: number;
  monetary: number;
  avg_order_value: number;
  first_purchase: string;
  last_purchase: string;
  r_score: number; // 1-5
  f_score: number; // 1-5
  m_score: number; // 1-5
  rfm_score: number;
  segment: RFMSegmentType;
  churn_risk: 'Low' | 'Medium' | 'High' | 'Critical';
  top_category: string;
}

export interface SegmentSummary {
  type: RFMSegmentType;
  label: string;
  description: string;
  customer_count: number;
  total_revenue: number;
  avg_order_value: number;
  avg_recency: number;
  revenue_share: number; // percentage
  recommended_action: string;
  color: string;
  badge_color: string;
}

export interface ExecutiveMetrics {
  total_revenue: number;
  revenue_growth: number;
  total_orders: number;
  unique_customers: number;
  avg_order_value: number;
  repeat_purchase_rate: number;
  repeat_orders_count: number;
  active_customers_count: number;
  customer_lifetime_value: number;
  influenced_revenue: number;
  blended_roas: number;
  avg_win_rate: number;
  top_categories: { category: string; revenue: number; orders: number; share: number }[];
  monthly_trend: {
    month: string;
    revenue: number;
    conversions: number;
    sessions: number;
    repeatRevenue: number;
  }[];
  channel_performance: {
    channel: string;
    conversions: number;
    spend: number;
    revenue: number;
    roas: number;
    color: string;
  }[];
  top_campaigns: {
    name: string;
    segment: string;
    revenue: number;
    spend: number;
    roas: number;
    trend: number[];
    status: 'Active' | 'Optimizing' | 'Completed';
  }[];
}

export interface CampaignProposal {
  id: string;
  title: string;
  objective: string;
  target_segment: RFMSegmentType;
  target_audience_size: number;
  budget: number;
  currency: 'INR' | 'USD';
  budget_split: {
    channel: string;
    amount: number;
    percentage: number;
    purpose: string;
  }[];
  strategy_rationale: string;
  offer_details: {
    headline: string;
    discount: string;
    min_spend: string;
    validity_days: number;
  };
  creatives: {
    whatsapp: {
      en: string;
      hi: string;
      mr: string;
      cta: string;
    };
    email: {
      subject: string;
      body: string;
      cta: string;
    };
    social_ad: {
      headline: string;
      caption: string;
      cta: string;
    };
  };
  projected_outcomes: {
    expected_reach: number;
    projected_conversions: number;
    conversion_rate_percent: number;
    projected_revenue: number;
    gross_profit: number;
    estimated_roas: number;
    estimated_roi_percent: number;
  };
  assumptions: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  target_segment: RFMSegmentType;
  budget: number;
  target_audience_size: number;
  assumed_conversion_rate: number; // percentage e.g. 3.5%
  assumed_aov: number;
  gross_margin_percent: number; // e.g. 40%
  discount_cost_percent: number; // e.g. 10%
  // Calculated:
  projected_conversions: number;
  projected_revenue: number;
  cost_total: number;
  gross_profit: number;
  net_profit: number;
  projected_roas: number;
  projected_roi: number;
  breakeven_conversions: number;
}

export interface ProductAffinity {
  primary_product: string;
  recommended_product: string;
  co_purchase_count: number;
  confidence_score: number; // 0-100%
  bundle_price: number;
  discount_price: number;
  savings: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  tool_invocations?: {
    tool_name: string;
    params?: any;
    result_summary: string;
  }[];
  suggested_actions?: {
    label: string;
    action_type: 'generate_campaign' | 'open_simulator' | 'view_segment' | 'filter_data';
    payload?: any;
  }[];
}
