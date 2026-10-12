import { Transaction, RFMSegmentType } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface BehaviorAnalysisResponse {
  total_revenue: number;
  unique_customers: number;
  total_orders: number;
  avg_order_value: number;
  repeat_purchase_rate: number;
  top_selling_categories: {
    category: string;
    revenue: number;
    orders: number;
    share_percent: number;
  }[];
  rising_products: {
    product_name: string;
    category: string;
    orders: number;
    revenue: number;
    popularity_index: number;
  }[];
  co_purchase_opportunities: {
    pair: string;
    co_orders: number;
    confidence_score: number;
    recommendation: string;
  }[];
  key_behavioral_insights: string[];
}

export interface FeedbackIntelligenceResponse {
  total_reviews_analyzed: number;
  sentiment_breakdown: {
    positive_percent: number;
    negative_percent: number;
    neutral_percent: number;
    net_sentiment_index: number;
  };
  recurring_complaints: {
    tag: string;
    frequency: number;
    category_affected: string;
    revenue_impact_estimate: string;
    suggested_action: string;
  }[];
  sample_reviews: {
    review_id: string;
    customer_id: string;
    product_category: string;
    product_name: string;
    rating: number;
    review_text: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    complaint_tag?: string;
  }[];
}

export interface BudgetOptimizationResponse {
  total_budget: number;
  allocated_budget: number;
  projected_total_revenue: number;
  blended_projected_roas: number;
  optimization_objective: string;
  allocations: {
    segment: string;
    allocated_budget: number;
    allocation_percentage: number;
    recommended_channel: string;
    expected_roas: number;
    estimated_incremental_revenue: number;
  }[];
}

export interface AgentChatResponse {
  query: string;
  tools_called: {
    tool: string;
    description: string;
    output_summary: string;
  }[];
  verified_results: Record<string, any>;
  explanation: string;
  recommendation: string;
  suggested_actions: {
    label: string;
    type: string;
    segment?: string;
    budget?: number;
  }[];
}

export const api = {
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async analyzeBehavior(transactions: Transaction[]): Promise<BehaviorAnalysisResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/behavior/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactions),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend API offline, using client fallback', err);
    }
    return null;
  },

  async optimizeBudget(totalBudget: number): Promise<BudgetOptimizationResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/budget/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: totalBudget,
          target_segments: ['At-Risk Customers', 'New & Promising Customers', 'Loyal Customers'],
          channels: ['WhatsApp', 'Meta Ads', 'Email'],
        }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend API offline', err);
    }
    return null;
  },

  async getFeedbackIntelligence(): Promise<FeedbackIntelligenceResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/intelligence`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend API offline', err);
    }
    return null;
  },

  async askAgent(query: string, transactions: Transaction[], currencySymbol: string): Promise<AgentChatResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          transactions,
          currency_symbol: currencySymbol,
        }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend API offline', err);
    }
    return null;
  },
};
